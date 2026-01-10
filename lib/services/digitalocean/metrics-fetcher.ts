/**
 * Metrics Fetcher for DigitalOcean Droplets
 *
 * Fetches monitoring metrics (CPU, memory, load average, bandwidth) for droplets.
 * Supports fetching metrics for multiple droplets concurrently using batching.
 *
 * @see https://docs.digitalocean.com/products/droplets/how-to/track-performance
 */

import { ApiClient } from './api-client';
import type { MetricDataPoint } from './metrics-calculator';

export interface MetricsFetcherConfig {
	metricsConcurrency?: number;
	maxDropletsForBatch?: number;
	enablePerformanceLogging?: boolean;
}

export interface DropletMetrics {
	cpu: MetricDataPoint[];
	memory: MetricDataPoint[];
}

export interface DropletForMetrics {
	id: string | number;
	memory?: number;
}

export class MetricsFetcher {
	private readonly metricsConcurrency: number;
	private readonly maxDropletsForBatch: number;
	private readonly enablePerformanceLogging: boolean;

	constructor(
		private readonly apiClient: ApiClient,
		config: MetricsFetcherConfig = {}
	) {
		this.metricsConcurrency = config.metricsConcurrency || 10;
		this.maxDropletsForBatch = config.maxDropletsForBatch || 20;
		this.enablePerformanceLogging =
			config.enablePerformanceLogging || false;
	}

	/**
	 * Fetch CPU metrics for a droplet
	 *
	 * @param token - DigitalOcean API token
	 * @param dropletId - Droplet ID
	 * @param start - Start timestamp (defaults to 14 days ago)
	 * @param end - End timestamp (defaults to now)
	 * @returns Promise resolving to CPU metrics array
	 */
	async fetchDropletCPUMetrics(
		token: string,
		dropletId: string,
		start?: number,
		end?: number
	): Promise<MetricDataPoint[]> {
		if (!token || token.trim() === '') {
			if (this.enablePerformanceLogging) {
				console.warn(
					'DigitalOcean API: Empty token provided to fetchDropletCPUMetrics'
				);
			}
			return [];
		}

		// Use 14 days for better analysis
		const now = Math.floor(Date.now() / 1000);
		const defaultStart = now - 14 * 24 * 60 * 60; // 14 days ago
		const startTime = start || defaultStart;
		const endTime = end || now;

		try {
			const response = await this.apiClient.get(
				token,
				'/monitoring/metrics/droplet/cpu',
				{
					host_id: dropletId,
					start: startTime,
					end: endTime,
				}
			);

			const data = response.data as { result?: MetricDataPoint[] } | undefined;
			return data?.result || [];
		} catch {
			return [];
		}
	}

	/**
	 * Fetch memory metrics for a droplet
	 *
	 * @param token - DigitalOcean API token
	 * @param dropletId - Droplet ID
	 * @param start - Start timestamp (defaults to 14 days ago)
	 * @param end - End timestamp (defaults to now)
	 * @returns Promise resolving to memory metrics array
	 */
	async fetchDropletMemoryMetrics(
		token: string,
		dropletId: string,
		start?: number,
		end?: number
	): Promise<MetricDataPoint[]> {
		if (!token || token.trim() === '') {
			if (this.enablePerformanceLogging) {
				console.warn(
					'DigitalOcean API: Empty token provided to fetchDropletMemoryMetrics'
				);
			}
			return [];
		}

		// Use 14 days for better analysis
		const now = Math.floor(Date.now() / 1000);
		const defaultStart = now - 14 * 24 * 60 * 60; // 14 days ago
		const startTime = start || defaultStart;
		const endTime = end || now;

		try {
			const response = await this.apiClient.get(
				token,
				'/monitoring/metrics/droplet/memory_free',
				{
					host_id: dropletId,
					start: startTime,
					end: endTime,
				}
			);

			const data = response.data as { result?: MetricDataPoint[] } | undefined;
			return data?.result || [];
		} catch {
			return [];
		}
	}

	/**
	 * Fetch bandwidth metrics for a droplet
	 *
	 * @param token - DigitalOcean API token
	 * @param dropletId - Droplet ID
	 * @param start - Start timestamp
	 * @param end - End timestamp
	 * @param interface - Network interface (default: 'public')
	 * @param direction - Traffic direction (default: 'outbound')
	 * @returns Promise resolving to bandwidth metrics array
	 */
	async fetchDropletBandwidthMetrics(
		token: string,
		dropletId: string,
		start?: number,
		end?: number,
		interfaceType = 'public',
		direction = 'outbound'
	): Promise<MetricDataPoint[]> {
		if (!token || token.trim() === '') {
			if (this.enablePerformanceLogging) {
				console.warn(
					'DigitalOcean API: Empty token provided to fetchDropletBandwidthMetrics'
				);
			}
			return [];
		}

		const now = Math.floor(Date.now() / 1000);
		const defaultStart = now - 14 * 24 * 60 * 60;
		const startTime = start || defaultStart;
		const endTime = end || now;

		try {
			const response = await this.apiClient.get(
				token,
				'/monitoring/metrics/droplet/bandwidth',
				{
					host_id: dropletId,
					start: startTime,
					end: endTime,
					interface: interfaceType,
					direction: direction,
				}
			);

			const data = response.data as { result?: MetricDataPoint[] } | undefined;
			return data?.result || [];
		} catch {
			return [];
		}
	}

