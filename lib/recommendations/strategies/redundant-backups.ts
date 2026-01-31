import type { Analyzer, Recommendation } from "../types";
import type { ResourceData, DigitalOceanDroplet, DigitalOceanSnapshot } from "@/lib/types/analyzer";

export class RedundantBackupsAnalyzer implements Analyzer {
	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		data.droplets.forEach((droplet) => {
			// Logic: If backups are enabled AND we detect manual snapshots, it *might* be redundant.
			// However, we need to be careful. For this MVP Phase 1 spec:
			// "Backups enabled + Snapshots manuales recientes (3+ in last 30 days)"

			const backupsEnabled = (droplet as any).backups_enabled;
			if (backupsEnabled) {
				// Find snapshots for this droplet
				const dropletSnapshots = data.snapshots.filter((snapshot) => {
					// DO Snapshots for droplets usually have resource_id pointing to droplet
					// But the 'dots-wrapper' listSnapshots response might vary.
					// Typically resource_id matches droplet id.
					return snapshot.resource_id === String(droplet.id);
				});

				// Filter for recent manual snapshots (last 30 days)
				const thirtyDaysAgo = new Date();
				thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

				const recentManualSnapshots = dropletSnapshots.filter((snapshot) => {
					const createdAt = new Date(snapshot.created_at);
					return createdAt > thirtyDaysAgo && snapshot.resource_type === 'droplet';
				});

				if (recentManualSnapshots.length >= 3) {
					const backupCost = (droplet.size?.price_monthly || 0) * 0.20; // 20% of droplet cost

					recommendations.push({
						type: 'droplet',
						subtype: 'redundant_backups',
						title: 'Redundant Backups',
						description: `You have auto-backups enabled for "${droplet.name}" but also take frequent manual snapshots.`,
						savings: backupCost,
						confidence: 'Medium',
						impact: 'Low',
						resourceId: String(droplet.id),
						resourceName: droplet.name,
					});
				}
			}
		});

		return recommendations;
	}
}
