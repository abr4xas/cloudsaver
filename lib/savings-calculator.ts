/**
 * Savings Calculator Library
 *
 * Provides pricing tables and calculation utilities for
 * estimating cost savings from recommendations.
 */

import type { Recommendation } from './recommendations/types';

// =============================================================================
// PRICING TABLES
// =============================================================================

/** Basic Droplet pricing ($/month) */
export const DROPLET_PRICING: Record<string, number> = {
	's-1vcpu-512mb-10gb': 4,
	's-1vcpu-1gb': 6,
	's-1vcpu-2gb': 12,
	's-2vcpu-2gb': 18,
	's-2vcpu-4gb': 24,
	's-4vcpu-8gb': 48,
	's-8vcpu-16gb': 96,
};

/** Managed Database pricing ($/month) */
export const DATABASE_PRICING: Record<string, number> = {
	'db-s-1vcpu-1gb': 15,
	'db-s-1vcpu-2gb': 30,
	'db-s-2vcpu-4gb': 60,
	'db-s-4vcpu-8gb': 120,
};

/** Volume pricing per GB per month */
export const VOLUME_PRICING_PER_GB = 0.10;

/** Snapshot pricing per GB per month */
export const SNAPSHOT_PRICING_PER_GB = 0.05;

/** Backup pricing as percentage of droplet cost */
export const BACKUP_PERCENTAGE = 0.20;

// =============================================================================
// TYPES
// =============================================================================

export interface TotalSavings {
	totalMonthly: number;
	totalYearly: number;
	count: number;
}

export interface BreakdownByType {
	[type: string]: {
		count: number;
		monthlySavings: number;
	};
}

// =============================================================================
// SAVINGS CALCULATOR CLASS
// =============================================================================

export class SavingsCalculator {
	/**
	 * Get price for any resource size.
	 * Returns 0 for unknown sizes.
	 */
	getPrice(resourceType: string, size: string): number {
		let price: number | undefined;

		switch (resourceType) {
			case 'droplet':
				price = DROPLET_PRICING[size];
				break;
			case 'database':
				price = DATABASE_PRICING[size];
				break;
			default:
				price = undefined;
		}

		return price !== undefined ? Math.round(price * 100) / 100 : 0;
	}

	/**
	 * Calculate monthly savings between two plans.
	 * Returns 0 if either plan is unknown.
	 */
	calculateMonthlySavings(currentPlan: string, suggestedPlan: string): number {
		// Try droplet pricing first
		let currentPrice = DROPLET_PRICING[currentPlan];
		let suggestedPrice = DROPLET_PRICING[suggestedPlan];

		// If not found in droplet, try database
		if (currentPrice === undefined) {
			currentPrice = DATABASE_PRICING[currentPlan];
			suggestedPrice = DATABASE_PRICING[suggestedPlan];
		}

		// If still not found, return 0
		if (currentPrice === undefined || suggestedPrice === undefined) {
			return 0;
		}

		const savings = currentPrice - suggestedPrice;
		return Math.round(savings * 100) / 100;
	}

	/**
	 * Calculate yearly savings projection.
	 */
	calculateYearlySavings(monthlySavings: number): number {
		return Math.round(monthlySavings * 12 * 100) / 100;
	}

	/**
	 * Calculate total savings across all recommendations.
	 */
	calculateTotalSavings(recommendations: Recommendation[]): TotalSavings {
		const totalMonthly = recommendations.reduce(
			(sum, rec) => sum + (rec.savings || 0),
			0
		);

		return {
			totalMonthly: Math.round(totalMonthly * 100) / 100,
			totalYearly: Math.round(totalMonthly * 12 * 100) / 100,
			count: recommendations.length,
		};
	}

	/**
	 * Group savings by recommendation type.
	 */
	getBreakdownByType(recommendations: Recommendation[]): BreakdownByType {
		const breakdown: BreakdownByType = {};

		for (const rec of recommendations) {
			const key = rec.subtype || rec.type;

			if (!breakdown[key]) {
				breakdown[key] = {
					count: 0,
					monthlySavings: 0,
				};
			}

			breakdown[key].count += 1;
			breakdown[key].monthlySavings = Math.round(
				(breakdown[key].monthlySavings + (rec.savings || 0)) * 100
			) / 100;
		}

		return breakdown;
	}
}

// Export singleton instance for convenience
export const savingsCalculator = new SavingsCalculator();
