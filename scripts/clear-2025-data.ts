/**
 * Clear 2025 data to start fresh for 2026
 * This script deletes all data from generic tables (students, call_proposals, etc.)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearData() {
	try {
		console.log('Starting data cleanup for 2026...\n');

		// Clear supporting tables first (due to potential foreign key constraints)
		console.log('Clearing students_travels...');
		await prisma.students_travels.deleteMany();

		console.log('Clearing students_persons...');
		await prisma.students_persons.deleteMany();

		console.log('Clearing students_papers...');
		await prisma.students_papers.deleteMany();

		console.log('Clearing students_groups...');
		await prisma.students_groups.deleteMany();

		console.log('Clearing call_comments...');
		await prisma.call_comments.deleteMany();

		console.log('Clearing call_notes...');
		await prisma.call_notes.deleteMany();

		// Clear main tables
		console.log('Clearing students...');
		const studentsDeleted = await prisma.students.deleteMany();
		console.log(`  → Deleted ${studentsDeleted.count} students`);

		console.log('Clearing call_proposals...');
		const proposalsDeleted = await prisma.call_proposals.deleteMany();
		console.log(`  → Deleted ${proposalsDeleted.count} proposals`);

		console.log('\n✓ All 2025 data has been cleared successfully!');
		console.log('Database is now ready for 2026.\n');
	} catch (error) {
		console.error('Error clearing data:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

clearData()
	.then(() => {
		console.log('Script completed successfully.');
		process.exit(0);
	})
	.catch((error) => {
		console.error('Script failed:', error);
		process.exit(1);
	});