	/**
	 * Fetch load average metrics for a droplet
	 *
	 * @param token - DigitalOcean API token
	 * @param dropletId - Droplet ID
	 * @param period - Load average period: '1', '5', or '15' minutes
	 * @param start - Start timestamp
	 * @param end - End timestamp
	 * @returns Promise resolving to load average metrics array
	 */
	async fetchDropletLoadMetrics(
		token: string,
		dropletId: string,
		period: '1' | '5' | '15' = '1',
		start?: number,
		end?: number
	): Promise<MetricDataPoint[]> {
		if (!token || token.trim() === '') {
			if (this.enablePerformanceLogging) {
				console.warn(
					'DigitalOcean API: Empty token provided to fetchDropletLoadMetrics'
				);
			}
			return [];
		}

		if (!['1', '5', '15'].includes(period)) {
			if (this.enablePerformanceLogging) {
				console.warn('DigitalOcean API: Invalid load period', { period });
			}
			return [];
		}

		const now = Math.floor(Date.now() / 1000);
		const defaultStart = now - 14 * 24 * 60 * 60;
		const startTime = start || defaultStart;
		const endTime = end || now;

		try {
			const response = await this.apiClient.get(
				token,
				`/monitoring/metrics/droplet/load_${period}`,
				{
					host_id: dropletId,
					start: startTime,
					end: endTime,
				}
			);

			const data = response.data as { result?: MetricDataPoint[] } | undefined;
			return data?.result || [];
		} catch {
			return [];
		}
	}

	/**
	 * Fetch metrics for multiple droplets concurrently using batching
	 *
	 * This method fetches CPU and memory metrics for multiple droplets in parallel,
	 * respecting concurrency limits to avoid rate limiting.
	 *
	 * @param token - DigitalOcean API token
	 * @param droplets - Array of droplets with id and optional memory
	 * @param start - Start timestamp (defaults to 14 days ago)
	 * @param end - End timestamp (defaults to now)
	 * @returns Promise resolving to metrics object indexed by droplet ID
	 */
	async fetchDropletsMetricsBatch(
		token: string,
		droplets: DropletForMetrics[],
		start?: number,
		end?: number
	): Promise<Record<string, DropletMetrics>> {
		if (!token || token.trim() === '') {
			if (this.enablePerformanceLogging) {
				console.warn(
					'DigitalOcean API: Empty token provided to fetchDropletsMetricsBatch'
				);
			}
			return {};
		}

		if (!droplets || droplets.length === 0) {
			return {};
		}

		// Limit droplets to prevent memory/rate limit issues
		const dropletsToProcess =
			droplets.length > this.maxDropletsForBatch
				? droplets.slice(0, this.maxDropletsForBatch)
				: droplets;

		const now = Math.floor(Date.now() / 1000);
		const defaultStart = now - 14 * 24 * 60 * 60;
		const startTime = start || defaultStart;
		const endTime = end || now;

		const startTimeMs = Date.now();
		const results: Record<string, DropletMetrics> = {};

		// Create batches of requests respecting concurrency limit
		const batches: DropletForMetrics[][] = [];
		for (let i = 0; i < dropletsToProcess.length; i += this.metricsConcurrency) {
			batches.push(
				dropletsToProcess.slice(i, i + this.metricsConcurrency)
			);
		}

		// Process batches sequentially, but requests within batch in parallel
		for (const batch of batches) {
			const batchPromises = batch.map(async (droplet) => {
				const dropletId = String(droplet.id);
				if (!dropletId || dropletId === '0') {
					return null;
				}

				try {
					const [cpuMetrics, memoryMetrics] = await Promise.all([
						this.fetchDropletCPUMetrics(
							token,
							dropletId,
							startTime,
							endTime
						),
						this.fetchDropletMemoryMetrics(
							token,
							dropletId,
							startTime,
							endTime
						),
					]);

					return {
						dropletId,
						metrics: {
							cpu: cpuMetrics,
							memory: memoryMetrics,
						},
					};
				} catch (error) {
					if (this.enablePerformanceLogging) {
						console.warn(
							`Error fetching metrics for droplet ${dropletId}`,
							{ error }
						);
					}
					return null;
				}
			});

			const batchResults = await Promise.all(batchPromises);

			for (const result of batchResults) {
				if (result) {
					results[result.dropletId] = result.metrics;
				}
			}
		}

		const totalTime = Date.now() - startTimeMs;

		if (this.enablePerformanceLogging) {
			const totalRequests = dropletsToProcess.length * 2; // CPU + Memory
			console.log('DigitalOcean API: Metrics batch completed', {
				method: 'fetchDropletsMetricsBatch',
				total_time_ms: totalTime,
				concurrency: this.metricsConcurrency,
				droplets: dropletsToProcess.length,
				total_requests: totalRequests,
				successful: Object.keys(results).length * 2,
			});
		}

		return results;
	}
}
