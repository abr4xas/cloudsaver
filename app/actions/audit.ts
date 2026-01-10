'use server';

/**
 * Server action for analyzing DigitalOcean accounts
 *
 * NOTE: This is a legacy implementation. The main analysis logic
 * is now in /app/api/analyze/route.ts. This file is kept for
 * backward compatibility but should be deprecated.
 *
 * @deprecated Use /api/analyze endpoint instead
 */

import { isDemoToken, DEMO_DATA } from '@/lib/demo-data';
import { Recommendation } from '@/lib/recommendations/types';
import { DigitalOceanService } from '@/lib/services/digitalocean/digitalocean-service';
import { PricingService } from '@/lib/services/pricing/pricing-service';
import { RecommendationEngine as MainEngine } from '@/lib/services/analysis/recommendation-engine';
import { logError } from "@/lib/error-handler";
import { getAllAnalyzers } from '@/lib/recommendations/analyzer-registry';

export interface AuditResult {
	monthlyCost: number;
	potentialSavings: number;
	savingsPercentage: number;
	resourcesFound: number;
	recommendations: Recommendation[];
	error?: string;
	isDemo?: boolean;
}

/**
 * Analyze DigitalOcean account (legacy server action)
 *
 * @deprecated Use /api/analyze endpoint instead for better error handling and rate limiting
 */
export async function analyzeAccount(token: string): Promise<AuditResult> {
	if (!token) {
		return {
			monthlyCost: 0,
			potentialSavings: 0,
			savingsPercentage: 0,
			resourcesFound: 0,
			recommendations: [],
			error: 'Token is required',
		};
	}

	// Check for demo token - return mock data
	if (isDemoToken(token)) {
		return {
			...DEMO_DATA,
			isDemo: true,
		};
	}

	try {
		// Use the same engine as the API route for consistency
		const doService = new DigitalOceanService({
			enablePerformanceLogging: process.env.NODE_ENV === 'development',
		});

		const pricingService = PricingService.getInstance();
		const engine = new MainEngine({
			digitalOceanService: doService,
			pricingService,
		});

		// Register all analyzers automatically from registry
		const analyzers = getAllAnalyzers();
		for (const analyzer of analyzers) {
			engine.registerAnalyzer(analyzer);
		}

		// Analyze
		const result = await engine.analyze(token);

		// Convert to legacy format
		return {
			monthlyCost: result.monthlyCost,
			potentialSavings: Math.round(result.potentialSavings * 100) / 100,
			savingsPercentage: Math.max(0, Math.min(100, result.savingsPercentage)),
			resourcesFound: result.resourcesFound,
			recommendations: result.recommendations.map((rec) => ({
				type: rec.type,
				subtype: rec.subtype,
				title: rec.title,
				description: rec.description,
				savings: Math.round(rec.savings * 100) / 100,
				confidence: rec.confidence,
				impact: rec.impact || 'Medium',
				resourceName: rec.resourceName,
				warnings: rec.warnings || [],
				remediation: (rec as { remediationCommand?: string }).remediationCommand,
				data: rec.data || {},
			})) as Recommendation[],
		};

	} catch (error: unknown) {
		logError(error, {
			component: 'audit-action',
			action: 'analyze_account',
		});

		return {
			monthlyCost: 0,
			potentialSavings: 0,
			savingsPercentage: 0,
			resourcesFound: 0,
			recommendations: [],
			error: error instanceof Error ? error.message : 'Failed to analyze account',
		};
	}
}
