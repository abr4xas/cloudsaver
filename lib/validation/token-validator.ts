/**
 * Token Validator
 *
 * Centralized token validation logic shared between client and server.
 * Ensures consistent validation rules across the application.
 */

export interface TokenValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Validate DigitalOcean API token format
 *
 * This validation checks:
 * - Token is not empty
 * - Token meets minimum length requirement (32 characters)
 * - Token contains only valid characters (alphanumeric, dashes, underscores)
 *
 * @param token - DigitalOcean API token to validate
 * @returns Validation result with valid flag and optional error message
 */
export function validateTokenFormat(token: string): TokenValidationResult {
	// Check if token exists and is not empty
	if (!token || token.trim().length === 0) {
		return {
			valid: false,
			error: "Token is required",
		};
	}

	// DigitalOcean tokens are typically 64 characters, but can vary
	// Basic validation: should be alphanumeric and at least 32 chars
	if (token.length < 32) {
		return {
			valid: false,
			error: "Invalid token format: token too short",
		};
	}

	// Check for basic format (alphanumeric, dashes, underscores)
	if (!/^[a-zA-Z0-9_-]+$/.test(token)) {
		return {
			valid: false,
			error: "Invalid token format: contains invalid characters",
		};
	}

	return { valid: true };
}

/**
 * Validate token format (boolean version for client-side)
 *
 * @param token - DigitalOcean API token to validate
 * @returns true if token format is valid, false otherwise
 */
export function isValidTokenFormat(token: string): boolean {
	return validateTokenFormat(token).valid;
}

/**
 * Get token validation error message
 *
 * @param token - DigitalOcean API token to validate
 * @returns Error message if invalid, undefined if valid
 */
export function getTokenValidationError(token: string): string | undefined {
	const result = validateTokenFormat(token);
	return result.valid ? undefined : result.error;
}
