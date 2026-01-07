/**
 * Test that the config page data can be serialized properly
 */

import { prisma } from '../src/lib/server/db';

async function testSerialization() {
	try {
		console.log('Testing config page data serialization...\n');

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

		// Test JSON serialization (what SvelteKit does)
		const serialized = JSON.stringify({ configsByCategory });
		const deserialized = JSON.parse(serialized);

		console.log('✓ Data serializes successfully!');
		console.log(`✓ Serialized size: ${serialized.length} bytes`);
		console.log(
			`✓ Categories: ${Object.keys(deserialized.configsByCategory).join(', ')}`
		);

		// Show sample data
		const firstCategory = Object.keys(deserialized.configsByCategory)[0];
		const firstItem = deserialized.configsByCategory[firstCategory][0];
		console.log('\n✓ Sample item:');
		console.log(`  Key: ${firstItem.key}`);
		console.log(`  Value: ${firstItem.value}`);
		console.log(`  Updated: ${firstItem.updated}`);
		console.log(`  Date display: ${new Date(firstItem.updated).toLocaleString()}`);

		console.log('\n✓ All tests passed! The config page should load without errors.');
	} catch (error) {
		console.error('✗ Serialization test failed:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

testSerialization()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('Test failed:', error);
		process.exit(1);
	});
