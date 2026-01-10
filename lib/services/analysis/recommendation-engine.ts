/**
 * Recommendation Engine
 *
 * Orchestrates the analysis of DigitalOcean resources by:
 * 1. Fetching all resources from DigitalOcean API
 * 2. Running all analyzers in parallel
 * 3. Grouping repetitive recommendations
 * 4. Calculating total costs and savings
 * 5. Returning comprehensive analysis results
 */

import { DigitalOceanService } from '../digitalocean/digitalocean-service';
import { PricingService } from '../pricing/pricing-service';
import type { AnalysisResult, Recommendation, ResourceData } from '../types/analysis';
import type { Recommendation as LegacyRecommendation } from '../../recommendations/types';
import type { Analyzer } from '../../recommendations/types';

export interface RecommendationEngineConfig {
	digitalOceanService: DigitalOceanService;
	pricingService: PricingService;
	analyzers?: Analyzer[];
}

export class RecommendationEngine {
	private readonly digitalOceanService: DigitalOceanService;
	private readonly pricingService: PricingService;
	private readonly analyzers: Analyzer[];
	// Memoization cache for expensive calculations within a single analysis
	private readonly costCache: Map<string, number> = new Map();

	constructor(config: RecommendationEngineConfig) {
		this.digitalOceanService = config.digitalOceanService;
		this.pricingService = config.pricingService;
		this.analyzers = config.analyzers || [];
	}

	/**
	 * Clear memoization cache (should be called at the start of each analysis)
	 */
	private clearCache(): void {
		this.costCache.clear();
	}

	/**
	 * Register an analyzer
	 */
	registerAnalyzer(analyzer: Analyzer): this {
		this.analyzers.push(analyzer);
		return this;
	}

	/**
	 * Analyze resources and generate recommendations
	 *
	 * @param token - DigitalOcean API token
	 * @returns Promise resolving to complete analysis results
	 */
	async analyze(token: string): Promise<AnalysisResult> {
		// Clear cache at the start of each analysis
		this.clearCache();

		// Fetch all resources from DigitalOcean concurrently
		const resources = await this.digitalOceanService.fetchAllResources(token);

		// Convert to ResourceData format expected by analyzers
		const resourceData: ResourceData = {
			droplets: resources.droplets,
			volumes: resources.volumes,
			snapshots: resources.snapshots,
			databases: resources.databases,
			reserved_ips: resources.reserved_ips,
			load_balancers: resources.load_balancers,
		};

		// Run all analyzers in parallel
		const rawRecommendations = await Promise.all(
			this.analyzers.map((analyzer) => analyzer.analyze(resourceData))
		);

		// Flatten results
		const allRecommendations = rawRecommendations.flat();

		// Group repetitive recommendations
		const recommendations = this.groupRecommendations(allRecommendations);

		// Calculate metrics (memoize expensive calculations)
		const totalSavings = recommendations.reduce(
			(sum, rec) => sum + rec.savings,
			0
		);
		const monthlyCost = this.calculateMonthlyCost(resourceData);
		// Memoize high confidence count calculation
		const opportunitiesCount = recommendations.length;
		const highConfidenceCount = this.getHighConfidenceCount(recommendations);

		// Calculate savings percentage with proper validation
		let savingsPercentage = 0;
		if (monthlyCost > 0) {
			savingsPercentage = Math.round((totalSavings / monthlyCost) * 100 * 100) / 100;
			// Ensure percentage is within valid range (0-100%)
			savingsPercentage = Math.max(0, Math.min(100, savingsPercentage));
		}

		return {
			monthlyCost: this.roundCurrency(monthlyCost),
			potentialSavings: this.roundCurrency(totalSavings),
			savingsPercentage,
			resourcesFound: this.countResources(resourceData),
			opportunities: opportunitiesCount,
			highConfidence: highConfidenceCount,
			recommendations,
		};
	}

