/**
 * Server-side configuration loader
 * Loads dynamic configuration from database
 */

import { prisma } from './db';

interface DynamicConfig {
	session: {
		year: number;
		startDate: number;
		endDate: number;
		month: string;
		dateRange: string;
		fullDateRange: string;
	};
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
			session: {
				year: parseInt(configMap.get('session.year') || '2026', 10),
				startDate: parseInt(configMap.get('session.startDate') || '6', 10),
				endDate: parseInt(configMap.get('session.endDate') || '10', 10),
				month: configMap.get('session.month') || 'May',
				dateRange: configMap.get('session.dateRange') || '6-10 May',
				fullDateRange: configMap.get('session.fullDateRange') || '6-10 May 2026'
			},
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
			session: {
				year: 2026,
				startDate: 6,
				endDate: 10,
				month: 'May',
				dateRange: '6-10 May',
				fullDateRange: '6-10 May 2026'
			},
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
