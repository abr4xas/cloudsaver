import { DigitalOceanService } from '../lib/services/digitalocean/digitalocean-service';

async function exploreResources() {
	const token = process.argv[2];
	if (!token) {
		console.error('Please provide a token arg');
		process.exit(1);
	}

	console.log('🔍 Exploring DigitalOcean API resources...\n');

	const doService = new DigitalOceanService({
		enablePerformanceLogging: false,
	});

	// Fetch all current resources
	console.log('📦 Fetching current resources...\n');
	const resources = await doService.fetchAllResources(token);

	console.log('Current Resources:');
	console.log(`  - Droplets: ${resources.droplets.length}`);
	console.log(`  - Volumes: ${resources.volumes.length}`);
	console.log(`  - Snapshots: ${resources.snapshots.length}`);
	console.log(`  - Databases: ${resources.databases.length}`);
	console.log(`  - Reserved IPs: ${resources.reserved_ips.length}`);
	console.log(`  - Load Balancers: ${resources.load_balancers.length}\n`);

	// Analyze what we have
	console.log('📊 Resource Analysis:\n');

	// Droplets analysis
	if (resources.droplets.length > 0) {
		const activeDroplets = resources.droplets.filter((d: { status?: string }) => d.status === 'active');
		const offDroplets = resources.droplets.filter((d: { status?: string }) => d.status === 'off');
		console.log('Droplets:');
		console.log(`  - Active: ${activeDroplets.length}`);
		console.log(`  - Powered Off: ${offDroplets.length}`);

		// Check for droplets with monitoring disabled
		const dropletsWithMonitoring = resources.droplets.filter((d: { features?: string[] }) =>
			(d.features || []).includes('monitoring')
		);
		console.log(`  - With Monitoring: ${dropletsWithMonitoring.length}`);
		console.log(`  - Without Monitoring: ${resources.droplets.length - dropletsWithMonitoring.length}`);
	}

	// Volumes analysis
	if (resources.volumes.length > 0) {
		const attachedVolumes = resources.volumes.filter((v: { droplet_ids?: unknown[] }) =>
			(v.droplet_ids || []).length > 0
		);
		const unattachedVolumes = resources.volumes.filter((v: { droplet_ids?: unknown[] }) =>
			!(v.droplet_ids || []).length
		);
		console.log('\nVolumes:');
		console.log(`  - Attached: ${attachedVolumes.length}`);
		console.log(`  - Unattached: ${unattachedVolumes.length}`);

		// Calculate total volume size
		const totalVolumeSize = resources.volumes.reduce((sum: number, v: { size_gigabytes?: number }) =>
			sum + ((v.size_gigabytes || 0)), 0
		);
		console.log(`  - Total Size: ${totalVolumeSize} GB`);
	}

	// Snapshots analysis
	if (resources.snapshots.length > 0) {
		const dropletSnapshots = resources.snapshots.filter((s: { resource_type?: string }) =>
			s.resource_type === 'droplet'
		);
		const volumeSnapshots = resources.snapshots.filter((s: { resource_type?: string }) =>
			s.resource_type === 'volume'
		);
		console.log('\nSnapshots:');
		console.log(`  - From Droplets: ${dropletSnapshots.length}`);
		console.log(`  - From Volumes: ${volumeSnapshots.length}`);

		// Check old snapshots (older than 30 days)
		const now = Date.now();
		const oldSnapshots = resources.snapshots.filter((s: { created_at?: string }) => {
			if (!s.created_at) return false;
			const created = new Date(s.created_at).getTime();
			const daysOld = (now - created) / (1000 * 60 * 60 * 24);
			return daysOld > 30;
		});
		console.log(`  - Older than 30 days: ${oldSnapshots.length}`);
	}

	// Databases analysis
	if (resources.databases.length > 0) {
		console.log('\nDatabases:');
		const dbTypes = new Map<string, number>();
		resources.databases.forEach((db: { engine?: string }) => {
			const engine = db.engine || 'unknown';
			dbTypes.set(engine, (dbTypes.get(engine) || 0) + 1);
		});
		dbTypes.forEach((count, engine) => {
			console.log(`  - ${engine}: ${count}`);
		});
	}

	// Load Balancers analysis
	if (resources.load_balancers.length > 0) {
		console.log('\nLoad Balancers:');
		const httpLBs = resources.load_balancers.filter((lb: { type?: string }) =>
			lb.type !== 'REGIONAL_NETWORK'
		);
		const networkLBs = resources.load_balancers.filter((lb: { type?: string }) =>
			lb.type === 'REGIONAL_NETWORK'
		);
		console.log(`  - HTTP: ${httpLBs.length}`);
		console.log(`  - Network: ${networkLBs.length}`);

		// Check for LBs with no droplets attached
		const emptyLBs = resources.load_balancers.filter((lb: { droplet_ids?: unknown[] }) =>
			!(lb.droplet_ids || []).length
		);
		console.log(`  - Empty (no droplets): ${emptyLBs.length}`);
	}

	// Try to fetch additional resources that might be available
	console.log('\n🔎 Exploring additional API endpoints...\n');

	// Access private apiClient through type assertion for script purposes
	const apiClient = (doService as unknown as { apiClient: { getBaseUrl: () => string } }).apiClient;
	const baseUrl = apiClient.getBaseUrl();

	// List of potential endpoints to explore
	const endpointsToExplore = [
		'/cdn/endpoints',
		'/firewalls',
		'/kubernetes/clusters',
		'/monitoring/alerts',
		'/projects',
		'/registry',
		'/spaces',
		'/vpc',
		'/apps',
		'/functions',
	];

	for (const endpoint of endpointsToExplore) {
		try {
			const response = await fetch(`${baseUrl}${endpoint}?per_page=1`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				signal: AbortSignal.timeout(5000),
			});

			if (response.ok) {
				const data = await response.json();
				const resourceName = endpoint.split('/').pop() || endpoint;
				const count = Array.isArray(data) ? data.length :
					(data.meta?.total || (data[resourceName]?.length || 0));

				if (count > 0 || response.status === 200) {
					console.log(`✅ ${endpoint}: Available (${count} items)`);
				}
			} else if (response.status === 404) {
				// Endpoint doesn't exist or not available
				console.log(`❌ ${endpoint}: Not available (404)`);
			} else if (response.status === 403) {
				// Permission denied but endpoint exists
				console.log(`⚠️  ${endpoint}: Available but requires permissions (403)`);
			}
		} catch {
			// Timeout or other error - endpoint might not exist
			console.log(`❌ ${endpoint}: Error or timeout`);
		}
	}

	console.log('\n💡 Potential Cost Optimization Opportunities:\n');
	console.log('1. Firewalls: Check for unused firewall rules');
	console.log('2. CDN Endpoints: Verify if CDN is being used efficiently');
	console.log('3. Kubernetes Clusters: Check for idle or over-provisioned clusters');
	console.log('4. Spaces (Object Storage): Check for unused buckets or old files');
	console.log('5. Container Registry: Check for old/unused images');
	console.log('6. VPCs: Check for unused VPCs');
	console.log('7. Apps Platform: Check for idle apps');
	console.log('8. Functions: Check for unused serverless functions');
}

exploreResources().catch(console.error);
