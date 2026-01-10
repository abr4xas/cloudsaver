/**
 * Pricing Service
 *
 * Calculates monthly costs for all DigitalOcean resource types.
 * Uses prices from a local JSON file to avoid API calls.
 *
 * @see https://docs.digitalocean.com/reference/api
 */

import type {
    DigitalOceanDroplet,
    DigitalOceanVolume,
    DigitalOceanSnapshot,
    DigitalOceanDatabase,
    DigitalOceanLoadBalancer,
    DigitalOceanReservedIP,
    DigitalOceanSize,
} from '../types/digitalocean';
import pricingData from '../../digitalocean-prices.json';

interface PricingData {
    sizes: Array<{
        slug: string;
        memory: number;
        vcpus: number;
        disk: number;
        transfer: number;
        price_monthly: number;
        price_hourly: number;
        available: boolean;
    }>;
    volumes: {
        per_gb_monthly: number;
    };
    snapshots: {
        per_gb_monthly: number;
    };
    backups: {
        percentage_of_droplet_cost: number;
    };
    reserved_ips: {
        per_month: number;
    };
    load_balancers: {
        http: number;
        network: number;
    };
    databases: Record<string, number>;
}

const PRICING_DATA = pricingData as PricingData;

export interface PricingServiceConfig {
    sizes?: DigitalOceanSize[]; // Optional: pre-fetched sizes from API (deprecated, using JSON now)
}

export class PricingService {
    private sizesCache: DigitalOceanSize[] | null = null;

    constructor(config: PricingServiceConfig = {}) {
        // Initialize with JSON data
        this.sizesCache = this.loadSizesFromJSON();
    }

    /**
     * Load sizes from JSON file
     */
    private loadSizesFromJSON(): DigitalOceanSize[] {
        return PRICING_DATA.sizes.map((size) => ({
            slug: size.slug,
            memory: size.memory,
            vcpus: size.vcpus,
            disk: size.disk,
            transfer: size.transfer,
            price_monthly: size.price_monthly,
            price_hourly: size.price_hourly,
            available: size.available,
            regions: [], // Not needed for pricing
        }));
    }

    /**
     * Set sizes cache (deprecated - using JSON now, but kept for compatibility)
     */
    setSizes(sizes: DigitalOceanSize[]): void {
        // Ignore - we use JSON data instead
    }

    /**
     * Get price for a droplet size
     *
     * @param slug - Droplet size slug (e.g., 's-1vcpu-1gb')
     * @returns Monthly price in USD, or 0 if not found
     */
    getDropletPrice(slug: string): number {
        if (!slug) {
            return 0;
        }

        // Try to find in cache first
        if (this.sizesCache) {
            const size = this.sizesCache.find((s) => s.slug === slug);
            if (size && size.price_monthly) {
                return this.roundCurrency(size.price_monthly);
            }
        }

        // Fallback: return 0 if not found (caller should handle)
        return 0;
    }

    /**
     * Get price for database size
     *
     * @param slug - Database size slug
     * @returns Monthly price in USD, or 0 if not found
     */
    getDatabasePrice(slug: string): number {
        if (!slug) {
            return 0;
        }
        return PRICING_DATA.databases[slug] || 0;
    }

    /**
     * Get price per GB for volumes
     */
    getVolumePrice(): number {
        return PRICING_DATA.volumes.per_gb_monthly;
    }

    /**
     * Get price per GB for snapshots
     */
    getSnapshotPrice(): number {
        return PRICING_DATA.snapshots.per_gb_monthly;
    }

    /**
     * Get backup percentage cost
     */
    getBackupPercentage(): number {
        return PRICING_DATA.backups.percentage_of_droplet_cost;
    }

    /**
     * Get reserved IP hourly price
     */
    getReservedIPHourlyPrice(): number {
        // Calculate from monthly price
        const monthlyPrice = PRICING_DATA.reserved_ips.per_month;
        const hoursPerMonth = 24 * 30.44; // Average days per month
        return this.roundCurrency(monthlyPrice / hoursPerMonth);
    }

