/**
 * Resource Fetcher for DigitalOcean API
 *
 * Fetches all DigitalOcean resources concurrently using parallel requests
 * for optimal performance. Uses Request Pooling to execute all 6 resource
 * type requests in parallel.
 *
 * @see https://docs.digitalocean.com/reference/api
 */

import { ApiClient, DigitalOceanApiException } from './api-client';
import { PaginationHandler } from './pagination-handler';
import type { AllResources } from '../types/digitalocean';

export interface ResourceFetcherConfig {
    resourcesConcurrency?: number;
    enablePerformanceLogging?: boolean;
}

export class ResourceFetcher {
    private readonly resourcesConcurrency: number;
    private readonly enablePerformanceLogging: boolean;

    constructor(
        private readonly apiClient: ApiClient,
        private readonly paginationHandler: PaginationHandler,
        config: ResourceFetcherConfig = {}
    ) {
        this.resourcesConcurrency = config.resourcesConcurrency || 6;
        this.enablePerformanceLogging =
            config.enablePerformanceLogging || false;
    }

    /**
     * Fetch all resources concurrently using parallel requests
     *
     * This method executes 6 requests in parallel (one for each resource type)
     * to optimize the initial resource fetching phase.
     *
     * @param token - DigitalOcean API token
     * @returns Promise resolving to all resources
     */
    async fetchAllResources(token: string): Promise<AllResources> {
        // Validate token
        if (!token || token.trim() === '') {
            if (this.enablePerformanceLogging) {
                console.warn(
                    'DigitalOcean API: Empty token provided to fetchAllResources'
                );
            }

            return {
                droplets: [],
                volumes: [],
                snapshots: [],
                databases: [],
                reserved_ips: [],
                load_balancers: [],
            };
        }

        const startTime = Date.now();
        const baseUrl = this.apiClient.getBaseUrl();
        const timeout = this.apiClient.getTimeout();

        try {
            // Execute all 6 requests in parallel
            const [dropletsRes, volumesRes, snapshotsRes, databasesRes, reservedIpsRes, loadBalancersRes] =
                await Promise.allSettled([
                    this.fetchResource(token, `${baseUrl}/droplets`, 'droplets'),
                    this.fetchResource(token, `${baseUrl}/volumes`, 'volumes'),
                    this.fetchResource(
                        token,
                        `${baseUrl}/snapshots`,
                        'snapshots'
                    ),
                    this.fetchResource(
                        token,
                        `${baseUrl}/databases`,
                        'databases'
                    ),
                    this.fetchResource(
                        token,
                        `${baseUrl}/reserved_ips`,
                        'reserved_ips'
                    ),
                    this.fetchResource(
                        token,
                        `${baseUrl}/load_balancers`,
                        'load_balancers'
                    ),
                ]);

            const poolTime = Date.now() - startTime;

            // Process each response, handling errors gracefully
            const results: AllResources = {
                droplets: this.processResponse(dropletsRes, 'droplets'),
                volumes: this.processResponse(volumesRes, 'volumes'),
                snapshots: this.processResponse(snapshotsRes, 'snapshots'),
                databases: this.processResponse(databasesRes, 'databases'),
                reserved_ips: this.processResponse(
                    reservedIpsRes,
                    'reserved_ips'
                ),
                load_balancers: this.processResponse(
                    loadBalancersRes,
                    'load_balancers'
                ),
            };

            const totalTime = Date.now() - startTime;

            if (this.enablePerformanceLogging) {
                const totalResources =
                    results.droplets.length +
                    results.volumes.length +
                    results.snapshots.length +
                    results.databases.length +
                    results.reserved_ips.length +
                    results.load_balancers.length;

                console.log('DigitalOcean API: Resources fetched', {
                    method: 'fetchAllResources',
                    pool_time_ms: poolTime,
                    total_time_ms: totalTime,
                    concurrency: this.resourcesConcurrency,
                    resources_fetched: totalResources,
                    droplets: results.droplets.length,
                    volumes: results.volumes.length,
                    snapshots: results.snapshots.length,
                    databases: results.databases.length,
                    reserved_ips: results.reserved_ips.length,
                    load_balancers: results.load_balancers.length,
                });
            }

            return results;
        } catch (error) {
            if (error instanceof DigitalOceanApiException) {
                throw error;
            }

            throw DigitalOceanApiException.serviceUnavailable(
                `Unable to fetch resources: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Fetch a single resource type with pagination
     *
     * @private
     */
    private async fetchResource(
        token: string,
        url: string,
        dataKey: string
    ): Promise<unknown[]> {
        try {
            const response = await fetch(url + '?per_page=100', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(
                    this.apiClient.getTimeout() * 1000
                ),
            });

            if (!response.ok) {
                // Check for authentication/authorization errors
                if (response.status === 401) {
                    throw DigitalOceanApiException.unauthorized(
                        'Invalid or expired token'
                    );
                }

                if (response.status === 403) {
                    throw DigitalOceanApiException.forbidden(
                        'Insufficient permissions'
                    );
                }

                if (response.status === 503) {
                    throw DigitalOceanApiException.serviceUnavailable(
                        'DigitalOcean API is temporarily unavailable'
                    );
                }

                // For other errors, return empty array (graceful degradation)
                if (this.enablePerformanceLogging) {
                    console.warn(
                        `Error fetching ${dataKey}, status: ${response.status}`
                    );
                }
                return [];
            }

            const data = (await response.json()) as Record<string, unknown>;
            return this.paginationHandler.processPaginatedResponse(
                data,
                dataKey,
                token
            );
        } catch (error) {
            // Re-throw DigitalOceanApiException
            if (error instanceof DigitalOceanApiException) {
                throw error;
            }

            // For other errors, return empty array (graceful degradation)
            if (this.enablePerformanceLogging) {
                console.warn(`Error fetching ${dataKey}`, { error });
            }
            return [];
        }
    }

    /**
     * Process a PromiseSettledResult, extracting data or returning empty array
     *
     * @private
     */
    private processResponse<T>(
        result: PromiseSettledResult<T[]>,
        resourceName: string
    ): T[] {
        if (result.status === 'fulfilled') {
            return result.value;
        }

        // Log error but don't throw (graceful degradation)
        if (this.enablePerformanceLogging) {
            console.warn(`Failed to fetch ${resourceName}`, {
                reason: result.reason,
            });
        }

        return [];
    }
}
