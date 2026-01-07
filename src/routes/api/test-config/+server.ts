import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';

export const GET: RequestHandler = async () => {
	try {
		const configs = await prisma.site_config.findMany({
			orderBy: [{ category: 'asc' }, { key: 'asc' }]
		});

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

		return json({
			success: true,
			data: configsByCategory,
			count: configs.length
		});
	} catch (error) {
		console.error('Error in test-config endpoint:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
