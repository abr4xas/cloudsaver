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

export interface ResourceData {
    droplets: Array<Record<string, unknown> | unknown>;
    volumes: Array<Record<string, unknown> | unknown>;
    snapshots: Array<Record<string, unknown> | unknown>;
    databases: Array<Record<string, unknown> | unknown>;
    reserved_ips: Array<Record<string, unknown> | unknown>;
    load_balancers: Array<Record<string, unknown> | unknown>;
}
