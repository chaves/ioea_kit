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
const CACHE_TTL = 5000; // Cache for 5 seconds (very short for production debugging)

/**
 * Load dynamic configuration from database
 * Results are cached for 1 minute to reduce database queries
 */
export async function loadDynamicConfig(): Promise<DynamicConfig> {
	const now = Date.now();

	// Return cached config if still valid
	// BUT: If cache is stale (older than 1 minute), force refresh to catch DB updates
	if (cachedConfig && now - cacheTime < CACHE_TTL && now - cacheTime < 60000) {
		return cachedConfig;
	}
	
	// Clear cache if it's too old
	if (cachedConfig && now - cacheTime >= 60000) {
		console.log(`[Config] Cache is stale (${Math.floor((now - cacheTime) / 1000)}s old), forcing refresh`);
		cachedConfig = null;
		cacheTime = 0;
	}

	try {
		// Load all config from database
		const configs = await prisma.site_config.findMany();
		
		// Debug: Log raw database results
		console.log(`[Config] Total configs loaded from DB: ${configs.length}`);
		const sessionConfigs = configs.filter(c => c.key.startsWith('session.'));
		console.log(`[Config] Session-related configs from DB:`, sessionConfigs.map(c => ({ key: c.key, value: c.value })));
		
		// Check specifically for session.sessionNumber - try exact match and trimmed
		const sessionNumberRecord = configs.find(c => c.key === 'session.sessionNumber' || c.key.trim() === 'session.sessionNumber');
		if (sessionNumberRecord) {
			console.log(`[Config] ✅ Found session.sessionNumber in DB: key="${sessionNumberRecord.key}", value="${sessionNumberRecord.value}", type=${typeof sessionNumberRecord.value}`);
			console.log(`[Config] Key length: ${sessionNumberRecord.key.length}, Key bytes:`, Array.from(sessionNumberRecord.key).map(c => c.charCodeAt(0)));
		} else {
			console.error(`[Config] ❌ session.sessionNumber NOT FOUND in database!`);
			console.error(`[Config] Available keys:`, configs.map(c => c.key));
			// Try to find similar keys
			const similarKeys = configs.filter(c => c.key.toLowerCase().includes('sessionnumber') || c.key.toLowerCase().includes('session_number'));
			if (similarKeys.length > 0) {
				console.error(`[Config] Found similar keys:`, similarKeys.map(c => ({ key: c.key, value: c.value })));
			}
		}

		// Convert to a Map for easy lookup - ensure keys are trimmed
		const configMap = new Map<string, string>(
			configs.map((c) => [c.key.trim(), c.value])
		);
		
		// Debug: Log all session-related config keys
		const sessionKeys = Array.from(configMap.keys()).filter(k => k.startsWith('session.'));
		console.log(`[Config] Session keys in Map:`, sessionKeys);
		const mapValue = configMap.get('session.sessionNumber');
		console.log(`[Config] session.sessionNumber in Map:`, mapValue, `(type: ${typeof mapValue})`);
		
		// Also try with trimmed key lookup
		if (!mapValue) {
			const trimmedLookup = Array.from(configMap.entries()).find(([k]) => k.trim() === 'session.sessionNumber');
			if (trimmedLookup) {
				console.log(`[Config] Found with trimmed lookup:`, trimmedLookup);
			}
		}

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
		
		// Try multiple ways to get the session number (handle potential key issues)
		let sessionNumberFromDB = configMap.get('session.sessionNumber');
		if (!sessionNumberFromDB) {
			// Try with trimmed key
			const trimmedEntry = Array.from(configMap.entries()).find(([k]) => k.trim() === 'session.sessionNumber');
			if (trimmedEntry) {
				sessionNumberFromDB = trimmedEntry[1];
				console.log(`[Config] Found sessionNumber using trimmed key lookup: ${sessionNumberFromDB}`);
			}
		}
		
		// If still not found, try direct database query as last resort
		if (!sessionNumberFromDB) {
			console.warn(`[Config] sessionNumber not in Map, trying direct DB query...`);
			const directQuery = await prisma.site_config.findUnique({
				where: { key: 'session.sessionNumber' }
			});
			if (directQuery) {
				sessionNumberFromDB = directQuery.value;
				console.log(`[Config] Found via direct DB query: ${sessionNumberFromDB}`);
			}
		}
		
		// Log for debugging - always log to help diagnose production issues
		console.log(`[Config] Loading session config for year ${sessionYear}`);
		console.log(`[Config] Raw sessionNumberFromDB value:`, sessionNumberFromDB, `(type: ${typeof sessionNumberFromDB})`);
		
		if (sessionNumberFromDB) {
			const parsed = parseInt(sessionNumberFromDB, 10);
			if (isNaN(parsed)) {
				console.error(`[Config] ERROR: session.sessionNumber value "${sessionNumberFromDB}" is not a valid number!`);
			} else {
				console.log(`[Config] ✅ Loaded session number from DB: ${parsed} (parsed from "${sessionNumberFromDB}")`);
			}
		} else {
			const fallback = sessionYear - staticConfig.archiveFromYear + 1;
			console.warn(`[Config] ⚠️  session.sessionNumber not found in database, using fallback calculation: ${fallback}`);
			console.warn(`[Config] Available session keys:`, Array.from(configMap.keys()).filter(k => k.startsWith('session.')));
		}
		
		const sessionNumber = sessionNumberFromDB 
			? parseInt(sessionNumberFromDB, 10)
			: sessionYear - staticConfig.archiveFromYear + 1; // Fallback calculation
		
		// Final validation log
		console.log(`[Config] Final sessionNumber value: ${sessionNumber} (type: ${typeof sessionNumber})`);
		
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
