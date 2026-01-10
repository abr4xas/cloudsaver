import { NextResponse } from "next/server";
import { DigitalOceanService } from "@/lib/services/digitalocean/digitalocean-service";
import { PricingService } from "@/lib/services/pricing/pricing-service";
import { RecommendationEngine } from "@/lib/services/analysis/recommendation-engine";
import { isDemoToken, DEMO_DATA } from "@/lib/demo-data";
import { DigitalOceanApiException } from "@/lib/services/digitalocean/api-client";
import { withRateLimit } from "@/lib/rate-limit";
import { handleApiError, logError } from "@/lib/error-handler";
import { ValidationError } from "@/lib/errors";
import { nextCacheConfig } from "@/lib/cache";
import { getAllAnalyzers } from "@/lib/recommendations/analyzer-registry";
import { validateTokenFormat } from "@/lib/validation/token-validator";

/**
 * Validate DigitalOcean API token format (server-side)
 * Throws ValidationError if token is invalid
 */
function validateToken(token: string): void {
	const result = validateTokenFormat(token);
	if (!result.valid) {
		throw new ValidationError(result.error || "Invalid token format");
	}
}

/**
 * Analyze DigitalOcean account
 */
async function analyzeAccount(token: string) {
	// Initialize services
	const doService = new DigitalOceanService({
		enablePerformanceLogging: process.env.NODE_ENV === "development",
	});

	const pricingService = PricingService.getInstance();

	// Initialize recommendation engine with services
	const engine = new RecommendationEngine({
		digitalOceanService: doService,
		pricingService,
	});

	// Register all analyzers automatically from registry
	const analyzers = getAllAnalyzers();
	for (const analyzer of analyzers) {
		engine.registerAnalyzer(analyzer);
	}

	// Analyze account
	const result = await engine.analyze(token);

	// Extract and format values
	const monthlyCost = result.monthlyCost;
	const totalSavings = result.potentialSavings;
	const savingsPercentage = result.savingsPercentage;
	const resourcesFound = result.resourcesFound;
	const opportunities = result.opportunities;
	const highConfidence = result.highConfidence;
	const groupedRecommendations = result.recommendations;

	return {
		monthlyCost,
		potentialSavings: Math.round(totalSavings * 100) / 100,
		savingsPercentage: Math.max(0, Math.min(100, savingsPercentage)),
		resourcesFound,
		opportunities,
		highConfidence,
		recommendations: groupedRecommendations.map((rec) => ({
			type: rec.type,
			subtype: rec.subtype,
			title: rec.title,
			description: rec.description,
			savings: Math.round(rec.savings * 100) / 100,
			confidence: rec.confidence,
			impact: rec.impact || "Medium",
			resourceName: rec.resourceName,
			warnings: rec.warnings || [],
			remediation: (rec as { remediationCommand?: string }).remediationCommand,
			data: rec.data || {},
		})),
	};
}

/**
 * POST /api/analyze
 * Analyze DigitalOcean infrastructure for cost optimization opportunities
 */
async function handleAnalyze(request: Request): Promise<Response> {
	try {
		const token = request.headers.get("X-DOP-Token");

		if (!token) {
			throw new ValidationError("X-DOP-Token header is required");
		}

		// Validate token format
		validateToken(token);

		// Check for demo token - return mock data
		if (isDemoToken(token)) {
			return NextResponse.json(
				{
					data: {
						...DEMO_DATA,
						isDemo: true,
					},
				},
				{
					...nextCacheConfig.noCache,
					headers: {
						"Cache-Control": "no-store, no-cache, must-revalidate",
					},
				}
			);
		}

		// Perform analysis
		const result = await analyzeAccount(token);

		// Return results (no cache for user-specific data)
		return NextResponse.json(
			{
				data: result,
			},
			{
				...nextCacheConfig.noCache,
				headers: {
					"Cache-Control": "no-store, no-cache, must-revalidate",
					"X-Content-Type-Options": "nosniff",
				},
			}
		);
	} catch (error) {
		// Handle DigitalOcean API errors specifically
		if (error instanceof DigitalOceanApiException) {
			logError(error, {
				component: "analyze-api",
				action: "digitalocean_api_error",
				metadata: {
					statusCode: error.statusCode,
					code: error.code,
				},
			});

			return NextResponse.json(
				{
					error: error.message || "DigitalOcean API error",
					code: error.code,
				},
				{
					status: error.statusCode || 500,
					headers: {
						"Cache-Control": "no-store",
					},
				}
			);
		}

		// Handle validation errors
		if (error instanceof ValidationError) {
			return NextResponse.json(
				{
					error: error.message,
					code: error.code,
				},
				{
					status: 400,
					headers: {
						"Cache-Control": "no-store",
					},
				}
			);
		}

		// Handle other errors
		logError(error, {
			component: "analyze-api",
			action: "analysis_error",
		});

		return handleApiError(error);
	}
}

// Export with very permissive rate limiting (backup only)
// Primary rate limiting is done client-side with localStorage
// This is just a safety net - much higher limits
export const POST = withRateLimit(handleAnalyze, {
	maxRequests: 100, // High limit since client handles most rate limiting
	windowMs: 60000, // 1 minute
});
