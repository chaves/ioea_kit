/**
 * Script to verify and update session number in database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySessionNumber() {
	console.log('\n🔍 Verifying session number configuration...\n');

	try {
		// Check if session.sessionNumber exists
		const sessionNumberConfig = await prisma.site_config.findUnique({
			where: { key: 'session.sessionNumber' }
		});

		if (sessionNumberConfig) {
			console.log('✅ Found session.sessionNumber in database:');
			console.log(`   Key: ${sessionNumberConfig.key}`);
			console.log(`   Value: ${sessionNumberConfig.value}`);
			console.log(`   Category: ${sessionNumberConfig.category}`);
			console.log(`   Updated: ${sessionNumberConfig.updated}`);
			
			// Verify the value
			const value = parseInt(sessionNumberConfig.value, 10);
			if (isNaN(value)) {
				console.error(`\n❌ ERROR: Value "${sessionNumberConfig.value}" is not a valid number!`);
				console.log('   The value must be a numeric string (e.g., "23")');
			} else {
				console.log(`\n✅ Value is valid: ${value}`);
			}
		} else {
			console.log('❌ session.sessionNumber NOT found in database!');
			console.log('\nTo add it, run:');
			console.log(`
INSERT INTO site_config (\`key\`, \`value\`, \`category\`) VALUES
('session.sessionNumber', '23', 'session')
ON DUPLICATE KEY UPDATE
  \`value\` = VALUES(\`value\`),
  \`updated\` = CURRENT_TIMESTAMP;
			`);
		}

		// Check all session-related configs
		console.log('\n📋 All session-related configs:');
		const sessionConfigs = await prisma.site_config.findMany({
			where: {
				key: {
					startsWith: 'session.'
				}
			},
			orderBy: { key: 'asc' }
		});

		if (sessionConfigs.length === 0) {
			console.log('   No session configs found');
		} else {
			sessionConfigs.forEach(config => {
				console.log(`   ${config.key} = ${config.value}`);
			});
		}

	} catch (error) {
		console.error('❌ Error:', error);
	} finally {
		await prisma.$disconnect();
	}
}

verifySessionNumber();
