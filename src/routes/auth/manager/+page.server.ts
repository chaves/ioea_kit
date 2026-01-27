import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { getSession, hasRole } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);

	if (!session || !hasRole(session, 'admin')) {
		throw redirect(302, '/auth/login');
	}

	// Get all submissions
	const submissions = await prisma.call_submissions.findMany({
		orderBy: { last_name: 'asc' }
	});

	// Get notes separately
	const notes = await prisma.call_notes.findMany();

	// Get reviewers
	const reviewers = await prisma.call_reviewers.findMany();

	// Get groups
	const groups = await prisma.call_groups.findMany();

	// Calculate average scores for each submission
	const proposalsWithScores = submissions.map((p) => {
		const proposalNotes = notes.filter((n) => n.call_submission_id === p.id);
		const avgScore =
			proposalNotes.length > 0
				? proposalNotes.reduce((sum, n) => sum + n.note, 0) / proposalNotes.length
				: 0;

		return {
			id: p.id,
			firstName: p.first_name,
			lastName: p.last_name,
			email: p.email,
			university: p.university,
			country: p.country,
			status: p.status,
			callYear: p.call_year,
			accepted: p.accepted,
			groupId: p.call_group_id,
			groupName: p.call_group_id
				? groups.find((g) => g.id === p.call_group_id)?.name ?? 'Unknown'
				: 'Unassigned',
			avgScore,
			noteCount: proposalNotes.length,
			notes: proposalNotes.map((n) => ({
				note: n.note,
				reviewerId: n.call_reviewer_id,
				reviewerName: reviewers.find((r) => r.id === n.call_reviewer_id)?.name ?? 'Unknown'
			}))
		};
	});

	return {
		proposals: proposalsWithScores,
		reviewers: reviewers.map((r) => ({
			id: r.id,
			name: r.name,
			email: r.email,
			groupId: r.call_group_id,
			groupName: r.call_group_id
				? groups.find((g) => g.id === r.call_group_id)?.name ?? 'Unknown'
				: 'Unassigned'
		})),
		groups: groups.map((g) => ({
			id: g.id,
			year: g.year,
			name: g.name
		}))
	};
};
