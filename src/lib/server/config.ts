/**
 * Server-side configuration loader
 * Returns static config values (no longer loads from database)
 */

import { staticConfig, defaultDynamicConfig } from '../config';

/**
 * Load configuration - now just returns static config
 * Kept for backward compatibility with existing code
 * @deprecated Use getConfig() from $lib/config instead
 */
export async function loadDynamicConfig() {
	// Return static config values directly
	return defaultDynamicConfig;
}

/**
 * Clear the configuration cache
 * @deprecated No longer needed since we don't cache
 */
export function clearConfigCache(): void {
	// No-op: no cache to clear
}
