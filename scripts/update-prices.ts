import { DigitalOceanService } from '../lib/services/digitalocean/digitalocean-service';
import * as fs from 'fs';
import * as path from 'path';

async function updatePrices() {
	const token = process.argv[2];
	if (!token) {
		console.error('Please provide a token arg');
		process.exit(1);
	}

	console.log('📥 Fetching all sizes from DigitalOcean API...\n');

	const doService = new DigitalOceanService({
		enablePerformanceLogging: false,
	});

	const sizes = await doService.fetchSizes(token);

	console.log(`✅ Found ${sizes.length} sizes\n`);

	// Read existing prices file
	const pricesPath = path.join(__dirname, '../lib/digitalocean-prices.json');
	const existingData = JSON.parse(fs.readFileSync(pricesPath, 'utf-8'));

	// Create a map of existing sizes by slug for quick lookup
	const existingSizesMap = new Map(
		existingData.sizes.map((s: { slug: string }) => [s.slug, s])
	);

	// Process all sizes from API
	const updatedSizes: Array<{
		slug: string;
		memory: number;
		vcpus: number;
		disk: number;
		transfer: number;
		price_monthly: number;
		price_hourly: number;
		available: boolean;
	}> = [];

	// Keep existing sizes that are still available
	for (const size of sizes) {
		const sizeData = {
			slug: size.slug,
			memory: size.memory,
			vcpus: size.vcpus,
			disk: size.disk,
			transfer: size.transfer,
			price_monthly: size.price_monthly,
			price_hourly: size.price_hourly,
			available: size.available,
		};

		updatedSizes.push(sizeData);

		// Log if it's a new size or if price changed
		const existing = existingSizesMap.get(size.slug);
		if (!existing) {
			console.log(`➕ New size: ${size.slug} - $${size.price_monthly}/month`);
		} else if (existing.price_monthly !== size.price_monthly) {
			console.log(
				`💰 Price changed: ${size.slug} - $${existing.price_monthly} → $${size.price_monthly}/month`
			);
		}
	}

	// Sort sizes by slug for easier reading
	updatedSizes.sort((a, b) => {
		// Sort by type prefix first (s-, c-, m-)
		const aPrefix = a.slug.split('-')[0];
		const bPrefix = b.slug.split('-')[0];
		if (aPrefix !== bPrefix) {
			return aPrefix.localeCompare(bPrefix);
		}
		// Then by vcpus
		if (a.vcpus !== b.vcpus) {
			return a.vcpus - b.vcpus;
		}
		// Then by memory
		if (a.memory !== b.memory) {
			return a.memory - b.memory;
		}
		// Finally by slug
		return a.slug.localeCompare(b.slug);
	});

	// Update the JSON structure
	const updatedData = {
		...existingData,
		sizes: updatedSizes,
		last_updated: new Date().toISOString().split('T')[0],
	};

	// Write back to file
	fs.writeFileSync(pricesPath, JSON.stringify(updatedData, null, 2) + '\n');

	console.log(`\n✅ Updated ${pricesPath}`);
	console.log(`📊 Total sizes: ${updatedSizes.length}`);
	console.log(
		`📈 Basic sizes (s-): ${updatedSizes.filter((s) => s.slug.startsWith('s-')).length}`
	);
	console.log(
		`💪 CPU-optimized (c-): ${updatedSizes.filter((s) => s.slug.startsWith('c-')).length}`
	);
	console.log(
		`🧠 Memory-optimized (m-): ${updatedSizes.filter((s) => s.slug.startsWith('m-')).length}`
	);
}

updatePrices().catch(console.error);
