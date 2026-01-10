import { Analyzer, Recommendation, ResourceData, ConfidenceLevel } from '../types';

/**
 * Estimated latencies between regions (in ms)
 * Lower is better
 */
const REGION_LATENCIES: Record<string, Record<string, number>> = {
	'nyc1': { 'nyc1': 0, 'nyc3': 5, 'sfo3': 80, 'ams3': 90, 'sgp1': 200, 'lon1': 85, 'fra1': 95, 'tor1': 30, 'blr1': 190, 'syd1': 220 },
	'nyc3': { 'nyc1': 5, 'nyc3': 0, 'sfo3': 80, 'ams3': 90, 'sgp1': 200, 'lon1': 85, 'fra1': 95, 'tor1': 30, 'blr1': 190, 'syd1': 220 },
	'sfo3': { 'nyc1': 80, 'nyc3': 80, 'sfo3': 0, 'ams3': 150, 'sgp1': 180, 'lon1': 140, 'fra1': 155, 'tor1': 60, 'blr1': 200, 'syd1': 140 },
	'ams3': { 'nyc1': 90, 'nyc3': 90, 'sfo3': 150, 'ams3': 0, 'sgp1': 170, 'lon1': 15, 'fra1': 10, 'tor1': 100, 'blr1': 120, 'syd1': 280 },
	'sgp1': { 'nyc1': 200, 'nyc3': 200, 'sfo3': 180, 'ams3': 170, 'sgp1': 0, 'lon1': 180, 'fra1': 175, 'tor1': 230, 'blr1': 50, 'syd1': 100 },
	'lon1': { 'nyc1': 85, 'nyc3': 85, 'sfo3': 140, 'ams3': 15, 'sgp1': 180, 'lon1': 0, 'fra1': 20, 'tor1': 95, 'blr1': 130, 'syd1': 290 },
	'fra1': { 'nyc1': 95, 'nyc3': 95, 'sfo3': 155, 'ams3': 10, 'sgp1': 175, 'lon1': 20, 'fra1': 0, 'tor1': 105, 'blr1': 125, 'syd1': 285 },
	'tor1': { 'nyc1': 30, 'nyc3': 30, 'sfo3': 60, 'ams3': 100, 'sgp1': 230, 'lon1': 95, 'fra1': 105, 'tor1': 0, 'blr1': 210, 'syd1': 200 },
	'blr1': { 'nyc1': 190, 'nyc3': 190, 'sfo3': 200, 'ams3': 120, 'sgp1': 50, 'lon1': 130, 'fra1': 125, 'tor1': 210, 'blr1': 0, 'syd1': 110 },
	'syd1': { 'nyc1': 220, 'nyc3': 220, 'sfo3': 140, 'ams3': 280, 'sgp1': 100, 'lon1': 290, 'fra1': 285, 'tor1': 200, 'blr1': 110, 'syd1': 0 },
};

interface DropletWithTraffic {
	id: string | number;
	name: string;
	status: string;
	region?: { slug: string } | string;
	trafficAnalysis?: {
		primarySourceRegion: string;
		trafficPercentage: number;
	};
}

export class ChangeRegionAnalyzer implements Analyzer {
	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		for (const droplet of data.droplets as DropletWithTraffic[]) {
			// Skip if no traffic analysis data
			if (!droplet.trafficAnalysis) {
				continue;
			}

			// Skip if not active
			if (droplet.status !== 'active') {
				continue;
			}

			const rec = this.analyzeDroplet(droplet);
			if (rec) {
				recommendations.push(rec);
			}
		}

		return recommendations;
	}

	private analyzeDroplet(droplet: DropletWithTraffic): Recommendation | null {
		const currentRegion =
			typeof droplet.region === "object"
				? droplet.region.slug
				: droplet.region;

		if (!droplet.trafficAnalysis || !currentRegion) {
			return null;
		}

		const { primarySourceRegion, trafficPercentage } =
			droplet.trafficAnalysis;

		// RULE: Only recommend if 80%+ traffic from a different region
		if (trafficPercentage < 80 || primarySourceRegion === currentRegion) {
			return null;
		}

		// Estimate latency improvement
		const latencyImprovement = this.estimateLatencyImprovement(
			currentRegion,
			primarySourceRegion
		);

		// RULE: Only recommend if > 50ms improvement
		if (latencyImprovement <= 50) {
			return null;
		}

		// Calculate confidence
		const confidence = this.calculateConfidence(trafficPercentage);

		return {
			type: 'droplet',
			subtype: 'change_region',
			title: `Move "${droplet.name}" to ${primarySourceRegion} for better performance`,
			description: `${trafficPercentage.toFixed(0)}% of traffic comes from ${primarySourceRegion}. Moving would reduce latency by ~${latencyImprovement}ms.`,
			savings: 0, // No cost savings, performance benefit only
			confidence,
			impact: 'High', // Requires migration
			warnings: [
				'🌐 Requires droplet migration or rebuild',
				'⚠️ IP address will change',
				'📊 This is a performance optimization, not a cost saving',
				'🔄 Update DNS records after migration',
			],
			remediationCommand: `# Create snapshot and rebuild in new region\ndoctl compute droplet-action snapshot ${droplet.id} --snapshot-name "pre-migration-${droplet.name}" --wait`,
			data: {
				currentRegion,
				suggestedRegion: primarySourceRegion,
				trafficPercentage,
				latencyImprovement,
				benefit: 'performance',
			},
		};
	}

	private estimateLatencyImprovement(
		currentRegion: string,
		targetRegion: string
	): number {
		// Get latency from target to itself (effectively 0) vs current to target
		const currentLatencies = REGION_LATENCIES[currentRegion];
		const targetLatencies = REGION_LATENCIES[targetRegion];

		if (!currentLatencies || !targetLatencies) {
			return 0;
		}

		// Latency from current region to target's users
		const currentToTarget = currentLatencies[targetRegion] || 0;
		// Latency from target region to target's users (local, low)
		const targetToTarget = targetLatencies[targetRegion] || 0;

		return currentToTarget - targetToTarget;
	}

	private calculateConfidence(trafficPercentage: number): ConfidenceLevel {
		if (trafficPercentage >= 90) {
			return 'High';
		}
		if (trafficPercentage >= 80) {
			return 'Medium';
		}
		return 'Low';
	}
}
