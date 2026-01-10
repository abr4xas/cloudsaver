import { analyzeAccount } from '../app/actions/audit';

async function verifyAudit() {
	const token = process.argv[2];
	if (!token) {
		console.error('Please provide a token arg');
		process.exit(1);
	}

	console.log('Running audit with Recommendation Engine...');
	const result = await analyzeAccount(token);

	if (result.error) {
		console.error('Error:', result.error);
		process.exit(1);
	}

	console.log('--- Summary ---');
	console.log(`Resources Found: ${result.resourcesFound}`);
	console.log(`Monthly Cost: $${result.monthlyCost}`);
	console.log(`Potential Savings: $${result.potentialSavings}`);
	console.log(`Savings %: ${result.savingsPercentage}%`);
	console.log('\n--- Recommendations ---');

	result.recommendations.forEach((rec, i) => {
		console.log(`${i + 1}. [${rec.confidence}] ${rec.title} -> Save $${rec.savings.toFixed(2)}`);
		// console.log(`   ${rec.description}`);
	});
}

verifyAudit();
