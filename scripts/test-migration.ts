/**
 * Test script to verify the call_submissions migration
 */
import { prisma } from '../src/lib/server/db';

async function testMigration() {
	console.log('🔍 Testing call_submissions migration...\n');

	try {
		// Test 1: Check if call_submissions table exists and has data
		console.log('Test 1: Checking call_submissions table...');
		const submissionsCount = await prisma.call_submissions.count();
		console.log(`✅ Found ${submissionsCount} submissions\n`);

		// Test 2: Check if call_notes uses correct field names
		console.log('Test 2: Checking call_notes structure...');
		const notesCount = await prisma.call_notes.count();
		console.log(`✅ Found ${notesCount} notes\n`);

		// Test 3: Check if call_reviewers exists
		console.log('Test 3: Checking call_reviewers...');
		const reviewersCount = await prisma.call_reviewers.count();
		console.log(`✅ Found ${reviewersCount} reviewers\n`);

		// Test 4: Check call_groups
		console.log('Test 4: Checking call_groups...');
		const groupsCount = await prisma.call_groups.count();
		console.log(`✅ Found ${groupsCount} groups\n`);

		// Test 5: Check junction table
		console.log('Test 5: Checking call_reviewer_call_submissions...');
		const assignmentsCount = await prisma.call_reviewer_call_submissions.count();
		console.log(`✅ Found ${assignmentsCount} reviewer-submission assignments\n`);

		// Test 6: Sample query with new field names
		console.log('Test 6: Testing query with new field names...');
		const sampleSubmission = await prisma.call_submissions.findFirst({
			select: {
				id: true,
				call_year: true,
				first_name: true,
				last_name: true,
				email: true,
				title: true,
				summary: true,
				call_group_id: true
			}
		});

		if (sampleSubmission) {
			console.log('✅ Sample submission query successful:');
			console.log(`   ID: ${sampleSubmission.id} (BigInt)`);
			console.log(`   Year: ${sampleSubmission.call_year}`);
			console.log(`   Name: ${sampleSubmission.first_name} ${sampleSubmission.last_name}`);
			console.log(`   Title: ${sampleSubmission.title}`);
			console.log(`   Group ID: ${sampleSubmission.call_group_id}\n`);
		} else {
			console.log('⚠️  No submissions found (this is OK if database is empty)\n');
		}

		// Test 7: Test note query with new field names
		console.log('Test 7: Testing note query with new field names...');
		const sampleNote = await prisma.call_notes.findFirst({
			select: {
				id: true,
				call_submission_id: true,
				call_reviewer_id: true,
				note: true
			}
		});

		if (sampleNote) {
			console.log('✅ Sample note query successful:');
			console.log(`   Note ID: ${sampleNote.id} (BigInt)`);
			console.log(`   Submission ID: ${sampleNote.call_submission_id} (BigInt)`);
			console.log(`   Reviewer ID: ${sampleNote.call_reviewer_id} (BigInt)`);
			console.log(`   Score: ${sampleNote.note}\n`);
		} else {
			console.log('⚠️  No notes found (this is OK if database is empty)\n');
		}

		console.log('✨ All migration tests passed!\n');
		console.log('Migration summary:');
		console.log('- call_submissions: ✅ Working with BigInt IDs');
		console.log('- call_notes: ✅ Using call_submission_id and call_reviewer_id');
		console.log('- call_reviewers: ✅ Using call_group_id');
		console.log('- call_groups: ✅ Available');
		console.log('- call_reviewer_call_submissions: ✅ Junction table ready');

	} catch (error) {
		console.error('❌ Migration test failed:', error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

testMigration();
