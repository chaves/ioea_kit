import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
	try {
		console.log('Testing database connection...');

		// Test basic connection
		await prisma.$connect();
		console.log('✓ Connected to database');

		// Test query
		const count = await prisma.countries.count();
		console.log(`✓ Found ${count} countries in database`);

		// Test call_proposals table
		const proposals = await prisma.call_proposals.count();
		console.log(`✓ Found ${proposals} call proposals in database`);

		console.log('\n✓ Database connection is working correctly');
	} catch (error) {
		console.error('✗ Database connection failed:');
		console.error(error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

testConnection();
