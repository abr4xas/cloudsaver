/**
 * DigitalOcean Service
 *
 * Main service for interacting with DigitalOcean API.
 * Orchestrates all DigitalOcean-related operations including resource fetching,
 * metrics retrieval, and calculations.
 *
 * @see https://docs.digitalocean.com/reference/api
 */

import { ApiClient } from './api-client';
import { PaginationHandler } from './pagination-handler';
import { ResourceFetcher } from './resource-fetcher';
import { MetricsFetcher, type DropletForMetrics } from './metrics-fetcher';
import { MetricsCalculator, type MetricDataPoint } from './metrics-calculator';
import type {
    AllResources,
    DigitalOceanDroplet,
    DigitalOceanSize,
} from '../types/digitalocean';

export interface DigitalOceanServiceConfig {
    baseUrl?: string;
    timeout?: number;
    version?: string;
    resourcesConcurrency?: number;
    metricsConcurrency?: number;
    maxDropletsForBatch?: number;
    maxPaginationPages?: number;
    enablePerformanceLogging?: boolean;
}

export class DigitalOceanService {
    private readonly apiClient: ApiClient;
    private readonly paginationHandler: PaginationHandler;
    private readonly resourceFetcher: ResourceFetcher;
    private readonly metricsFetcher: MetricsFetcher;
    private readonly metricsCalculator: MetricsCalculator;

    constructor(config: DigitalOceanServiceConfig = {}) {
        this.apiClient = new ApiClient({
            baseUrl: config.baseUrl,
            timeout: config.timeout,
            version: config.version,
        });

        this.paginationHandler = new PaginationHandler(this.apiClient, {
            maxPages: config.maxPaginationPages,
            enablePerformanceLogging: config.enablePerformanceLogging,
        });

        this.resourceFetcher = new ResourceFetcher(
            this.apiClient,
            this.paginationHandler,
            {
                resourcesConcurrency: config.resourcesConcurrency,
                enablePerformanceLogging: config.enablePerformanceLogging,
            }
        );

        this.metricsFetcher = new MetricsFetcher(this.apiClient, {
            metricsConcurrency: config.metricsConcurrency,
            maxDropletsForBatch: config.maxDropletsForBatch,
            enablePerformanceLogging: config.enablePerformanceLogging,
        });

        this.metricsCalculator = new MetricsCalculator();
    }

    /**
     * Fetch all droplets from DigitalOcean API
     */
    async fetchDroplets(token: string): Promise<DigitalOceanDroplet[]> {
        return this.paginationHandler.fetchPaginated<DigitalOceanDroplet>(
            token,
            '/droplets',
            'droplets'
        );
    }

    /**
     * Fetch all volumes from DigitalOcean API
     */
    async fetchVolumes(token: string) {
        return this.paginationHandler.fetchPaginated(
            token,
            '/volumes',
            'volumes'
        );
    }

    /**
     * Fetch all snapshots from DigitalOcean API
     */
    async fetchSnapshots(token: string) {
        return this.paginationHandler.fetchPaginated(
            token,
            '/snapshots',
            'snapshots'
        );
    }

    /**
     * Fetch all databases from DigitalOcean API
     */
    async fetchDatabases(token: string) {
        return this.paginationHandler.fetchPaginated(
            token,
            '/databases',
            'databases'
        );
    }

    /**
     * Fetch all reserved IPs from DigitalOcean API
     */
    async fetchReservedIPs(token: string) {
        return this.paginationHandler.fetchPaginated(
            token,
            '/reserved_ips',
            'reserved_ips'
        );
    }

    /**
     * Fetch all load balancers from DigitalOcean API
     */
    async fetchLoadBalancers(token: string) {
        return this.paginationHandler.fetchPaginated(
            token,
            '/load_balancers',
            'load_balancers'
        );
    }

    /**
     * Fetch all available sizes (droplets, databases, etc.) with pricing
     */
    async fetchSizes(token: string): Promise<DigitalOceanSize[]> {
        return this.paginationHandler.fetchPaginated<DigitalOceanSize>(
            token,
            '/sizes',
            'sizes'
        );
    }

    /**
     * Fetch all resources concurrently using Request Pooling
     *
     * This optimizes the initial resource fetching by executing all 6 requests in parallel.
     *
     * @returns Object containing all resource types
     */
    async fetchAllResources(token: string): Promise<AllResources> {
        return this.resourceFetcher.fetchAllResources(token);
    }

    /**
     * Fetch CPU metrics for a droplet
     */
    async fetchDropletCPUMetrics(
        token: string,
        dropletId: string,
        start?: number,
        end?: number
    ): Promise<MetricDataPoint[]> {
        return this.metricsFetcher.fetchDropletCPUMetrics(
            token,
            dropletId,
            start,
            end
        );
    }

