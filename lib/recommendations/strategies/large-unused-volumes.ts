import type { Analyzer, Recommendation } from "../types";
import type { ResourceData, DigitalOceanVolume, DigitalOceanDroplet } from "@/lib/types/analyzer";
import { PricingService } from "../../services/pricing/pricing-service";

/**
 * Large Unused Volumes Analyzer
 *
 * Detects large volumes attached to powered-off droplets or volumes that could be downsized.
 * Volumes cost $0.10/GB/month, so large unused volumes waste significant money.
 *
 * Based on DigitalOcean API documentation:
 * - Volumes have `droplet_ids` array indicating attached droplets
 * - Droplets have `status` field ('active', 'off', etc.)
 * - Large volumes attached to off droplets are likely unused
 */
export class LargeUnusedVolumesAnalyzer implements Analyzer {
	private pricingService: PricingService;
	private readonly LARGE_VOLUME_THRESHOLD_GB = 100; // Consider volumes > 100GB as "large"

	constructor() {
		this.pricingService = PricingService.getInstance();
	}

	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		if (!data.volumes || data.volumes.length === 0) {
			return recommendations;
		}

		// Create a map of droplets by ID for quick lookup
		const dropletMap = new Map<string | number, DigitalOceanDroplet>();
		data.droplets.forEach((droplet) => {
			dropletMap.set(droplet.id, droplet);
		});

		data.volumes.forEach((volume) => {
			const sizeGB = volume.size_gigabytes || 0;

			// Skip small volumes
			if (sizeGB < this.LARGE_VOLUME_THRESHOLD_GB) {
				return;
			}

			const dropletIds = volume.droplet_ids || [];
			const monthlyCost = this.pricingService.calculateVolumeCost(sizeGB);

			// Case 1: Volume attached to powered-off droplets
			if (dropletIds.length > 0) {
				const attachedDroplets: DigitalOceanDroplet[] = [];
				let hasOffDroplet = false;

				for (const dropletId of dropletIds) {
					const droplet = dropletMap.get(dropletId);
					if (droplet) {
						attachedDroplets.push(droplet);
						if (droplet.status === 'off') {
							hasOffDroplet = true;
						}
					}
				}

				if (hasOffDroplet) {
					const offDroplets = attachedDroplets.filter((d) => d.status === 'off');
					recommendations.push({
						type: 'volume',
						subtype: 'volume_attached_to_off_droplet',
						title: 'Large Volume on Powered-Off Droplet',
						description: `Volume "${volume.name}" (${sizeGB}GB, $${monthlyCost.toFixed(2)}/month) is attached to ${offDroplets.length} powered-off droplet(s). Consider detaching and deleting if not needed.`,
						savings: monthlyCost,
						confidence: 'High',
						impact: 'Medium',
						resourceId: volume.id,
						resourceName: volume.name,
						warnings: [
							'Make sure you don\'t need the data on this volume before deleting it.',
							'You can detach the volume first to preserve the data.',
						],
						data: {
							size_gb: sizeGB,
							attached_to_off_droplets: offDroplets.map((d) => ({
								id: d.id,
								name: d.name,
							})),
						},
					});
				}
			}
			// Case 2: Large unattached volume (already covered by ZombieVolumesAnalyzer, but we can add more context)
			// This case is already handled by ZombieVolumesAnalyzer, so we skip it here
		});

		return recommendations;
	}
}