	/**
	 * Group repetitive recommendations by resource type and subtype
	 *
	 * Groups recommendations that have the same type and subtype together.
	 * For example, all "zombie_droplet" recommendations are grouped together,
	 * and all "old_snapshot" recommendations are grouped together.
	 */
	groupRecommendations(
		recommendations: Recommendation[] | LegacyRecommendation[]
	): Recommendation[] {
		if (recommendations.length === 0) {
			return [];
		}

		// Normalize recommendations to service format
		const normalizedRecs: Recommendation[] = recommendations.map((rec) => {
			const legacyRec = rec as LegacyRecommendation;
			return {
				type: rec.type,
				subtype: rec.subtype,
				title: rec.title,
				description: rec.description,
				savings: rec.savings,
				confidence: rec.confidence,
				impact: rec.impact || ('Medium' as const),
				resourceName: rec.resourceName,
				warnings: rec.warnings || [],
				remediation: legacyRec.remediationCommand,
				data: rec.data || {},
			};
		});

		// Group by type + subtype combination
		const groups = new Map<string, Recommendation[]>();

		for (const rec of normalizedRecs) {
			// Create a unique key from type and subtype
			const groupKey = `${rec.type}:${rec.subtype}`;

			if (!groups.has(groupKey)) {
				groups.set(groupKey, []);
			}
			groups.get(groupKey)!.push(rec);
		}

		const finalRecommendations: Recommendation[] = [];

		for (const [_groupKey, group] of groups.entries()) {
			if (group.length === 1) {
				finalRecommendations.push(group[0]);
				continue;
			}

			// Group them into a summary recommendation
			const totalSavings = group.reduce((sum, r) => sum + r.savings, 0);
			const count = group.length;

			// Get type and subtype from the first item (all items in group have same type/subtype)
			const type = group[0].type;
			const subtype = group[0].subtype;

			// Create a more descriptive title based on subtype
			const title = this.getGroupedTitleBySubtype(type, subtype, count);

			const description = `Found ${count} ${subtype.replace(/_/g, ' ')}${count > 1 ? 's' : ''}. See details for a full breakdown.`;

			// Determine group confidence based on lowest confidence in the group
			// Priority: Low > Medium > High (Low is the most conservative)
			const confidencePriority: Record<string, number> = {
				Low: 1,
				Medium: 2,
				High: 3,
			};

			const groupConfidence = group
				.map((r) => r.confidence)
				.sort(
					(a, b) =>
						(confidencePriority[a] || 3) -
						(confidencePriority[b] || 3)
				)[0] || 'Low';

			finalRecommendations.push({
				type,
				subtype: `grouped_${subtype}`,
				title,
				description,
				savings: this.roundCurrency(totalSavings),
				confidence: groupConfidence,
				impact: group[0].impact || 'Medium',
				data: {
					count,
					recommendations: group.map((r) => ({
						subtype: r.subtype,
						title: r.title,
						resourceName: r.resourceName,
						savings: this.roundCurrency(r.savings),
						confidence: r.confidence,
						warnings: r.warnings || [],
						description: r.description || '',
					})),
				},
			});
		}

		return finalRecommendations;
	}

	/**
	 * Get grouped title for a resource type and subtype
	 *
	 * @private
	 */
	private getGroupedTitleBySubtype(
		type: string,
		subtype: string,
		count: number
	): string {
		// Map common subtypes to readable titles
		const subtypeTitles: Record<string, string> = {
			zombie_droplet: 'Powered Off Droplets',
			zombie_volume: 'Unattached Volumes',
			old_snapshot: 'Old Snapshots',
			redundant_backups: 'Redundant Backups',
			droplet_downgrade: 'Underutilized Droplets',
			database_optimization: 'Over-Provisioned Databases',
			consolidate_droplets: 'Consolidation Opportunities',
			change_region: 'Region Optimization',
			unused_reserved_ip: 'Unused Reserved IPs',
			idle_load_balancer: 'Idle Load Balancers',
		};

		const readableSubtype =
			subtypeTitles[subtype] || subtype.replace(/_/g, ' ');

		// Capitalize first letter
		const capitalizedSubtype =
			readableSubtype.charAt(0).toUpperCase() +
			readableSubtype.slice(1);

		return `${count} ${capitalizedSubtype}`;
	}

