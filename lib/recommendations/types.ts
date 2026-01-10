export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type ImpactLevel = 'High' | 'Medium' | 'Low';

/** Metrics data for droplet analysis */
export interface DropletMetrics {
	cpuAvg: number;      // Average CPU % over period
	memoryAvg: number;   // Average RAM % over period
	periodDays: number;  // Number of days metrics were collected
}

export interface Recommendation {
	type: 'droplet' | 'volume' | 'snapshot' | 'loadbalancer' | 'database' | 'general';
	subtype: string; // e.g., 'zombie_droplet', 'old_snapshot', 'droplet_downgrade'
	title: string;
	description: string;
	savings: number;
	confidence: ConfidenceLevel;
	impact?: ImpactLevel;
	resourceId?: string;
	resourceName?: string;
	currentPlan?: string;
	suggestedPlan?: string;
	warnings?: string[];
	remediationCommand?: string;
	data?: {
		avgCpu?: number;
		avgRam?: number;
		periodDays?: number;
		[key: string]: unknown;
	};
}

export interface ResourceData {
	droplets: unknown[];
	volumes: unknown[];
	snapshots: unknown[];
	databases?: unknown[];
	load_balancers?: unknown[];
	reserved_ips?: unknown[];
}

export interface Analyzer {
	analyze(data: ResourceData): Promise<Recommendation[]>;
}
