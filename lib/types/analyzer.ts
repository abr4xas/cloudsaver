/**
 * Types for recommendation analyzers
 */

import type { Recommendation } from "./api";

/**
 * Resource data structure for analyzers
 */
export interface ResourceData {
    droplets: DigitalOceanDroplet[];
    volumes: DigitalOceanVolume[];
    snapshots: DigitalOceanSnapshot[];
    databases?: DigitalOceanDatabase[];
    loadBalancers?: DigitalOceanLoadBalancer[];
    reservedIPs?: DigitalOceanReservedIP[];
}

/**
 * Analyzer interface
 */
export interface Analyzer {
    /**
     * Analyze resources and return recommendations
     */
    analyze(data: ResourceData): Promise<Recommendation[]>;
}

/**
 * DigitalOcean resource types (simplified)
 */
export interface DigitalOceanDroplet {
    id: number | string;
    name: string;
    status: string;
    created_at: string;
    size?: {
        slug: string;
        price_monthly: number;
    };
    region?: {
        slug: string;
    };
    [key: string]: unknown;
}

export interface DigitalOceanVolume {
    id: string;
    name: string;
    size_gigabytes: number;
    created_at: string;
    droplet_ids: number[];
    [key: string]: unknown;
}

export interface DigitalOceanSnapshot {
    id: string;
    name: string;
    created_at: string;
    min_disk_size: number;
    resource_id: string;
    resource_type: string;
    [key: string]: unknown;
}

export interface DigitalOceanDatabase {
    id: string;
    name: string;
    engine: string;
    version: string;
    size?: string;
    region?: string;
    [key: string]: unknown;
}

export interface DigitalOceanLoadBalancer {
    id: string;
    name: string;
    status: string;
    created_at: string;
    [key: string]: unknown;
}

export interface DigitalOceanReservedIP {
    ip: string;
    droplet?: {
        id: number;
    };
    [key: string]: unknown;
}
