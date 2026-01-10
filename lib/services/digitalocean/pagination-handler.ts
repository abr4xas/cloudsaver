/**
 * Pagination Handler for DigitalOcean API
 *
 * Handles paginated responses from DigitalOcean API by following
 * pagination links and fetching all pages of results.
 *
 * @see https://docs.digitalocean.com/reference/api/#pagination
 */

import { ApiClient, DigitalOceanApiException } from './api-client';
import type { DigitalOceanApiResponse } from '../types/digitalocean';

export interface PaginationConfig {
    maxPages?: number;
    enablePerformanceLogging?: boolean;
}

export class PaginationHandler {
    private readonly maxPages: number;
    private readonly enablePerformanceLogging: boolean;

    constructor(
        private readonly apiClient: ApiClient,
        config: PaginationConfig = {}
    ) {
        this.maxPages = config.maxPages || 100;
        this.enablePerformanceLogging = config.enablePerformanceLogging || false;
    }

    /**
     * Fetch all pages of a paginated endpoint
     *
     * @param token - DigitalOcean API token
     * @param endpoint - API endpoint (e.g., '/droplets')
     * @param dataKey - Key in response containing the data array (e.g., 'droplets')
     * @returns Promise resolving to array of all items across all pages
     */
    async fetchPaginated<T = unknown>(
        token: string,
        endpoint: string,
        dataKey: string
    ): Promise<T[]> {
        const allItems: T[] = [];
        let currentPage = 1;
        let nextUrl: string | null = null;

        do {
            try {
                const params: Record<string, string | number> = {
                    per_page: 100, // Maximum items per page
                };

                // Use next URL if available, otherwise use endpoint with page number
                const response = nextUrl
                    ? await this.fetchFromUrl(token, nextUrl)
                    : await this.apiClient.get(token, endpoint, {
                          ...params,
                          page: currentPage,
                      });

                const items = (response[dataKey] as T[]) || [];
                allItems.push(...items);

                // Check for next page
                const links = response.links as
                    | {
                          pages?: {
                              next?: string;
                          };
                      }
                    | undefined;

                nextUrl = links?.pages?.next || null;

                // Validate next URL to prevent SSRF
                if (nextUrl && !this.isValidDigitalOceanUrl(nextUrl)) {
                    if (this.enablePerformanceLogging) {
                        console.warn(
                            'Invalid pagination URL detected, stopping pagination',
                            { nextUrl }
                        );
                    }
                    nextUrl = null;
                }

                currentPage++;

                // Safety limit to prevent infinite loops
                if (currentPage > this.maxPages) {
                    if (this.enablePerformanceLogging) {
                        console.warn(
                            `Reached maximum pagination pages (${this.maxPages}), stopping`
                        );
                    }
                    break;
                }
            } catch (error) {
                // If it's the first page and it fails, throw the error
                if (currentPage === 1) {
                    throw error;
                }

                // For subsequent pages, log and break (partial results are acceptable)
                if (this.enablePerformanceLogging) {
                    console.warn(
                        `Error fetching page ${currentPage}, returning partial results`,
                        { error }
                    );
                }
                break;
            }
        } while (nextUrl);

        return allItems;
    }

    /**
     * Process a paginated response and fetch remaining pages if needed
     *
     * @param response - Initial API response
     * @param dataKey - Key in response containing the data array
     * @param token - DigitalOcean API token
     * @returns Promise resolving to array of all items
     */
    async processPaginatedResponse<T = unknown>(
        response: unknown,
        dataKey: string,
        token: string
    ): Promise<T[]> {
        if (!response || typeof response !== 'object') {
            return [];
        }

        const apiResponse = response as DigitalOceanApiResponse<T[]>;
        const items = (apiResponse[dataKey] as T[]) || [];

        // Check if there are more pages
        const links = apiResponse.links as
            | {
                  pages?: {
                      next?: string;
                  };
              }
            | undefined;

        const nextUrl = links?.pages?.next;

        if (!nextUrl) {
            return items;
        }

        // Validate URL
        if (!this.isValidDigitalOceanUrl(nextUrl)) {
            if (this.enablePerformanceLogging) {
                console.warn('Invalid pagination URL, returning first page only');
            }
            return items;
        }

        // Fetch remaining pages
        const remainingItems = await this.fetchPaginatedFromUrl<T>(
            token,
            nextUrl,
            dataKey
        );

        return [...items, ...remainingItems];
    }

    /**
     * Fetch from a full URL (for pagination)
     *
     * @private
     */
    private async fetchFromUrl(
        token: string,
        url: string
    ): Promise<Record<string, unknown>> {
        try {
            const response = await fetch(url, {
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
                await this.handleApiError(response);
            }

            return (await response.json()) as Record<string, unknown>;
        } catch (error) {
            if (error instanceof DigitalOceanApiException) {
                throw error;
            }

            throw DigitalOceanApiException.serviceUnavailable(
                `Unable to fetch from URL: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Fetch paginated data starting from a URL
     *
     * @private
     */
    private async fetchPaginatedFromUrl<T>(
        token: string,
        startUrl: string,
        dataKey: string
    ): Promise<T[]> {
        const allItems: T[] = [];
        let nextUrl: string | null = startUrl;
        let pageCount = 1;

        do {
            try {
                const response = await this.fetchFromUrl(token, nextUrl);
                const items = (response[dataKey] as T[]) || [];
                allItems.push(...items);

                const links = response.links as
                    | {
                          pages?: {
                              next?: string;
                          };
                      }
                    | undefined;

                nextUrl = links?.pages?.next || null;

                if (nextUrl && !this.isValidDigitalOceanUrl(nextUrl)) {
                    nextUrl = null;
                }

                pageCount++;

                if (pageCount > this.maxPages) {
                    break;
                }
            } catch (error) {
                // Log and break on error (partial results are acceptable)
                if (this.enablePerformanceLogging) {
                    console.warn(
                        `Error fetching paginated data, returning partial results`,
                        { error }
                    );
                }
                break;
            }
        } while (nextUrl);

        return allItems;
    }

    /**
     * Validate that URL is a DigitalOcean API URL (prevent SSRF)
     *
     * @private
     */
    private isValidDigitalOceanUrl(url: string): boolean {
        try {
            const urlObj = new URL(url);
            return (
                urlObj.hostname === 'api.digitalocean.com' &&
                urlObj.protocol === 'https:'
            );
        } catch {
            return false;
        }
    }

    /**
     * Handle API error response
     *
     * @private
     */
    private async handleApiError(response: Response): Promise<never> {
        const statusCode = response.status;
        let errorMessage = 'Unknown error';

        try {
            const errorData = (await response.json()) as {
                message?: string;
                id?: string;
            };
            errorMessage =
                errorData.message || errorData.id || 'Unknown error';
        } catch {
            errorMessage = response.statusText || 'Unknown error';
        }

        if (statusCode === 401) {
            throw DigitalOceanApiException.unauthorized(errorMessage);
        }

        if (statusCode === 403) {
            throw DigitalOceanApiException.forbidden(errorMessage);
        }

        if (statusCode === 503) {
            throw DigitalOceanApiException.serviceUnavailable(errorMessage);
        }

        throw DigitalOceanApiException.serviceUnavailable(
            `DigitalOcean API returned status ${statusCode}: ${errorMessage}`
        );
    }
}
