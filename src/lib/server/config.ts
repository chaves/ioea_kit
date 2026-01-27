/**
 * Server-side configuration loader
 * Loads dynamic configuration from database
 */

import { prisma } from './db';
import { staticConfig } from '../config';

interface DynamicConfig {
	session: {
		year: number;
		sessionNumber: number;
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
	statusOptions: Record<number, string>;
	travel: {
		transport: string[];
		locations: Record<number, string>;
	};
	transfer: {
		arrival: Record<number, string>;
		departure: Record<number, string>;
	};
}

let cachedConfig: DynamicConfig | null = null;
let cacheTime = 0;
const CACHE_TTL = 10000; // Cache for 10 seconds (reduced for faster updates in production)

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
		
		// Debug: Log all session-related config keys
		const sessionKeys = Array.from(configMap.keys()).filter(k => k.startsWith('session.'));
		console.log(`[Config] Found session config keys:`, sessionKeys);

		// Load status options from call_statuses table
		const statuses = await prisma.call_statuses.findMany({
			orderBy: { id: 'asc' }
		});
		const statusOptions: Record<number, string> = {};
		statuses.forEach((status) => {
			statusOptions[Number(status.id)] = status.name;
		});

		// Load travel locations from students_travels_locations table
		const locations = await prisma.students_travels_locations.findMany({
			orderBy: { id: 'asc' }
		});
		const travelLocations: Record<number, string> = {};
		locations.forEach((location) => {
			travelLocations[location.id] = location.location;
		});

		// Load transfer options from students_travels_transfer table
		const transfers = await prisma.students_travels_transfer.findMany({
			orderBy: { id: 'asc' }
		});
		const transferOptions: Record<number, string> = {};
		transfers.forEach((transfer) => {
			transferOptions[transfer.id] = transfer.transfer;
		});

		// Build the config object
		// NOTE: Session dates should come from database - fallbacks are generic/placeholder values
		const sessionYear = parseInt(configMap.get('session.year') || String(staticConfig.currentYear), 10);
		const sessionNumberFromDB = configMap.get('session.sessionNumber');
		
		// Log for debugging
		if (sessionNumberFromDB) {
			console.log(`[Config] Loaded session number from DB: ${sessionNumberFromDB} for year ${sessionYear}`);
		} else {
			console.warn(`[Config] session.sessionNumber not found in database, using fallback calculation: ${sessionYear - staticConfig.archiveFromYear + 1}`);
		}
		
		const sessionNumber = sessionNumberFromDB 
			? parseInt(sessionNumberFromDB, 10)
			: sessionYear - staticConfig.archiveFromYear + 1; // Fallback calculation
		
		const dynamicConfig: DynamicConfig = {
			session: {
				year: sessionYear,
				sessionNumber: sessionNumber,
				startDate: parseInt(configMap.get('session.startDate') || '0', 10),
				endDate: parseInt(configMap.get('session.endDate') || '0', 10),
				month: configMap.get('session.month') || 'TBD',
				dateRange: configMap.get('session.dateRange') || 'TBD',
				fullDateRange: configMap.get('session.fullDateRange') || 'TBD'
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

		// Return generic fallback values if database fails
		// WARNING: These are placeholder values - database should be fixed ASAP
		return {
			session: {
				year: staticConfig.currentYear,
				sessionNumber: staticConfig.currentYear - staticConfig.archiveFromYear + 1,
				startDate: 0,
				endDate: 0,
				month: 'TBD',
				dateRange: 'TBD',
				fullDateRange: 'TBD'
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