    /**
     * Fetch memory metrics for a droplet
     */
    async fetchDropletMemoryMetrics(
        token: string,
        dropletId: string,
        start?: number,
        end?: number
    ): Promise<MetricDataPoint[]> {
        return this.metricsFetcher.fetchDropletMemoryMetrics(
            token,
            dropletId,
            start,
            end
        );
    }

    /**
     * Fetch bandwidth metrics for a droplet
     */
    async fetchDropletBandwidthMetrics(
        token: string,
        dropletId: string,
        start?: number,
        end?: number,
        interfaceType = 'public',
        direction = 'outbound'
    ): Promise<MetricDataPoint[]> {
        return this.metricsFetcher.fetchDropletBandwidthMetrics(
            token,
            dropletId,
            start,
            end,
            interfaceType,
            direction
        );
    }

    /**
     * Fetch load average metrics for a droplet
     */
    async fetchDropletLoadMetrics(
        token: string,
        dropletId: string,
        period: '1' | '5' | '15' = '1',
        start?: number,
        end?: number
    ): Promise<MetricDataPoint[]> {
        return this.metricsFetcher.fetchDropletLoadMetrics(
            token,
            dropletId,
            period,
            start,
            end
        );
    }

    /**
     * Fetch metrics for multiple droplets concurrently using Request Batching
     *
     * @param token - DigitalOcean API token
     * @param droplets - Array of droplets with id and memory
     * @param start - Start timestamp (defaults to 14 days ago)
     * @param end - End timestamp (defaults to now)
     * @returns Object indexed by droplet ID containing CPU and memory metrics
     */
    async fetchDropletsMetricsBatch(
        token: string,
        droplets: DropletForMetrics[],
        start?: number,
        end?: number
    ) {
        return this.metricsFetcher.fetchDropletsMetricsBatch(
            token,
            droplets,
            start,
            end
        );
    }

    /**
     * Calculate average CPU usage from metrics
     */
    calculateAverageCPU(metrics: MetricDataPoint[]): number {
        return this.metricsCalculator.calculateAverageCPU(metrics);
    }

    /**
     * Calculate average memory usage percentage from free memory metrics
     */
    calculateAverageMemoryUsage(
        freeMemoryMetrics: MetricDataPoint[],
        totalMemoryMB: number
    ): number {
        return this.metricsCalculator.calculateAverageMemoryUsage(
            freeMemoryMetrics,
            totalMemoryMB
        );
    }

    /**
     * Calculate percentile CPU usage from metrics
     */
    calculatePercentileCPU(
        metrics: MetricDataPoint[],
        percentile = 95
    ): number {
        return this.metricsCalculator.calculatePercentileCPU(
            metrics,
            percentile
        );
    }

    /**
     * Calculate percentile memory usage from metrics
     */
    calculatePercentileMemory(
        freeMemoryMetrics: MetricDataPoint[],
        totalMemoryMB: number,
        percentile = 95
    ): number {
        return this.metricsCalculator.calculatePercentileMemory(
            freeMemoryMetrics,
            totalMemoryMB,
            percentile
        );
    }

    /**
     * Calculate average load average from metrics
     */
    calculateAverageLoadAverage(metrics: MetricDataPoint[]): number {
        return this.metricsCalculator.calculateAverageLoadAverage(metrics);
    }

    /**
     * Fetch comprehensive droplet metrics (backward compatibility)
     *
     * @param token - DigitalOcean API token
     * @param dropletId - Droplet ID
     * @param days - Number of days to fetch metrics for (default: 7)
     * @returns Object containing CPU, memory, and bandwidth metrics
     */
    async fetchDropletMetrics(
        token: string,
        dropletId: string,
        days = 7
    ): Promise<{
        cpu: MetricDataPoint[];
        memory: MetricDataPoint[];
        bandwidth: MetricDataPoint[];
    }> {
        const now = Math.floor(Date.now() / 1000);
        const start = now - days * 24 * 60 * 60;

        const [cpu, memory, bandwidth] = await Promise.all([
            this.fetchDropletCPUMetrics(token, dropletId, start, now),
            this.fetchDropletMemoryMetrics(token, dropletId, start, now),
            this.fetchDropletBandwidthMetrics(token, dropletId, start, now),
        ]);

        return { cpu, memory, bandwidth };
    }

    /**
     * Fetch database options (sizes, versions, regions)
     */
    async fetchDatabaseOptions(token: string) {
        try {
            const response = await this.apiClient.get(
                token,
                '/databases/options'
            );
            return (response.options as unknown[]) || [];
        } catch {
            return [];
        }
    }
}
