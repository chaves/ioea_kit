import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { getSession, hasAnyRole } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);

	if (!session || !hasAnyRole(session, ['admin', 'reviewer'])) {
		throw redirect(302, '/auth/login');
	}

	const reviewerGroup = session.reviewerGroup ?? 0;
	const reviewerId = session.userId;

	// Get proposals assigned to this reviewer's group
	const proposals = await prisma.call_proposals.findMany({
		where: {
			reviewer_group: reviewerGroup
		},
		orderBy: { last_name: 'asc' }
	});

	// Get existing notes from this reviewer
	const existingNotes = await prisma.call_notes.findMany({
		where: {
			reviewer_id: reviewerId
		}
	});

	const proposalsWithNotes = proposals.map((p) => {
		const note = existingNotes.find((n) => n.call_id === p.id);

		return {
			id: p.id,
			firstName: p.first_name ?? '',
			lastName: p.last_name ?? '',
			email: p.email ?? '',
			university: p.university ?? '',
			phdTitle: p.phd_title ?? '',
			phdSummary: p.phd_summary ?? '',
			cv: p.cv ?? '',
			paper: p.paper ?? '',
			myNote: note?.note ?? null
		};
	});

	return {
		proposals: proposalsWithNotes,
		reviewerId
	};
};

export const actions: Actions = {
	rate: async ({ cookies, request }) => {
		const session = await getSession(cookies);

		if (!session || !hasAnyRole(session, ['admin', 'reviewer'])) {
			throw redirect(302, '/auth/login');
		}

		const formData = await request.formData();
		const proposalId = parseInt(formData.get('proposalId') as string);
		const note = parseInt(formData.get('note') as string);

		if (isNaN(proposalId) || isNaN(note) || note < 1 || note > 5) {
			return fail(400, { error: 'Invalid rating' });
		}

		// Check if note already exists
		const existingNote = await prisma.call_notes.findFirst({
			where: {
				call_id: proposalId,
				reviewer_id: session.userId
			}
		});

		if (existingNote) {
			// Update existing note
			await prisma.call_notes.update({
				where: { id: existingNote.id },
				data: { note }
			});
		} else {
			// Create new note
			await prisma.call_notes.create({
				data: {
					call_id: proposalId,
					reviewer_id: session.userId,
					note,
					type: 1
				}
			});
		}

		return { success: true };
	}
};
