import { Analyzer, Recommendation, ResourceData } from "../types";

export class RedundantBackupsAnalyzer implements Analyzer {
	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		data.droplets.forEach((droplet) => {
			// Logic: If backups are enabled AND we detect manual snapshots, it *might* be redundant.
			// However, we need to be careful. For this MVP Phase 1 spec:
			// "Backups enabled + Snapshots manuales recientes (3+ in last 30 days)"

			if (droplet.backups_enabled) {
				// Find snapshots for this droplet
				const dropletSnapshots = data.snapshots.filter(s => {
					// DO Snapshots for droplets usually have resource_id pointing to droplet
					// But the 'dots-wrapper' listSnapshots response might vary.
					// Typically resource_id matches droplet id.
					return s.resource_id === droplet.id;
				});

				// Filter for recent manual snapshots (last 30 days)
				const thirtyDaysAgo = new Date();
				thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

				const recentManualSnapshots = dropletSnapshots.filter(s => {
					const createdAt = new Date(s.created_at);
					return createdAt > thirtyDaysAgo && s.resource_type === 'droplet';
				});

				if (recentManualSnapshots.length >= 3) {
					const backupCost = droplet.size.price_monthly * 0.20; // 20% of droplet cost

					recommendations.push({
						type: 'droplet',
						subtype: 'redundant_backups',
						title: 'Redundant Backups',
						description: `You have auto-backups enabled for "${droplet.name}" but also take frequent manual snapshots.`,
						savings: backupCost,
						confidence: 'Medium',
						impact: 'Low',
						resourceId: droplet.id,
						resourceName: droplet.name,
					});
				}
			}
		});

		return recommendations;
	}
}
