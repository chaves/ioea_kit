/**
 * Initialize site configuration table
 * Creates the table and seeds with default values
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initSiteConfig() {
	try {
		console.log('Initializing site configuration...\n');

		// Create the table using raw SQL
		console.log('Creating site_config table...');
		await prisma.$executeRaw`
			CREATE TABLE IF NOT EXISTS site_config (
				id INT UNSIGNED NOT NULL AUTO_INCREMENT,
				\`key\` VARCHAR(100) NOT NULL,
				\`value\` TEXT NOT NULL,
				category VARCHAR(50) NOT NULL,
				updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				PRIMARY KEY (id),
				UNIQUE KEY \`key\` (\`key\`),
				KEY category (category)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
		`;
		console.log('✓ Table created\n');

		// Seed with default values
		console.log('Seeding default configuration values...');

		const defaultConfigs = [
			// Email settings
			{ key: 'email.general', value: 'ioea.coordinator@gmail.com', category: 'email' },
			{ key: 'email.coordination', value: 'ioea.coordinator@gmail.com', category: 'email' },
			{ key: 'email.webmaster', value: 'webmaster@ioea.eu', category: 'email' },

			// Deadline settings
			{ key: 'deadline.application', value: 'TBD', category: 'deadline' },
			{ key: 'deadline.notification', value: 'TBD', category: 'deadline' },
			{ key: 'deadline.registration', value: 'TBD', category: 'deadline' },
			{ key: 'deadline.students', value: 'TBD', category: 'deadline' },

			// Application deadline settings
			{ key: 'applicationDeadline.first.date', value: 'TBD', category: 'applicationDeadline' },
			{
				key: 'applicationDeadline.first.notificationDate',
				value: 'TBD',
				category: 'applicationDeadline'
			},
			{ key: 'applicationDeadline.first.active', value: 'false', category: 'applicationDeadline' },
			{ key: 'applicationDeadline.second.date', value: 'TBD', category: 'applicationDeadline' },
			{
				key: 'applicationDeadline.second.notificationDate',
				value: 'TBD',
				category: 'applicationDeadline'
			},
			{
				key: 'applicationDeadline.second.active',
				value: 'false',
				category: 'applicationDeadline'
			},

			// Registration deadline settings
			{ key: 'registrationDeadline.date', value: 'TBD', category: 'registrationDeadline' },
			{ key: 'registrationDeadline.active', value: 'false', category: 'registrationDeadline' }
		];

		for (const config of defaultConfigs) {
			const existing = await prisma.site_config.findUnique({
				where: { key: config.key }
			});

			if (!existing) {
				await prisma.site_config.create({
					data: config
				});
				console.log(`  ✓ Created: ${config.key} = ${config.value}`);
			} else {
				console.log(`  - Skipped: ${config.key} (already exists)`);
			}
		}

		console.log('\n✓ Site configuration initialized successfully!');
	} catch (error) {
		console.error('Error initializing site configuration:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

initSiteConfig()
	.then(() => {
		console.log('\nScript completed successfully.');
		process.exit(0);
	})
	.catch((error) => {
		console.error('Script failed:', error);
		process.exit(1);
	});