	/**
	 * Calculate total monthly cost using PricingService
	 *
	 * @private
	 */
	private calculateMonthlyCost(data: ResourceData): number {
		// Calculate droplet costs including attached volumes
		const dropletCost = data.droplets.reduce((sum: number, droplet) => {
			return (
				sum +
				this.pricingService.calculateDropletMonthlyCost(
					droplet as Record<string, unknown>,
					data.volumes as Array<Record<string, unknown>>
				)
			);
		}, 0);

		// Calculate database costs
		const databaseCost = data.databases.reduce((sum: number, database) => {
			const size = (database as { size?: string }).size || '';
			return sum + this.pricingService.getDatabasePrice(size);
		}, 0);

		// Only count volumes that are NOT attached to any droplet (unattached volumes)
		const volumeCost = data.volumes
			.filter(
				(volume) =>
					!(volume as { droplet_ids?: unknown[] }).droplet_ids ||
					(volume as { droplet_ids: unknown[] }).droplet_ids.length ===
					0
			)
			.reduce((sum: number, volume) => {
				const sizeGB =
					(volume as { size_gigabytes?: number }).size_gigabytes || 0;
				return sum + this.pricingService.calculateVolumeCost(sizeGB);
			}, 0);

		// Calculate snapshot costs
		const snapshotCost = data.snapshots.reduce((sum: number, snapshot) => {
			return (
				sum +
				this.pricingService.calculateSnapshotCostFromData(
					snapshot as Record<string, unknown>,
					data.droplets as Array<Record<string, unknown>>,
					data.volumes as Array<Record<string, unknown>>
				)
			);
		}, 0);

		// Calculate load balancer costs
		const loadBalancerCost = data.load_balancers.reduce((sum: number, lb) => {
			const lbType =
				(lb as { type?: string }).type === 'REGIONAL_NETWORK'
					? 'network'
					: 'http';
			return sum + this.pricingService.getLoadBalancerPrice(lbType);
		}, 0);

		// Calculate reserved IP costs (only unassigned IPs)
		const reservedIpCost = data.reserved_ips
			.filter(
				(ip) =>
					!(ip as { droplet?: unknown }).droplet ||
					(ip as { droplet: unknown }).droplet === null
			)
			.reduce((sum: number) => {
				return sum + this.pricingService.getReservedIPMonthlyPrice();
			}, 0);

		const totalCost =
			dropletCost +
			databaseCost +
			volumeCost +
			snapshotCost +
			loadBalancerCost +
			reservedIpCost;

		return this.roundCurrency(totalCost);
	}

	/**
	 * Count total resources
	 *
	 * @private
	 */
	private countResources(data: ResourceData): number {
		return (
			data.droplets.length +
			data.volumes.length +
			data.snapshots.length +
			data.databases.length +
			data.reserved_ips.length +
			data.load_balancers.length
		);
	}

	/**
	 * Get count of high confidence recommendations (memoized)
	 *
	 * @private
	 */
	private getHighConfidenceCount(recommendations: Recommendation[]): number {
		// Simple memoization: if we've calculated this before with same length, reuse
		const cacheKey = `highConfidence:${recommendations.length}`;
		if (this.costCache.has(cacheKey)) {
			return this.costCache.get(cacheKey)!;
		}

		const count = recommendations.filter(
			(r) => r.confidence === 'High'
		).length;
		this.costCache.set(cacheKey, count);
		return count;
	}

	/**
	 * Round currency to 2 decimal places
	 *
	 * @private
	 */
	private roundCurrency(value: number): number {
		return Math.round(value * 100) / 100;
	}
}
