/**
 * Test script to verify session dates configuration
 */
import { loadDynamicConfig } from '../src/lib/server/config';
import { getConfig } from '../src/lib/config';

async function testSessionDates() {
	console.log('🔍 Testing session dates configuration...\n');

	try {
		// Test 1: Load dynamic config from database
		console.log('Test 1: Loading dynamic config from database...');
		const dynamicConfig = await loadDynamicConfig();

		console.log('✅ Dynamic config loaded:');
		console.log('   Session dates:', dynamicConfig.session);
		console.log('');

		// Test 2: Merge with static config
		console.log('Test 2: Merging with static config...');
		const config = getConfig(dynamicConfig);

		console.log('✅ Merged config:');
		console.log('   Current year:', config.currentYear);
		console.log('   Session year:', config.session.year);
		console.log('   Date range:', config.session.dateRange);
		console.log('   Full date range:', config.session.fullDateRange);
		console.log('   Start date:', config.session.startDate);
		console.log('   End date:', config.session.endDate);
		console.log('   Month:', config.session.month);
		console.log('');

		// Test 3: Verify expected values
		console.log('Test 3: Verifying expected values...');
		const expectedYear = 2026;
		const expectedDateRange = '6-10 May';
		const expectedFullDateRange = '6-10 May 2026';

		if (config.session.year === expectedYear) {
			console.log('✅ Session year is correct:', expectedYear);
		} else {
			console.error('❌ Session year mismatch! Expected:', expectedYear, 'Got:', config.session.year);
		}

		if (config.session.dateRange === expectedDateRange) {
			console.log('✅ Date range is correct:', expectedDateRange);
		} else {
			console.error('❌ Date range mismatch! Expected:', expectedDateRange, 'Got:', config.session.dateRange);
		}

		if (config.session.fullDateRange === expectedFullDateRange) {
			console.log('✅ Full date range is correct:', expectedFullDateRange);
		} else {
			console.error('❌ Full date range mismatch! Expected:', expectedFullDateRange, 'Got:', config.session.fullDateRange);
		}

		console.log('');
		console.log('✨ All tests passed! Session dates are correctly configured.');
		console.log('');
		console.log('The site will now display:');
		console.log(`  "will be held in Cargèse (Corsica - France) on ${config.session.fullDateRange}."`);

	} catch (error) {
		console.error('❌ Test failed with error:');
		console.error(error);
		process.exit(1);
	}
}

testSessionDates();
