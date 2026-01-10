/**
 * DigitalOcean API Client
 *
 * Base HTTP client for making authenticated requests to the DigitalOcean API.
 * Handles authentication, error handling, and request configuration.
 *
 * @see https://docs.digitalocean.com/reference/api
 */

export class DigitalOceanApiException extends Error {
    constructor(
        message: string,
        public readonly statusCode?: number,
        public readonly code?: string
    ) {
        super(message);
        this.name = 'DigitalOceanApiException';
    }

    static unauthorized(message = 'Unauthorized'): DigitalOceanApiException {
        return new DigitalOceanApiException(message, 401, 'UNAUTHORIZED');
    }

    static forbidden(message = 'Forbidden'): DigitalOceanApiException {
        return new DigitalOceanApiException(message, 403, 'FORBIDDEN');
    }

    static serviceUnavailable(
        message = 'Service unavailable'
    ): DigitalOceanApiException {
        return new DigitalOceanApiException(message, 503, 'SERVICE_UNAVAILABLE');
    }
}

export interface ApiClientConfig {
    baseUrl?: string;
    timeout?: number;
    version?: string;
}

export class ApiClient {
    private readonly baseUrl: string;
    private readonly timeout: number;

    constructor(config: ApiClientConfig = {}) {
        const defaultBaseUrl = 'https://api.digitalocean.com';
        const defaultVersion = 'v2';
        const defaultTimeout = 25; // Keep under 30s to avoid execution time limits

        this.baseUrl = `${config.baseUrl || defaultBaseUrl}/${config.version || defaultVersion}`;
        this.timeout = config.timeout || defaultTimeout;
    }

    /**
     * Make an authenticated GET request to DigitalOcean API
     *
     * @param token - DigitalOcean API token (Bearer token)
     * @param endpoint - API endpoint (e.g., '/droplets')
     * @param params - Query parameters
     * @returns Promise resolving to the JSON response
     * @throws DigitalOceanApiException on API errors
     */
    async get(
        token: string,
        endpoint: string,
        params: Record<string, string | number> = {}
    ): Promise<Record<string, unknown>> {
        if (!token || token.trim() === '') {
            throw DigitalOceanApiException.unauthorized('Token is required');
        }

        const url = new URL(this.baseUrl + endpoint);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(this.timeout * 1000),
            });

            if (!response.ok) {
                await this.handleApiError(response);
            }

            return (await response.json()) as Record<string, unknown>;
        } catch (error) {
            if (error instanceof DigitalOceanApiException) {
                throw error;
            }

            if (error instanceof Error && error.name === 'TimeoutError') {
                throw DigitalOceanApiException.serviceUnavailable(
                    'Request timeout - unable to connect to DigitalOcean API'
                );
            }

            throw DigitalOceanApiException.serviceUnavailable(
                `Unable to connect to DigitalOcean API: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Handle API error response and throw appropriate exception
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
            // If JSON parsing fails, use status text
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

        // For other error codes, default to service unavailable
        throw DigitalOceanApiException.serviceUnavailable(
            `DigitalOcean API returned status ${statusCode}: ${errorMessage}`
        );
    }

    /**
     * Get the base URL
     */
    getBaseUrl(): string {
        return this.baseUrl;
    }

    /**
     * Get the timeout value
     */
    getTimeout(): number {
        return this.timeout;
    }
}
