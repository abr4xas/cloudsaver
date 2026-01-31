/**
 * Environment variable validation and access
 * Ensures all required environment variables are set and properly typed
 */

function getEnvVar(key: string, defaultValue?: string): string {
	const value = process.env[key] || defaultValue;

	if (!value && !defaultValue) {
		throw new Error(
			`Missing required environment variable: ${key}. ` +
			`Please check your .env file or environment configuration.`
		);
	}

	return value!; // Non-null assertion is safe here because we throw if value is undefined
}

function getOptionalEnvVar(key: string, defaultValue?: string): string | undefined {
	return process.env[key] || defaultValue;
}

/**
 * Get the site URL with fallback
 */
export function getSiteUrl(): string {
	return getEnvVar('NEXT_PUBLIC_SITE_URL', 'https://do-cloudsaver.vercel.app');
}

/**
 * Get Node environment
 */
export function getNodeEnv(): 'development' | 'production' | 'test' {
	const env = process.env.NODE_ENV || 'development';
	if (env !== 'development' && env !== 'production' && env !== 'test') {
		return 'development';
	}
	return env;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
	return getNodeEnv() === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
	return getNodeEnv() === 'development';
}

/**
 * Validate all required environment variables on startup
 * Call this in your app initialization
 */
export function validateEnv(): void {
	try {
		getSiteUrl();
		getNodeEnv();
		// Add more validations as needed
	} catch (error) {
		if (error instanceof Error) {
			console.error('Environment validation failed:', error.message);
			if (isProduction()) {
				throw error; // Fail fast in production
			}
		}
	}
}

/**
 * Get optional environment variables
 */
export const env = {
	siteUrl: getSiteUrl(),
	nodeEnv: getNodeEnv(),
	isProduction: isProduction(),
	isDevelopment: isDevelopment(),
	sentryDsn: getOptionalEnvVar('SENTRY_DSN'),
	resendApiKey: getOptionalEnvVar('RESEND_API_KEY'),
	newsletterApiKey: getOptionalEnvVar('NEWSLETTER_API_KEY'),
	rateLimitMaxRequests: parseInt(
		getOptionalEnvVar('RATE_LIMIT_MAX_REQUESTS', '10') || '10',
		10
	),
	rateLimitWindowMs: parseInt(
		getOptionalEnvVar('RATE_LIMIT_WINDOW_MS', '60000') || '60000',
		10
	),
} as const;
