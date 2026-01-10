import { Analyzer, Recommendation, ResourceData, ConfidenceLevel, DropletMetrics } from '../types';
import { DROPLET_PRICING, savingsCalculator } from '../../savings-calculator';

/**
 * Downgrade table: maps current size to next smaller size
 */
const DOWNGRADE_MAP: Record<string, string> = {
	's-8vcpu-16gb': 's-4vcpu-8gb',
	's-4vcpu-8gb': 's-2vcpu-4gb',
	's-2vcpu-4gb': 's-2vcpu-2gb',
	's-2vcpu-2gb': 's-1vcpu-2gb',
	's-1vcpu-2gb': 's-1vcpu-1gb',
	's-1vcpu-1gb': 's-1vcpu-512mb-10gb',
};

interface DropletWithMetrics {
	id: string | number;
	name: string;
	status: string;
	size: { slug: string } | string;
	metrics: DropletMetrics;
}

export class DropletDowngradeAnalyzer implements Analyzer {
	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		for (const d of data.droplets) {
			const droplet = d as DropletWithMetrics;
			// Skip if no metrics available or droplet is not active
			if (!droplet.metrics || droplet.status !== "active") {
				continue;
			}

			const metrics: DropletMetrics = droplet.metrics;
			const size =
				typeof droplet.size === "object"
					? droplet.size.slug
					: droplet.size;

			// Skip if not a basic droplet or smallest tier
			if (!DROPLET_PRICING[size] || size === "s-1vcpu-512mb-10gb") {
				continue;
			}

			// Check minimum data period (7+ days)
			if (metrics.periodDays < 7) {
				continue;
			}

			const recommendation = this.analyzeDroplet(droplet, metrics, size);
			if (recommendation) {
				recommendations.push(recommendation);
			}
		}

		return recommendations;
	}

	private analyzeDroplet(
		droplet: DropletWithMetrics,
		metrics: DropletMetrics,
		currentSize: string
	): Recommendation | null {
		const { cpuAvg, memoryAvg, periodDays } = metrics;

		// RULE: CPU < 20% AND RAM < 40% for recommendation
		if (cpuAvg >= 20 || memoryAvg >= 40) {
			return null;
		}

		// Determine downgrade level based on utilization
		const suggestedSize = this.getSuggestedDowngrade(
			currentSize,
			cpuAvg,
			memoryAvg
		);

		if (!suggestedSize) {
			return null;
		}

		// Calculate savings
		const monthlySavings = savingsCalculator.calculateMonthlySavings(
			currentSize,
			suggestedSize
		);

		if (monthlySavings <= 0) {
			return null;
		}

		// Calculate confidence level
		const confidence = this.calculateConfidence(cpuAvg, memoryAvg);

		return {
			type: 'droplet',
			subtype: 'droplet_downgrade',
			title: `Reduce "${droplet.name}" to optimize costs`,
			description: `This droplet is using only ${cpuAvg.toFixed(1)}% CPU and ${memoryAvg.toFixed(1)}% RAM on average over ${periodDays} days. You can safely downgrade to reduce monthly costs.`,
			savings: monthlySavings,
			confidence,
			impact: 'Medium',
			resourceId: droplet.id?.toString(),
			resourceName: droplet.name,
			currentPlan: currentSize,
			suggestedPlan: suggestedSize,
			warnings: [
				'📸 Create a snapshot before resizing',
				'⏱️ Monitor performance for 24-48h after downgrade',
			],
			remediationCommand: `doctl compute droplet-action resize ${droplet.id} --size ${suggestedSize} --wait`,
			data: {
				avgCpu: cpuAvg,
				avgRam: memoryAvg,
				periodDays,
			},
		};
	}

	/**
	 * Determine the suggested downgrade size based on utilization levels.
	 *
	 * - Aggressive (2 tiers): CPU < 15% AND RAM < 30%
	 * - Conservative (1 tier): CPU < 25% AND RAM < 50%
	 */
	private getSuggestedDowngrade(
		currentSize: string,
		cpuAvg: number,
		memoryAvg: number
	): string | null {
		const oneTierDown = DOWNGRADE_MAP[currentSize];

		if (!oneTierDown) {
			return null;
		}

		// Aggressive downgrade: 2 tiers down
		if (cpuAvg < 15 && memoryAvg < 30) {
			const twoTiersDown = DOWNGRADE_MAP[oneTierDown];
			if (twoTiersDown) {
				return twoTiersDown;
			}
		}

		// Conservative downgrade: 1 tier down
		if (cpuAvg < 25 && memoryAvg < 50) {
			return oneTierDown;
		}

		return null;
	}

	/**
	 * Calculate confidence level based on utilization.
	 */
	private calculateConfidence(
		cpuAvg: number,
		memoryAvg: number
	): ConfidenceLevel {
		if (cpuAvg < 10 && memoryAvg < 25) {
			return 'High';
		}
		if (cpuAvg < 20 && memoryAvg < 40) {
			return 'Medium';
		}
		return 'Low';
	}
}
