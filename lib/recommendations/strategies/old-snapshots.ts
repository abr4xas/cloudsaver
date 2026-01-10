import { Analyzer, Recommendation, ResourceData } from "../types";

interface Snapshot {
	id: string;
	name: string;
	created_at: string;
	min_disk_size: number;
}

export class OldSnapshotsAnalyzer implements Analyzer {
	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		(data.snapshots as unknown[]).forEach((s) => {
			const snapshot = s as Snapshot;
			// Snapshots are ~$0.05 per GB per month
			const createdAt = new Date(snapshot.created_at);

			if (createdAt < sixMonthsAgo) {
				const monthlyCost = snapshot.min_disk_size * 0.05;

				recommendations.push({
					type: 'snapshot',
					subtype: 'old_snapshot',
					title: 'Old Snapshot',
					description: `Snapshot "${snapshot.name}" is older than 6 months.`,
					savings: monthlyCost,
					confidence: 'Medium', // Medium because it might be a required regulatory backup
					impact: 'Low',
					resourceId: snapshot.id,
					resourceName: snapshot.name,
				});
			}
		});

		return recommendations;
	}
}