    /**
     * Get reserved IP monthly price
     */
    getReservedIPMonthlyPrice(): number {
        return PRICING_DATA.reserved_ips.per_month;
    }

    /**
     * Get load balancer monthly price
     *
     * @param type - Load balancer type: 'http' or 'network'
     */
    getLoadBalancerPrice(type: 'http' | 'network' = 'http'): number {
        return type === 'network'
            ? PRICING_DATA.load_balancers.network
            : PRICING_DATA.load_balancers.http;
    }

    /**
     * Calculate comprehensive monthly cost for a droplet
     *
     * Includes base price, backups (if enabled), and attached volumes.
     *
     * @param droplet - Droplet data
     * @param volumes - Optional array of all volumes to check for attached volumes
     * @returns Total monthly cost in USD
     */
    calculateDropletMonthlyCost(
        droplet: DigitalOceanDroplet | Record<string, unknown>,
        volumes: DigitalOceanVolume[] | Array<Record<string, unknown>> = []
    ): number {
        const sizeSlug =
            (droplet as DigitalOceanDroplet).size_slug ||
            ((droplet as DigitalOceanDroplet).size?.slug as string) ||
            '';
        const basePrice = this.getDropletPrice(sizeSlug);

        if (basePrice === 0) {
            // If we can't get the price, return 0
            return 0;
        }

        let totalCost = basePrice;

        // Check for backups (usually 20% of base price)
        const features = (droplet as DigitalOceanDroplet).features || [];
        if (Array.isArray(features) && features.includes('backups')) {
            totalCost += this.calculateBackupCost(basePrice);
        }

        // Add cost of attached volumes if volumes array is provided
        if (volumes.length > 0) {
            const dropletId = this.normalizeDropletId(
                (droplet as DigitalOceanDroplet).id
            );
            totalCost += this.calculateAttachedVolumesCost(volumes, dropletId);
        }

        return this.roundCurrency(totalCost);
    }

    /**
     * Calculate cost of volumes attached to a specific droplet
     *
     * @param volumes - Array of all volumes
     * @param dropletId - Droplet ID to check for attached volumes
     * @returns Total cost of attached volumes
     */
    calculateAttachedVolumesCost(
        volumes: DigitalOceanVolume[] | Array<Record<string, unknown>>,
        dropletId: string
    ): number {
        if (volumes.length === 0 || !dropletId) {
            return 0;
        }

        let totalCost = 0;

        for (const volume of volumes) {
            const volumeDropletIds =
                (volume as DigitalOceanVolume).droplet_ids || [];
            const normalizedVolumeIds = Array.isArray(volumeDropletIds)
                ? volumeDropletIds.map((id) => String(id))
                : [];

            if (normalizedVolumeIds.includes(dropletId)) {
                const sizeGB =
                    (volume as DigitalOceanVolume).size_gigabytes || 0;
                if (this.isValidNumeric(sizeGB)) {
                    totalCost += this.calculateVolumeCost(Number(sizeGB));
                }
            }
        }

        return this.roundCurrency(totalCost);
    }

    /**
     * Calculate backup cost based on base droplet price
     */
    calculateBackupCost(basePrice: number): number {
        const percentage = this.getBackupPercentage();
        return this.roundCurrency(basePrice * (percentage / 100));
    }

    /**
     * Calculate volume cost
     */
    calculateVolumeCost(sizeGB: number): number {
        if (sizeGB <= 0) {
            return 0;
        }

        return this.roundCurrency(sizeGB * this.getVolumePrice());
    }

    /**
     * Calculate snapshot cost from size in GB
     */
    calculateSnapshotCost(sizeGB: number): number {
        if (sizeGB <= 0) {
            return 0;
        }

        return this.roundCurrency(sizeGB * this.getSnapshotPrice());
    }

