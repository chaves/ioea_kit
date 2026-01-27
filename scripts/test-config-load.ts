/**
 * Test configuration loading
 */

import { loadDynamicConfig } from '../src/lib/server/config';

async function testConfigLoad() {
	try {
		console.log('Testing configuration loading...\n');

		const config = await loadDynamicConfig();

		console.log('✓ Configuration loaded successfully!\n');
		console.log('Emails:', JSON.stringify(config.emails, null, 2));
		console.log('\nDeadlines:', JSON.stringify(config.deadlines, null, 2));
	} catch (error) {
		console.error('✗ Error loading configuration:', error);
		throw error;
	}
}

testConfigLoad()
	.then(() => {
		console.log('\n✓ Test completed successfully!');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n✗ Test failed:', error);
		process.exit(1);
	});
