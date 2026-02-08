import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { hasAnyRole, hasRole } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin'])) {
		throw redirect(302, '/auth/login');
	}

	const filter = url.searchParams.get('filter') ?? 'all';

	const submissions = await prisma.call_submissions.findMany({
		orderBy: { last_name: 'asc' }
	});

	const notes = await prisma.call_notes.findMany();

	const countries = await prisma.countries.findMany();
	const countryMap = new Map(countries.map((c) => [c.id, c.name]));

	const allSubmissions = submissions.map((s) => {
		const submissionNotes = notes.filter((n) => n.call_submission_id === s.id);
		const avgNote =
			submissionNotes.length > 0
				? submissionNotes.reduce((sum, n) => sum + n.note, 0) / submissionNotes.length
				: null;

		return {
			id: Number(s.id),
			firstName: s.first_name,
			lastName: s.last_name,
			email: s.email,
			nationality: countryMap.get(s.nationality) ?? null,
			country: countryMap.get(s.country) ?? null,
			university: s.university,
			department: s.department,
			status: s.status,
			age: s.age,
			gender: s.gender,
			title: s.title,
			summary: s.summary,
			cv: s.cv || null,
			paper: s.paper || null,
			phdAdvisorName: s.phd_ad_name || null,
			phdAdvisorEmail: s.phd_ad_mail || null,
			avgNote,
			accepted: s.accepted,
		};
	});

	const stats = {
		total: allSubmissions.length,
		accepted: allSubmissions.filter((s) => s.accepted).length,
		rejected: allSubmissions.filter((s) => !s.accepted).length,
	};

	let filtered = allSubmissions;
	if (filter === 'accepted') {
		filtered = allSubmissions.filter((s) => s.accepted);
	} else if (filter === 'rejected') {
		filtered = allSubmissions.filter((s) => !s.accepted);
	}

	return {
		submissions: filtered,
		stats,
		filter,
		isAdmin: hasRole(locals.session, 'admin'),
	};
};

export const actions: Actions = {
	accept: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin'])) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const submissionId = Number(formData.get('submission_id'));
		const accepted = formData.get('accepted') === 'true';

		if (!submissionId) {
			return fail(400, { error: 'Invalid submission ID' });
		}

		await prisma.call_submissions.update({
			where: { id: BigInt(submissionId) },
			data: { accepted },
		});

		return { success: true };
	},

	delete: async ({ locals, request }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Admin access required' });
		}

		const formData = await request.formData();
		const submissionId = Number(formData.get('submission_id'));

		if (!submissionId) {
			return fail(400, { error: 'Invalid submission ID' });
		}

		// Delete related notes and comments first
		await prisma.call_notes.deleteMany({
			where: { call_submission_id: BigInt(submissionId) },
		});
		await prisma.call_comments.deleteMany({
			where: { call_submission_id: BigInt(submissionId) },
		});
		await prisma.call_reviewer_call_submissions.deleteMany({
			where: { call_submission_id: BigInt(submissionId) },
		});
		await prisma.call_submissions.delete({
			where: { id: BigInt(submissionId) },
		});

		return { success: true };
	}
};
