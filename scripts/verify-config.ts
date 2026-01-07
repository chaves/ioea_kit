/**
 * Verify site configuration table
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyConfig() {
	try {
		console.log('Verifying site configuration...\n');

		const configs = await prisma.site_config.findMany({
			orderBy: [{ category: 'asc' }, { key: 'asc' }]
		});

		console.log(`Found ${configs.length} configuration entries:\n`);

		let currentCategory = '';
		for (const config of configs) {
			if (config.category !== currentCategory) {
				currentCategory = config.category;
				console.log(`\n[${currentCategory}]`);
			}
			console.log(`  ${config.key} = ${config.value}`);
		}

		console.log('\n✓ Configuration verified successfully!');
	} catch (error) {
		console.error('Error verifying configuration:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

verifyConfig()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('Verification failed:', error);
		process.exit(1);
	});
