/**
 * Server-side configuration loader
 * Loads dynamic configuration from database
 */

import { prisma } from './db';

interface DynamicConfig {
	emails: {
		general: string;
		coordination: string;
		webmaster: string;
	};
	deadlines: {
		application: string;
		notification: string;
		registration: string;
		students: string;
	};
	applicationDeadlines: {
		first: {
			date: string;
			notificationDate: string;
			active: boolean;
		};
		second: {
			date: string;
			notificationDate: string;
			active: boolean;
		};
	};
	registrationDeadline: {
		date: string;
		active: boolean;
	};
}

let cachedConfig: DynamicConfig | null = null;
let cacheTime = 0;
const CACHE_TTL = 60000; // Cache for 1 minute

/**
 * Load dynamic configuration from database
 * Results are cached for 1 minute to reduce database queries
 */
export async function loadDynamicConfig(): Promise<DynamicConfig> {
	const now = Date.now();

	// Return cached config if still valid
	if (cachedConfig && now - cacheTime < CACHE_TTL) {
		return cachedConfig;
	}

	try {
		// Load all config from database
		const configs = await prisma.site_config.findMany();

		// Convert to a Map for easy lookup
		const configMap = new Map<string, string>(
			configs.map((c) => [c.key, c.value])
		);

		// Build the config object
		const dynamicConfig: DynamicConfig = {
			emails: {
				general: configMap.get('email.general') || 'ioea.coordinator@gmail.com',
				coordination: configMap.get('email.coordination') || 'ioea.coordinator@gmail.com',
				webmaster: configMap.get('email.webmaster') || 'webmaster@ioea.eu'
			},
			deadlines: {
				application: configMap.get('deadline.application') || 'TBD',
				notification: configMap.get('deadline.notification') || 'TBD',
				registration: configMap.get('deadline.registration') || 'TBD',
				students: configMap.get('deadline.students') || 'TBD'
			},
			applicationDeadlines: {
				first: {
					date: configMap.get('applicationDeadline.first.date') || 'TBD',
					notificationDate: configMap.get('applicationDeadline.first.notificationDate') || 'TBD',
					active: configMap.get('applicationDeadline.first.active') === 'true'
				},
				second: {
					date: configMap.get('applicationDeadline.second.date') || 'TBD',
					notificationDate:
						configMap.get('applicationDeadline.second.notificationDate') || 'TBD',
					active: configMap.get('applicationDeadline.second.active') === 'true'
				}
			},
			registrationDeadline: {
				date: configMap.get('registrationDeadline.date') || 'TBD',
				active: configMap.get('registrationDeadline.active') === 'true'
			}
		};

		// Update cache
		cachedConfig = dynamicConfig;
		cacheTime = now;

		return dynamicConfig;
	} catch (error) {
		console.error('Error loading dynamic config from database:', error);

		// Return defaults if database fails
		return {
			emails: {
				general: 'ioea.coordinator@gmail.com',
				coordination: 'ioea.coordinator@gmail.com',
				webmaster: 'webmaster@ioea.eu'
			},
			deadlines: {
				application: 'TBD',
				notification: 'TBD',
				registration: 'TBD',
				students: 'TBD'
			},
			applicationDeadlines: {
				first: {
					date: 'TBD',
					notificationDate: 'TBD',
					active: false
				},
				second: {
					date: 'TBD',
					notificationDate: 'TBD',
					active: false
				}
			},
			registrationDeadline: {
				date: 'TBD',
				active: false
			}
		};
	}
}

/**
 * Clear the configuration cache
 * Call this after updating configuration to force a refresh
 */
export function clearConfigCache(): void {
	cachedConfig = null;
	cacheTime = 0;
}
