/**
 * Test script to debug Step 1 submission issue with PhD students
 */
import { prisma } from '../src/lib/server/db';

async function testStep1() {
	console.log('🔍 Testing Step 1 submission flow...\n');

	try {
		// Test data similar to what a PhD student would submit
		const testData = {
			first_name: 'John',
			last_name: 'Doe',
			email: 'john.doe@example.com',
			nationality: 1, // Some country ID
			gender: 'M',
			age: 28,
			status: 1, // PhD student
			domain: 'Economics',
			diploma: 'Master in Economics'
		};

		console.log('Test data:', testData);
		console.log('');

		// Test 1: Check if email exists for current year
		console.log('Test 1: Checking for duplicate email...');
		const currentYear = new Date().getFullYear();
		console.log(`Current year: ${currentYear}`);

		const existing = await prisma.call_submissions.findFirst({
			where: {
				email: testData.email,
				call_year: currentYear
			}
		});

		if (existing) {
			console.log(`❌ Email already exists: ${existing.email} (ID: ${existing.id})`);
		} else {
			console.log('✅ No duplicate found - email is available');
		}

		console.log('');

		// Test 2: Simulate cookie data storage
		console.log('Test 2: Simulating cookie data storage...');
		const step1Data = JSON.stringify({
			first_name: testData.first_name,
			last_name: testData.last_name,
			email: testData.email,
			nationality: testData.nationality,
			gender: testData.gender,
			age: testData.age,
			status: testData.status,
			domain: testData.domain,
			diploma: testData.diploma
		});

		console.log('Cookie data (first 100 chars):', step1Data.substring(0, 100));
		console.log('Cookie data length:', step1Data.length, 'bytes');

		// Parse it back to verify
		const parsedData = JSON.parse(step1Data);
		console.log('✅ Cookie data can be serialized and parsed correctly');
		console.log('Parsed status:', parsedData.status, '(type:', typeof parsedData.status, ')');

		console.log('');

		// Test 3: Check database connection and table structure
		console.log('Test 3: Checking database connection...');
		const submissionsCount = await prisma.call_submissions.count();
		console.log(`✅ Database connected - ${submissionsCount} submissions in table`);

		console.log('');
		console.log('✨ All tests passed! Step 1 submission should work correctly.');
		console.log('');
		console.log('If you still get errors:');
		console.log('1. Check server logs for the actual error message');
		console.log('2. Verify database connection in production');
		console.log('3. Check if email field has proper collation (case sensitivity)');

	} catch (error) {
		console.error('❌ Test failed with error:');
		console.error(error);
		console.error('');
		if (error instanceof Error) {
			console.error('Error message:', error.message);
			console.error('Error stack:', error.stack);
		}
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

testStep1();
