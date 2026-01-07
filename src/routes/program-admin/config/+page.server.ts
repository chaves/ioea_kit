import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { clearConfigCache } from '$lib/server/config';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// Load all configuration from database
	const configs = await prisma.site_config.findMany({
		orderBy: [{ category: 'asc' }, { key: 'asc' }]
	});

	// Group configs by category
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
			updated: config.updated.toISOString() // Convert Date to string for serialization
		});
	}

	return {
		configsByCategory
	};
};

export const actions = {
	update: async ({ request }) => {
		try {
			const formData = await request.formData();
			const key = formData.get('key') as string;
			const value = formData.get('value') as string;

			if (!key) {
				return fail(400, { error: 'Key is required' });
			}

			// Update the configuration
			await prisma.site_config.update({
				where: { key },
				data: { value }
			});

			// Clear the configuration cache so changes take effect immediately
			clearConfigCache();

			return { success: true, message: 'Configuration updated successfully' };
		} catch (error) {
			console.error('Error updating configuration:', error);
			return fail(500, { error: 'Failed to update configuration' });
		}
	}
} satisfies Actions;
