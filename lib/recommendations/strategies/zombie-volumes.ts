import { Analyzer, Recommendation, ResourceData } from "../types";

export class ZombieVolumesAnalyzer implements Analyzer {
	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		// Check for unattached volumes
		// In DigitalOcean API, volumes attached to droplets have 'droplet_ids' array populated
		data.volumes.forEach((volume) => {
			if (!volume.droplet_ids || volume.droplet_ids.length === 0) {
				// Simple logic: if not attached, it's a zombie.
				// In a real scenario we might check 'detached_at' timestamp if available,
				// but the wrapper/CLI often just gives current state.
				// We'll rely on current state for MVP as defined in spec (Phase 1).

				const monthlyCost = volume.size_gigabytes * 0.10; // Approx $0.10/GB

				recommendations.push({
					type: 'volume',
					subtype: 'zombie_volume',
					title: 'Unattached Volume',
					description: `Volume "${volume.name}" (${volume.size_gigabytes}GB) is not attached to any droplet.`,
					savings: monthlyCost,
					confidence: 'High', // High certainty for unattached resources
					impact: 'Low',      // Safe to delete if confirmed unused
					resourceId: volume.id,
					resourceName: volume.name,
				});
			}
		});

		return recommendations;
	}
}
