import type { Analyzer, Recommendation } from "../types";
import type { ResourceData, DigitalOceanSnapshot } from "@/lib/types/analyzer";
import { PricingService } from "../../services/pricing/pricing-service";

/**
 * Duplicate Snapshots Analyzer
 *
 * Detects duplicate snapshots from the same resource created within a short time period.
 * DigitalOcean bills snapshots based on min_disk_size, so duplicates waste money.
 *
 * Based on DigitalOcean API documentation:
 * - Snapshots have `resource_id` and `resource_type` fields
 * - Multiple snapshots of the same resource are often redundant
 * - We group by resource_id + resource_type and find duplicates within 7 days
 */
export class DuplicateSnapshotsAnalyzer implements Analyzer {
	private pricingService: PricingService;
	private readonly DUPLICATE_WINDOW_DAYS = 7; // Consider snapshots within 7 days as potential duplicates

	constructor() {
		this.pricingService = PricingService.getInstance();
	}

	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		if (!data.snapshots || data.snapshots.length === 0) {
			return recommendations;
		}

		// Group snapshots by resource_id + resource_type
		const snapshotGroups = new Map<string, DigitalOceanSnapshot[]>();

		data.snapshots.forEach((snap) => {
			const resourceId = String(snap.resource_id || '');
			const resourceType = snap.resource_type || 'unknown';
			const groupKey = `${resourceType}:${resourceId}`;

			if (!snapshotGroups.has(groupKey)) {
				snapshotGroups.set(groupKey, []);
			}
			snapshotGroups.get(groupKey)!.push(snap);
		});

		// Find groups with multiple snapshots
		for (const [groupKey, snapshots] of snapshotGroups.entries()) {
			if (snapshots.length < 2) {
				continue; // Skip groups with only one snapshot
			}

			// Sort by creation date (newest first)
			snapshots.sort((a, b) => {
				const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
				const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
				return dateB - dateA;
			});

			// Find snapshots created within the duplicate window
			const duplicates: DigitalOceanSnapshot[] = [];
			const newest = snapshots[0];
			const newestDate = newest.created_at ? new Date(newest.created_at).getTime() : 0;

			for (let i = 1; i < snapshots.length; i++) {
				const snap = snapshots[i];
				const snapDate = snap.created_at ? new Date(snap.created_at).getTime() : 0;
				const daysDiff = (newestDate - snapDate) / (1000 * 60 * 60 * 24);

				if (daysDiff <= this.DUPLICATE_WINDOW_DAYS) {
					duplicates.push(snap);
				}
			}

			if (duplicates.length > 0) {
				// Calculate total savings from removing duplicates
				let totalSavings = 0;
				const duplicateNames: string[] = [];

				for (const duplicate of duplicates) {
					const minDiskSize = (duplicate as any).min_disk_size_gb || duplicate.min_disk_size || 0;
					const cost = this.pricingService.calculateSnapshotCost(minDiskSize);
					totalSavings += cost;
					duplicateNames.push(duplicate.name || duplicate.id);
				}

				if (totalSavings > 0) {
					const [resourceType, resourceId] = groupKey.split(':');
					recommendations.push({
						type: 'snapshot',
						subtype: 'duplicate_snapshot',
						title: `${duplicates.length} Duplicate Snapshots`,
						description: `Found ${duplicates.length} snapshots of the same ${resourceType} (ID: ${resourceId}) created within ${this.DUPLICATE_WINDOW_DAYS} days. Keeping only the most recent snapshot and removing duplicates could save $${totalSavings.toFixed(2)}/month.`,
						savings: totalSavings,
						confidence: 'Medium',
						impact: 'Low',
						resourceName: `${resourceType}:${resourceId}`,
						warnings: [
							'Make sure you don\'t need these older snapshots before deleting them.',
							'Consider your backup retention policy.',
						],
						data: {
							resource_type: resourceType,
							resource_id: resourceId,
							duplicate_count: duplicates.length,
							duplicate_names: duplicateNames,
							newest_snapshot: newest.name || newest.id,
							oldest_duplicate: duplicates[duplicates.length - 1].name || duplicates[duplicates.length - 1].id,
						},
					});
				}
			}
		}

		return recommendations;
	}
}
