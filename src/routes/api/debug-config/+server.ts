import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadDynamicConfig } from '$lib/server/config';
import { getConfig } from '$lib/config';
import { prisma } from '$lib/server/db';

/**
 * Debug endpoint to check current configuration values
 * Accessible at /api/debug-config
 * Useful for diagnosing production issues
 */
export const GET: RequestHandler = async ({ locals }) => {
	try {
		// Also query the database directly to see what's actually there
		
		const dbConfigs = await prisma.site_config.findMany({
			where: {
				key: {
					startsWith: 'session.'
				}
			}
		});
		
		const sessionNumberRecord = await prisma.site_config.findUnique({
			where: { key: 'session.sessionNumber' }
		});
		
		// Force refresh to bypass cache for debugging
		const dynamicConfig = await loadDynamicConfig(true);
		const fullConfig = getConfig(dynamicConfig);

		return json({
			success: true,
			timestamp: new Date().toISOString(),
			database: {
				allSessionKeys: dbConfigs.map(c => ({ key: c.key, value: c.value })),
				sessionNumberRecord: sessionNumberRecord ? {
					key: sessionNumberRecord.key,
					value: sessionNumberRecord.value,
					updated: sessionNumberRecord.updated
				} : null
			},
			dynamicConfig: {
				session: {
					year: dynamicConfig.session.year,
					sessionNumber: dynamicConfig.session.sessionNumber,
					fullDateRange: dynamicConfig.session.fullDateRange,
					dateRange: dynamicConfig.session.dateRange
				}
			},
			fullConfig: {
				session: {
					year: fullConfig.session.year,
					sessionNumber: fullConfig.session.sessionNumber,
					fullDateRange: fullConfig.session.fullDateRange
				}
			},
			raw: {
				sessionNumber: dynamicConfig.session.sessionNumber,
				sessionNumberType: typeof dynamicConfig.session.sessionNumber
			}
		});
	} catch (error) {
		console.error('[Debug Config] Error:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				timestamp: new Date().toISOString()
			},
			{ status: 500 }
		);
	}
};
