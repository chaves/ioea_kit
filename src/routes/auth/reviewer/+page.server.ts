import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { getSession, hasAnyRole } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies, url }) => {
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

	// Map nationality ids to country names for display.
	const nationalityIds = Array.from(new Set(submissions.map((s) => s.nationality))).filter(
		(id) => typeof id === 'number' && id > 0
	);
	const countries = nationalityIds.length
		? await prisma.countries.findMany({
				where: { id: { in: nationalityIds } },
				select: { id: true, name: true }
			})
		: [];
	const countryNameById = new Map<number, string>(countries.map((c) => [c.id, c.name]));

	// Get existing notes from this reviewer
	const existingNotes = await prisma.call_notes.findMany({
		where: {
			call_reviewer_id: reviewer.id
		}
	});

	const noteBySubmissionId = new Map<string, number>();
	for (const n of existingNotes) {
		noteBySubmissionId.set(n.call_submission_id.toString(), n.note);
	}

	const proposalsAll = submissions.map((p) => {
		const note = noteBySubmissionId.get(p.id.toString()) ?? null;

		return {
			// Never return bigint to the client; SvelteKit can't serialize it.
			id: p.id.toString(),
			callYear: p.call_year,
			firstName: p.first_name,
			lastName: p.last_name,
			email: p.email,
			nationality: countryNameById.get(p.nationality) ?? null,
			university: p.university,
			phdTitle: p.title,
			phdSummary: p.summary,
			cv: p.cv,
			paper: p.paper,
			myNote: note,
			isRated: note !== null
		};
	});

	const filter = url.searchParams.get('filter') ?? 'all';
	const normalizedFilter = filter === 'rated' || filter === 'not_rated' || filter === 'all' ? filter : 'all';

	const stats = {
		total: proposalsAll.length,
		rated: proposalsAll.filter((p) => p.isRated).length,
		notRated: proposalsAll.filter((p) => !p.isRated).length
	};

	const proposals =
		normalizedFilter === 'rated'
			? proposalsAll.filter((p) => p.isRated)
			: normalizedFilter === 'not_rated'
				? proposalsAll.filter((p) => !p.isRated)
				: proposalsAll;

	return {
		proposals,
		stats,
		filter: normalizedFilter
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
		const proposalIdStr = String(formData.get('proposalId') ?? formData.get('proposal_id') ?? '');
		const noteValue = parseInt(String(formData.get('note') ?? ''), 10);

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
