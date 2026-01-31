import type { Analyzer, Recommendation, ConfidenceLevel } from '../types';
import type { ResourceData, DigitalOceanDatabase } from '@/lib/types/analyzer';
import { PricingService } from '@/lib/services/pricing/pricing-service';

/**
 * Database downgrade map: maps current size to next smaller size
 */
const DATABASE_DOWNGRADE_MAP: Record<string, string> = {
	'db-s-4vcpu-8gb': 'db-s-2vcpu-4gb',
	'db-s-2vcpu-4gb': 'db-s-1vcpu-2gb',
	'db-s-1vcpu-2gb': 'db-s-1vcpu-1gb',
};

interface DatabaseMetrics {
	cpuAvg: number;
	diskUsagePercent: number;
	avgConnections: number;
	periodDays: number;
}

interface DBWithMetrics extends DigitalOceanDatabase {
	metrics?: DatabaseMetrics;
}

export class DatabaseOptimizationAnalyzer implements Analyzer {
	private pricingService: PricingService;

	constructor() {
		this.pricingService = PricingService.getInstance();
	}

	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		// Skip if no databases in data
		if (!data.databases || data.databases.length === 0) {
			return recommendations;
		}

		for (const database of data.databases as DBWithMetrics[]) {
			// Skip if no metrics available
			if (!database.metrics) {
				continue;
			}

			const metrics: DatabaseMetrics = database.metrics;
			const size = database.size;

			// Skip if not a known pricing size
			const currentPrice = size ? this.pricingService.getDatabasePrice(size) : 0;
			if (!size || !currentPrice) {
				continue;
			}

			// Check for zombie database first (0 connections for 14+ days)
			if (metrics.avgConnections < 1 && metrics.periodDays >= 14) {
				recommendations.push(
					this.createZombieRecommendation(database, metrics)
				);
				continue;
			}

			// Check for underutilized database
			if (metrics.periodDays >= 7) {
				const rec = this.analyzeUnderutilized(database, metrics, size);
				if (rec) {
					recommendations.push(rec);
				}
			}
		}

		return recommendations;
	}

	private createZombieRecommendation(
		database: DBWithMetrics,
		metrics: DatabaseMetrics
	): Recommendation {
		const monthlyCost = database.size ? this.pricingService.getDatabasePrice(database.size) : 0;

		return {
			type: "database",
			subtype: "zombie_database",
			title: `Delete unused database "${database.name}"`,
			description: `This database has had 0 connections for ${metrics.periodDays} days. You're paying $${monthlyCost}/mo for an unused resource.`,
			savings: monthlyCost,
			confidence: "High",
			impact: "Medium",
			resourceId: database.id?.toString(),
			resourceName: database.name,
			warnings: [
				"💾 Export and backup any important data before deleting",
				"🔍 Verify this database is truly unused by your applications",
			],
			remediationCommand: `doctl databases delete ${database.id} --force`,
			data: {
				avgConnections: metrics.avgConnections,
				periodDays: metrics.periodDays,
				engine: database.engine,
			},
		};
	}

	private analyzeUnderutilized(
		database: DBWithMetrics,
		metrics: DatabaseMetrics,
		currentSize: string
	): Recommendation | null {
		const { cpuAvg, diskUsagePercent, avgConnections } = metrics;

		// RULE: CPU < 20% AND Disk < 50% AND Connections < 10
		if (cpuAvg >= 20 || diskUsagePercent >= 50 || avgConnections >= 10) {
			return null;
		}

		// Get suggested downgrade
		const suggestedSize = DATABASE_DOWNGRADE_MAP[currentSize];
		if (!suggestedSize) {
			return null;
		}

		// Calculate savings
		const currentPrice = this.pricingService.getDatabasePrice(currentSize);
		const suggestedPrice = this.pricingService.getDatabasePrice(suggestedSize);
		const monthlySavings = currentPrice - suggestedPrice;

		if (monthlySavings <= 0) {
			return null;
		}

		// Calculate confidence
		const confidence = this.calculateConfidence(metrics);

		return {
			type: 'database',
			subtype: 'database_downgrade',
			title: `Downgrade database "${database.name}" to optimize costs`,
			description: `Low usage detected: ${cpuAvg.toFixed(1)}% CPU, ${diskUsagePercent.toFixed(1)}% disk, ${avgConnections.toFixed(0)} avg connections. Safe to downgrade to reduce monthly costs.`,
			savings: monthlySavings,
			confidence,
			impact: 'Low',
			resourceId: database.id?.toString(),
			resourceName: database.name,
			currentPlan: currentSize,
			suggestedPlan: suggestedSize,
			warnings: [
				'💾 Create a backup before resizing',
				'⏱️ Resizing may cause brief downtime',
				'📊 Monitor performance after downgrade',
			],
			remediationCommand: `doctl databases resize ${database.id} --size ${suggestedSize}`,
			data: {
				avgCpu: cpuAvg,
				diskUsagePercent,
				avgConnections,
				periodDays: metrics.periodDays,
				engine: database.engine,
			},
		};
	}

	private calculateConfidence(metrics: DatabaseMetrics): ConfidenceLevel {
		// High confidence if all metrics very low for 7+ days
		if (
			metrics.cpuAvg < 10 &&
			metrics.diskUsagePercent < 30 &&
			metrics.avgConnections < 5 &&
			metrics.periodDays >= 7
		) {
			return 'High';
		}

		// Medium confidence if data period is shorter
		if (metrics.periodDays >= 7) {
			return 'Medium';
		}

		return 'Low';
	}
}
