import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { hasAnyRole, hasRole } from '$lib/server/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

type Decision = 'pending' | 'accepted' | 'rejected' | 'review';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin'])) {
		throw redirect(302, '/auth/login');
	}

	const rawFilter = url.searchParams.get('filter') ?? 'all';
	const filter: 'all' | Decision =
		rawFilter === 'pending' ||
		rawFilter === 'accepted' ||
		rawFilter === 'rejected' ||
		rawFilter === 'review'
			? rawFilter
			: 'all';

	const submissions = await prisma.call_submissions.findMany({
		orderBy: { created_at: 'desc' }
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

		// State encoding using existing columns only (no DB migration):
		// 00 = pending, 10 = accepted, 01 = rejected, 11 = review.
		const decision: Decision =
			s.accepted && s.waitlisted
				? 'review'
				: s.accepted
					? 'accepted'
					: s.waitlisted
						? 'rejected'
						: 'pending';

		return {
			// Keep bigint IDs as strings to avoid precision loss in JS.
			id: s.id.toString(),
			callYear: s.call_year,
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
			decision
		};
	});

	const stats = {
		total: allSubmissions.length,
		pending: allSubmissions.filter((s) => s.decision === 'pending').length,
		accepted: allSubmissions.filter((s) => s.decision === 'accepted').length,
		rejected: allSubmissions.filter((s) => s.decision === 'rejected').length,
		review: allSubmissions.filter((s) => s.decision === 'review').length
	};

	let filtered = allSubmissions;
	if (filter !== 'all') {
		filtered = allSubmissions.filter((s) => s.decision === filter);
	}

	return {
		submissions: filtered,
		stats,
		filter,
		isSuperAdmin: hasRole(locals.session, 'superadmin'),
	};
};

export const actions: Actions = {
	accept: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin'])) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const submissionIdStr = String(formData.get('submission_id') ?? '');

		if (!/^\d+$/.test(submissionIdStr)) {
			return fail(400, { error: 'Invalid submission ID' });
		}

		const submissionId = BigInt(submissionIdStr);

		await prisma.call_submissions.update({
			where: { id: submissionId },
			data: {
				accepted: true,
				waitlisted: false
			}
		});

		return { success: true };
	},

	reject: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin'])) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const submissionIdStr = String(formData.get('submission_id') ?? '');

		if (!/^\d+$/.test(submissionIdStr)) {
			return fail(400, { error: 'Invalid submission ID' });
		}

		const submissionId = BigInt(submissionIdStr);

		await prisma.call_submissions.update({
			where: { id: submissionId },
			data: {
				accepted: false,
				waitlisted: true
			}
		});

		return { success: true };
	},

	review: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin'])) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const submissionIdStr = String(formData.get('submission_id') ?? '');

		if (!/^\d+$/.test(submissionIdStr)) {
			return fail(400, { error: 'Invalid submission ID' });
		}

		const submissionId = BigInt(submissionIdStr);

		await prisma.call_submissions.update({
			where: { id: submissionId },
			data: {
				accepted: true,
				waitlisted: true
			}
		});

		return { success: true };
	},

	delete: async ({ locals, request }) => {
		if (!locals.session || !hasRole(locals.session, 'superadmin')) {
			return fail(403, { error: 'Superadmin access required' });
		}

		const formData = await request.formData();
		const submissionIdStr = String(formData.get('submission_id') ?? '');

		if (!/^\d+$/.test(submissionIdStr)) {
			return fail(400, { error: 'Invalid submission ID' });
		}

		const submissionId = BigInt(submissionIdStr);

		// Fetch submission to get file paths
		const submission = await prisma.call_submissions.findUnique({
			where: { id: submissionId }
		});

		if (!submission) {
			return fail(404, { error: 'Submission not found' });
		}

		// Delete related notes and comments first
		await prisma.call_notes.deleteMany({
			where: { call_submission_id: submissionId }
		});
		await prisma.call_comments.deleteMany({
			where: { call_submission_id: submissionId }
		});
		await prisma.call_reviewer_call_submissions.deleteMany({
			where: { call_submission_id: submissionId }
		});
		await prisma.call_submissions.delete({
			where: { id: submissionId }
		});

		// Delete uploaded files
		const uploadDir = join('uploads', 'call', String(submission.call_year));
		if (submission.cv) {
			try {
				await unlink(join(uploadDir, submission.cv));
			} catch {
				/* file may not exist */
			}
		}
		if (submission.paper) {
			try {
				await unlink(join(uploadDir, submission.paper));
			} catch {
				/* file may not exist */
			}
		}

		return { success: true };
	}
};
