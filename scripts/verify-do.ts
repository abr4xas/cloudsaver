import { getDOTS } from '../lib/dots';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyConnection() {
	console.log('Verifying DigitalOcean connection...');

	// Accept token from command line argument
	const token = process.argv[2];

	if (!token) {
		console.error('❌ Error: Please provide the DigitalOcean API token as an argument.');
		console.error('Usage: npx tsx scripts/verify-do.ts <YOUR_TOKEN>');
		process.exit(1);
	}

	try {
		// Pass token explicitly
		const dots = getDOTS(token);
		const { data: account } = (await dots.account.getAccount()) as {
			data: { account: { email: string; status: string } };
		};

		console.log('✅ Connection Successful!');
		console.log(`   Account Email: ${account.account.email}`);
		console.log(`   Status: ${account.account.status}`);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("❌ Connection Failed:", errorMessage);

		const err = error as {
			response?: { status: number; data: unknown };
		};
		if (err.response) {
			console.error("   Status:", err.response.status);
			console.error("   Body:", err.response.data);
		}
		process.exit(1);
	}
}

verifyConnection();