    /**
     * Calculate snapshot cost from snapshot data array
     *
     * IMPORTANT: DigitalOcean bills snapshots based on min_disk_size, not the actual snapshot size.
     * This is because when you restore a snapshot, you need a disk of at least min_disk_size.
     *
     * Priority:
     * 1. min_disk_size_gb or min_disk_size (what DigitalOcean uses for billing)
     * 2. size_gigabytes (fallback - may be inaccurate)
     * 3. size_bytes (converted to GB, fallback - may be inaccurate)
     *
     * @param snapshot - Snapshot data from API
     * @param droplets - Optional array of droplets to lookup min_disk_size from original resource
     * @param volumes - Optional array of volumes to lookup min_disk_size from original resource
     * @returns Monthly cost in USD
     */
    calculateSnapshotCostFromData(
        snapshot: DigitalOceanSnapshot | Record<string, unknown>,
        droplets: DigitalOceanDroplet[] | Array<Record<string, unknown>> = [],
        volumes: DigitalOceanVolume[] | Array<Record<string, unknown>> = []
    ): number {
        const snapshotData = snapshot as DigitalOceanSnapshot;

        // Priority 1: Use min_disk_size_gb or min_disk_size (DigitalOcean billing standard)
        const minDiskSize =
            snapshotData.min_disk_size_gb || snapshotData.min_disk_size;

        if (minDiskSize !== null && this.isValidNumeric(minDiskSize)) {
            return this.calculateSnapshotCost(Number(minDiskSize));
        }

        // Try to get min_disk_size from original resource if available
        const resourceType = snapshotData.resource_type;
        const resourceId = snapshotData.resource_id;

        if (resourceType === 'droplet' && resourceId && droplets.length > 0) {
            const resourceIdStr = String(resourceId);
            const droplet = droplets.find((d) => {
                const dropletId = this.normalizeDropletId(
                    (d as DigitalOceanDroplet).id
                );
                return dropletId === resourceIdStr;
            });

            if (droplet) {
                const disk = (droplet as DigitalOceanDroplet).disk;
                if (disk) {
                    const diskSize = Array.isArray(disk) ? disk[0] : disk;
                    if (this.isValidNumeric(diskSize)) {
                        return this.calculateSnapshotCost(Number(diskSize));
                    }
                }
            }
        }

        if (resourceType === 'volume' && resourceId && volumes.length > 0) {
            const resourceIdStr = String(resourceId);
            const volume = volumes.find((v) => {
                const volumeId = String((v as DigitalOceanVolume).id);
                return volumeId === resourceIdStr;
            });

            if (volume) {
                const sizeGB = (volume as DigitalOceanVolume).size_gigabytes;
                if (this.isValidNumeric(sizeGB)) {
                    return this.calculateSnapshotCost(Number(sizeGB));
                }
            }
        }

        // Priority 2: Fallback to size_gigabytes (may be inaccurate)
        if (this.isValidNumeric(snapshotData.size_gigabytes)) {
            return this.calculateSnapshotCost(
                Number(snapshotData.size_gigabytes)
            );
        }

        // Priority 3: Fallback to size_bytes (converted to GB, may be inaccurate)
        if (this.isValidNumeric(snapshotData.size_bytes)) {
            const sizeBytes = Number(snapshotData.size_bytes);
            const sizeGB = sizeBytes / (1024 * 1024 * 1024); // Convert bytes to GB
            return this.calculateSnapshotCost(Math.ceil(sizeGB));
        }

        // No valid size data available
        return 0;
    }

    /**
     * Round currency to 2 decimal places
     *
     * @private
     */
    private roundCurrency(value: number): number {
        return Math.round(value * 100) / 100;
    }

    /**
     * Normalize droplet ID to string
     *
     * @private
     */
    private normalizeDropletId(id: unknown): string {
        if (id === null || id === undefined) {
            return '';
        }
        return String(id);
    }

    /**
     * Check if a value is a valid numeric value
     *
     * @private
     */
    private isValidNumeric(value: unknown): boolean {
        return (
            typeof value === 'number' &&
            !isNaN(value) &&
            isFinite(value) &&
            value > 0
        );
    }
}
