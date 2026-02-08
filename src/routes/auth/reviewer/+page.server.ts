import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { getSession, hasAnyRole } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);

	if (!session || !hasAnyRole(session, ['admin', 'reviewer'])) {
		throw redirect(302, '/auth/login');
	}

	// Get the reviewer record to find their group
	const reviewer = await prisma.call_reviewers.findFirst({
		where: {
			email: session.email
		}
	});

	if (!reviewer) {
		throw redirect(302, '/auth/login?error=reviewer_not_found');
	}

	// Get submissions assigned to this reviewer via the junction table
	const assignments = await prisma.call_reviewer_call_submissions.findMany({
		where: {
			call_reviewer_id: reviewer.id
		},
		select: {
			call_submission_id: true
		}
	});

	const submissionIds = assignments.map((a) => a.call_submission_id);

	// Get the actual submissions
	const submissions = await prisma.call_submissions.findMany({
		where: {
			id: { in: submissionIds }
		},
		orderBy: { last_name: 'asc' }
	});

	// Get existing notes from this reviewer
	const existingNotes = await prisma.call_notes.findMany({
		where: {
			call_reviewer_id: reviewer.id
		}
	});

	const proposalsWithNotes = submissions.map((p) => {
		const note = existingNotes.find((n) => n.call_submission_id === p.id);

		return {
			id: p.id,
			callYear: p.call_year,
			firstName: p.first_name,
			lastName: p.last_name,
			email: p.email,
			university: p.university,
			phdTitle: p.title,
			phdSummary: p.summary,
			cv: p.cv,
			paper: p.paper,
			myNote: note?.note ?? null
		};
	});

	return {
		proposals: proposalsWithNotes,
		reviewerId: reviewer.id
	};
};

export const actions: Actions = {
	rate: async ({ cookies, request }) => {
		const session = await getSession(cookies);

		if (!session || !hasAnyRole(session, ['admin', 'reviewer'])) {
			throw redirect(302, '/auth/login');
		}

		// Get the reviewer record
		const reviewer = await prisma.call_reviewers.findFirst({
			where: {
				email: session.email
			}
		});

		if (!reviewer) {
			return fail(403, { error: 'Reviewer not found' });
		}

		const formData = await request.formData();
		const proposalIdStr = formData.get('proposalId') as string;
		const noteValue = parseInt(formData.get('note') as string);

		if (!proposalIdStr || isNaN(noteValue) || noteValue < 1 || noteValue > 5) {
			return fail(400, { error: 'Invalid rating' });
		}

		const proposalId = BigInt(proposalIdStr);

		// Check if note already exists
		const existingNote = await prisma.call_notes.findFirst({
			where: {
				call_submission_id: proposalId,
				call_reviewer_id: reviewer.id
			}
		});

		if (existingNote) {
			// Update existing note
			await prisma.call_notes.update({
				where: { id: existingNote.id },
				data: {
					note: noteValue,
					updated_at: new Date()
				}
			});
		} else {
			// Create new note
			await prisma.call_notes.create({
				data: {
					call_submission_id: proposalId,
					call_reviewer_id: reviewer.id,
					note: noteValue,
					type: 1,
					created_at: new Date(),
					updated_at: new Date()
				}
			});
		}

		return { success: true };
	}
};
