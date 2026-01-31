import type { Analyzer, Recommendation } from '../types';
import type { ResourceData, DigitalOceanDroplet } from '@/lib/types/analyzer';
import { PricingService } from '@/lib/services/pricing/pricing-service';

/**
 * Eligible small droplet sizes for consolidation
 */
const SMALL_DROPLET_SIZES = ['s-1vcpu-1gb', 's-1vcpu-2gb', 's-2vcpu-2gb'];

/**
 * Mapping of total vCPUs to suggested consolidated size
 */
const CONSOLIDATED_SIZE_MAP: { maxVcpus: number; size: string }[] = [
	{ maxVcpus: 2, size: 's-2vcpu-2gb' },
	{ maxVcpus: 4, size: 's-2vcpu-4gb' },
	{ maxVcpus: 6, size: 's-4vcpu-8gb' },
	{ maxVcpus: 8, size: 's-4vcpu-8gb' },
	{ maxVcpus: 16, size: 's-8vcpu-16gb' },
];

/**
 * vCPU count by size
 */
const SIZE_VCPUS: Record<string, number> = {
	's-1vcpu-1gb': 1,
	's-1vcpu-2gb': 1,
	's-2vcpu-2gb': 2,
};

interface ConsolidationCandidate {
	id: string;
	name: string;
	size: string;
	region: string;
	monthlyCost: number;
	vcpus: number;
}

/**
 * ConsolidateDropletsAnalyzer
 *
 * Identifies multiple small, underutilized droplets in the same region
 * that could be consolidated into a single larger droplet.
 */
export class ConsolidateDropletsAnalyzer implements Analyzer {
	private pricingService: PricingService;

	constructor() {
		this.pricingService = PricingService.getInstance();
	}

	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		// Filter small, underutilized droplets
		const candidates = this.filterCandidates(data.droplets);

		// Group by region
		const byRegion = this.groupByRegion(candidates);

		// Analyze each region
		for (const [region, droplets] of Object.entries(byRegion)) {
			// Need at least 2 droplets in same region
			if (droplets.length < 2) {
				continue;
			}

			const rec = this.analyzeRegion(region, droplets);
			if (rec) {
				recommendations.push(rec);
			}
		}

		return recommendations;
	}

	private filterCandidates(droplets: DigitalOceanDroplet[]): ConsolidationCandidate[] {
		const candidates: ConsolidationCandidate[] = [];

		for (const droplet of droplets) {
			const size = droplet.size?.slug;

			if (!size) {
				continue;
			}

			// Must be a small droplet size
			if (!SMALL_DROPLET_SIZES.includes(size)) {
				continue;
			}

			// Must be active
			if (droplet.status !== "active") {
				continue;
			}

			// Check utilization: CPU < 30% AND RAM < 40%
			const metrics = (droplet as any).metrics;
			if (!metrics || metrics.cpuAvg >= 30 || metrics.memoryAvg >= 40) {
				continue;
			}

			const monthlyCost =
				this.pricingService.getDropletPrice(size) ||
				droplet.size?.price_monthly ||
				0;

			const region = droplet.region?.slug;

			if (!region) {
				continue;
			}

			candidates.push({
				id: droplet.id?.toString(),
				name: droplet.name,
				size,
				region,
				monthlyCost,
				vcpus: SIZE_VCPUS[size] || 1,
			});
		}

		return candidates;
	}

	private groupByRegion(candidates: ConsolidationCandidate[]): Record<string, ConsolidationCandidate[]> {
		return candidates.reduce((acc, candidate) => {
			if (!acc[candidate.region]) {
				acc[candidate.region] = [];
			}
			acc[candidate.region].push(candidate);
			return acc;
		}, {} as Record<string, ConsolidationCandidate[]>);
	}

	private analyzeRegion(region: string, droplets: ConsolidationCandidate[]): Recommendation | null {
		// Calculate total current cost
		const totalCurrentCost = droplets.reduce((sum, d) => sum + d.monthlyCost, 0);

		// Calculate total vCPUs needed
		const totalVcpus = droplets.reduce((sum, d) => sum + d.vcpus, 0);

		// Determine consolidated size
		const consolidatedSize = this.getConsolidatedSize(totalVcpus);
		if (!consolidatedSize) {
			return null;
		}

		const consolidatedCost = this.pricingService.getDropletPrice(consolidatedSize);
		const savings = totalCurrentCost - consolidatedCost;

		// Only recommend if savings > $5/month
		if (savings <= 5) {
			return null;
		}

		const dropletNames = droplets.map((d) => d.name).join(', ');

		return {
			type: 'droplet',
			subtype: 'consolidate_droplets',
			title: `Consolidate ${droplets.length} droplets in ${region} to optimize costs`,
			description: `These ${droplets.length} small droplets are underutilized. Combine them into one ${consolidatedSize} droplet to reduce monthly costs.`,
			savings,
			confidence: 'Low', // Always low - requires manual analysis
			impact: 'High',   // High effort required
			warnings: [
				'🔧 Requires manual migration',
				'🧪 Test thoroughly in staging first',
				'📊 May affect performance',
				'🔄 Review application architecture before consolidating',
			],
			data: {
				dropletNames,
				dropletCount: droplets.length,
				currentTotalCost: totalCurrentCost,
				suggestedSize: consolidatedSize,
				suggestedCost: consolidatedCost,
				region,
			},
		};
	}

	private getConsolidatedSize(totalVcpus: number): string | null {
		for (const mapping of CONSOLIDATED_SIZE_MAP) {
			if (totalVcpus <= mapping.maxVcpus) {
				return mapping.size;
			}
		}
		// Too many vCPUs, can't consolidate into a single droplet
		return null;
	}
}
