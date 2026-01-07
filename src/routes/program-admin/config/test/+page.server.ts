import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	console.log('[TEST] Starting config load...');

	try {
		const configs = await prisma.site_config.findMany({
			orderBy: [{ category: 'asc' }, { key: 'asc' }]
		});

		console.log('[TEST] Loaded', configs.length, 'configs');

		const configsByCategory: Record<
			string,
			Array<{ key: string; value: string; updated: string }>
		> = {};

		for (const config of configs) {
			if (!configsByCategory[config.category]) {
				configsByCategory[config.category] = [];
			}
			configsByCategory[config.category].push({
				key: config.key,
				value: config.value,
				updated: config.updated.toISOString()
			});
		}

		console.log('[TEST] Grouped into', Object.keys(configsByCategory).length, 'categories');

		return {
			configsByCategory,
			testMessage: 'Config load successful'
		};
	} catch (error) {
		console.error('[TEST] Error loading config:', error);
		throw error;
	}
};
