import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { getSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);

	if (!session || (session.userType !== 'admin' && session.reviewerType !== 'manager')) {
		throw redirect(302, '/admin/login');
	}

	// Get all proposals with their notes
	const proposals = await prisma.call_proposals.findMany({
		orderBy: { last_name: 'asc' }
	});

	// Get notes separately
	const notes = await prisma.call_notes.findMany();

	// Get reviewers
	const reviewers = await prisma.call_reviewers.findMany();

	// Calculate average scores for each proposal
	const proposalsWithScores = proposals.map((p) => {
		const proposalNotes = notes.filter((n) => n.call_id === p.id);
		const avgScore =
			proposalNotes.length > 0
				? proposalNotes.reduce((sum, n) => sum + n.note, 0) / proposalNotes.length
				: 0;

		return {
			id: p.id,
			firstName: p.first_name ?? '',
			lastName: p.last_name ?? '',
			email: p.email ?? '',
			university: p.university ?? '',
			country: p.country ?? 0,
			status: p.status ?? 0,
			reviewerGroup: p.reviewer_group ?? 0,
			avgScore,
			noteCount: proposalNotes.length,
			notes: proposalNotes.map((n) => ({
				note: n.note,
				reviewerId: n.reviewer_id,
				reviewerName: reviewers.find((r) => r.id === n.reviewer_id)?.name ?? 'Unknown'
			}))
		};
	});

	return {
		proposals: proposalsWithScores,
		reviewers: reviewers.map((r) => ({
			id: r.id,
			name: r.name,
			type: r.type,
			group: r.group
		}))
	};
};
