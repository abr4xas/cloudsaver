/**
 * TypeScript types for analysis results and recommendations
 */

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type ImpactLevel = 'High' | 'Medium' | 'Low';

export interface Recommendation {
    type: string;
    subtype: string;
    title: string;
    description: string;
    savings: number;
    confidence: ConfidenceLevel;
    impact?: ImpactLevel;
    resourceName?: string;
    warnings?: string[];
    remediation?: string;
    data?: Record<string, unknown>;
}

export interface AnalysisResult {
    monthlyCost: number;
    potentialSavings: number;
    savingsPercentage: number;
    resourcesFound: number;
    opportunities: number;
    highConfidence: number;
    recommendations: Recommendation[];
}

// Re-export typed ResourceData from analyzer types
export type { ResourceData } from '@/lib/types/analyzer';
