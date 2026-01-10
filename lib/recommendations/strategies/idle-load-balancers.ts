import { Analyzer, Recommendation, ResourceData } from "../types";
import { PricingService } from "../../services/pricing/pricing-service";

interface LoadBalancer {
	id: string;
	name: string;
	type?: string;
	droplet_ids?: number[];
	status?: string;
}

/**
 * Idle Load Balancers Analyzer
 *
 * Detects load balancers with no droplets attached or very few droplets.
 * Load balancers cost $12-15/month, so empty ones are wasting money.
 *
 * Based on DigitalOcean API documentation:
 * - Load balancers have a `droplet_ids` array
 * - If empty, the LB has no droplets attached
 * - If only 1 droplet, it might not need a LB
 */
export class IdleLoadBalancersAnalyzer implements Analyzer {
	private pricingService: PricingService;

	constructor() {
		this.pricingService = new PricingService();
	}

	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const recommendations: Recommendation[] = [];

		if (!data.load_balancers || data.load_balancers.length === 0) {
			return recommendations;
		}

		(data.load_balancers as unknown[]).forEach((lb) => {
			const loadBalancer = lb as LoadBalancer;
			const dropletIds = loadBalancer.droplet_ids || [];
			const lbType = loadBalancer.type === 'REGIONAL_NETWORK' ? 'network' : 'http';
			const monthlyCost = this.pricingService.getLoadBalancerPrice(lbType);

			// Case 1: Empty load balancer (no droplets attached)
			if (dropletIds.length === 0) {
				recommendations.push({
					type: 'load_balancer',
					subtype: 'idle_load_balancer',
					title: 'Empty Load Balancer',
					description: `Load balancer "${loadBalancer.name}" has no droplets attached. You're paying $${monthlyCost.toFixed(2)}/month for an unused resource.`,
					savings: monthlyCost,
					confidence: 'High',
					impact: 'Medium',
					resourceId: loadBalancer.id,
					resourceName: loadBalancer.name,
					warnings: [
						'Make sure this load balancer is not needed before deleting it.',
						'Check if there are any DNS records pointing to this load balancer.',
					],
					remediation: `# Delete the load balancer\ncurl -X DELETE https://api.digitalocean.com/v2/load_balancers/${loadBalancer.id} \\\n  -H "Authorization: Bearer YOUR_TOKEN"`,
					data: {
						type: lbType,
						droplet_count: 0,
					},
				});
			}
			// Case 2: Load balancer with only 1 droplet (might not need LB)
			else if (dropletIds.length === 1) {
				recommendations.push({
					type: 'load_balancer',
					subtype: 'underutilized_load_balancer',
					title: 'Underutilized Load Balancer',
					description: `Load balancer "${loadBalancer.name}" only has 1 droplet attached. A load balancer is typically used for high availability with multiple droplets. Consider if this LB is necessary.`,
					savings: monthlyCost,
					confidence: 'Medium',
					impact: 'Low',
					resourceId: loadBalancer.id,
					resourceName: loadBalancer.name,
					warnings: [
						'If you need high availability, keep the load balancer and add more droplets.',
						'If this is for a single server, you might not need a load balancer.',
					],
					data: {
						type: lbType,
						droplet_count: 1,
						droplet_ids: dropletIds,
					},
				});
			}
		});

		return recommendations;
	}
}
