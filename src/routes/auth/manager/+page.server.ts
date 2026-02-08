import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { getSession, hasRole } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const session = await getSession(cookies);

	if (!session || !hasRole(session, 'admin')) {
		throw redirect(302, '/auth/login');
	}

	const filter = url.searchParams.get('filter') ?? 'all';

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

	// Get countries for nationality lookup
	const countries = await prisma.countries.findMany();
	const countryMap = new Map(countries.map((c) => [c.id, c.name]));

	// Build proposals with all fields the component needs
	const allProposals = submissions.map((p) => {
		const proposalNotes = notes.filter((n) => n.call_submission_id === p.id);
		const avgNote =
			proposalNotes.length > 0
				? proposalNotes.reduce((sum, n) => sum + n.note, 0) / proposalNotes.length
				: null;

		return {
			id: Number(p.id),
			firstName: p.first_name,
			lastName: p.last_name,
			email: p.email,
			nationality: countryMap.get(p.nationality) ?? null,
			country: countryMap.get(p.country) ?? null,
			university: p.university,
			status: p.status,
			age: p.age,
			gender: p.gender,
			reviewerGroup: p.call_group_id ? Number(p.call_group_id) : null,
			cv: p.cv || null,
			paper: p.paper || null,
			totalNotes: proposalNotes.length,
			avgNote,
			accepted: p.accepted,
		};
	});

	// Compute stats from all proposals
	const stats = {
		total: allProposals.length,
		accepted: allProposals.filter((p) => p.accepted).length,
		rejected: allProposals.filter((p) => !p.accepted && p.totalNotes > 0).length,
		notRated: allProposals.filter((p) => p.totalNotes === 0).length,
		female: allProposals.filter((p) => p.gender?.toLowerCase() === 'f').length,
		male: allProposals.filter((p) => p.gender?.toLowerCase() === 'm').length,
	};

	// Apply filter
	let proposals = allProposals;
	if (filter === 'accepted') {
		proposals = allProposals.filter((p) => p.accepted);
	} else if (filter === 'rejected') {
		proposals = allProposals.filter((p) => !p.accepted && p.totalNotes > 0);
	} else if (filter === 'not_rated') {
		proposals = allProposals.filter((p) => p.totalNotes === 0);
	}

	return {
		proposals,
		stats,
		filter,
	};
};
