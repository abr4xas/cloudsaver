/**
 * API-related TypeScript types
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  code?: string;
  statusCode?: number;
}

/**
 * Analysis result from API
 */
export interface AnalysisResult {
  monthlyCost: number;
  potentialSavings: number;
  savingsPercentage: number;
  resourcesFound: number;
  opportunities?: number;
  highConfidence?: number;
  recommendations?: Recommendation[];
  error?: string;
  isDemo?: boolean;
}

/**
 * Recommendation from analysis
 */
export interface Recommendation {
  type: 'droplet' | 'volume' | 'snapshot' | 'loadbalancer' | 'database' | 'general';
  subtype: string;
  title: string;
  description: string;
  savings: number;
  confidence: 'High' | 'Medium' | 'Low';
  impact?: 'High' | 'Medium' | 'Low';
  resourceName?: string;
  resourceId?: string;
  warnings?: string[];
  remediation?: string;
  remediationCommand?: string;
  data?: Record<string, unknown>;
}

/**
 * Clean bill data (no opportunities found)
 */
export interface CleanBillData {
  resourcesFound: number;
}

/**
 * Rate limit response
 */
export interface RateLimitResponse {
  error: string;
  code: string;
  retryAfter: number;
}
