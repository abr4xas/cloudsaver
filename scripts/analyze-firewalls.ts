import { DigitalOceanService } from '../lib/services/digitalocean/digitalocean-service';

async function analyzeFirewalls() {
	const token = process.argv[2];
	if (!token) {
		console.error('Please provide a token arg');
		process.exit(1);
	}

	console.log('🔥 Analyzing Firewalls...\n');

	const doService = new DigitalOceanService();
	// Access private apiClient through type assertion for script purposes
	const apiClient = (doService as unknown as { apiClient: { getBaseUrl: () => string } }).apiClient;
	const baseUrl = apiClient.getBaseUrl();

	try {
		const response = await fetch(`${baseUrl}/firewalls?per_page=100`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			console.error(`Error: ${response.status} ${response.statusText}`);
			return;
		}

		const data = await response.json();
		const firewalls = data.firewalls || [];

		console.log(`Found ${firewalls.length} firewalls\n`);

		for (const fw of firewalls) {
			console.log(`Firewall: ${fw.name || fw.id}`);
			console.log(`  - Status: ${fw.status || 'unknown'}`);
			console.log(`  - Created: ${fw.created_at || 'unknown'}`);

			// Check inbound rules
			const inboundRules = fw.inbound_rules || [];
			console.log(`  - Inbound Rules: ${inboundRules.length}`);

			// Check outbound rules
			const outboundRules = fw.outbound_rules || [];
			console.log(`  - Outbound Rules: ${outboundRules.length}`);

			// Check attached resources
			const dropletIds = fw.droplet_ids || [];
			const tags = fw.tags || [];
			console.log(`  - Attached Droplets: ${dropletIds.length}`);
			console.log(`  - Tags: ${tags.length}`);

			// Check for overly permissive rules
			const permissiveInbound = inboundRules.filter((rule: {
				protocol?: string;
				sources?: { addresses?: string[] };
				ports?: string;
			}) => {
				// Check for rules that allow all traffic
				return rule.protocol === 'icmp' ||
					(rule.sources?.addresses?.includes('0.0.0.0/0') && rule.ports === 'all');
			});

			if (permissiveInbound.length > 0) {
				console.log(`  ⚠️  Warning: ${permissiveInbound.length} overly permissive inbound rules`);
			}

			// Check for empty firewalls (no droplets attached)
			if (dropletIds.length === 0 && tags.length === 0) {
				console.log(`  ⚠️  Warning: Firewall has no attached resources`);
			}

			console.log('');
		}

		// Summary
		const emptyFirewalls = firewalls.filter((fw: {
			droplet_ids?: unknown[];
			tags?: unknown[];
		}) =>
			(fw.droplet_ids || []).length === 0 && (fw.tags || []).length === 0
		);

		if (emptyFirewalls.length > 0) {
			console.log(`\n💡 Cost Optimization Opportunity:`);
			console.log(`   Found ${emptyFirewalls.length} firewalls with no attached resources`);
			console.log(`   While firewalls don't cost money, they indicate potential unused infrastructure`);
		}

	} catch (error) {
		console.error('Error fetching firewalls:', error);
	}
}

analyzeFirewalls().catch(console.error);
