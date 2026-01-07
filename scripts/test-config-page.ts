/**
 * Test configuration page loading (simulates what +page.server.ts does)
 */

import { prisma } from '../src/lib/server/db';

async function testConfigPage() {
	try {
		console.log('Testing config page load...\n');

		// Load all configuration from database
		const configs = await prisma.site_config.findMany({
			orderBy: [{ category: 'asc' }, { key: 'asc' }]
		});

		console.log(`✓ Found ${configs.length} configuration entries\n`);

		// Group configs by category
		const configsByCategory: Record<
			string,
			Array<{ key: string; value: string; updated: Date }>
		> = {};

		for (const config of configs) {
			if (!configsByCategory[config.category]) {
				configsByCategory[config.category] = [];
			}
			configsByCategory[config.category].push({
				key: config.key,
				value: config.value,
				updated: config.updated
			});
		}

		console.log('✓ Grouped by category:\n');
		for (const [category, items] of Object.entries(configsByCategory)) {
			console.log(`  ${category}: ${items.length} items`);
		}

		console.log('\n✓ Test completed successfully!');
		console.log('The config page should load without errors.');
	} catch (error) {
		console.error('✗ Error:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

testConfigPage()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n✗ Test failed:', error);
		process.exit(1);
	});
