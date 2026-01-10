import { Analyzer, Recommendation, ResourceData } from "../types";

interface Droplet {
	id: string;
	name: string;
	status: string;
	size: {
		price_monthly: number;
	};
}

export class ZombieDropletsAnalyzer implements Analyzer {
	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		(data.droplets as unknown[]).forEach((d) => {
			const droplet = d as Droplet;
			if (droplet.status === 'off') {
				const monthlyCost = droplet.size.price_monthly;

				recommendations.push({
					type: 'droplet',
					subtype: 'zombie_droplet',
					title: 'Powered Off Droplet',
					description: `Droplet "${droplet.name}" is powered off but you are still being charged for it.`,
					savings: monthlyCost,
					confidence: 'High',
					impact: 'Low', // If it's off, it's likely not critical right now
					resourceId: droplet.id,
					resourceName: droplet.name,
				});
			}
		});

		return recommendations;
	}
}
