import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { hasRole, createUser, generateRandomPassword } from '$lib/server/auth';
import { sendEmail, welcomeUserEmail } from '$lib/server/email';
import { config } from '$lib/config';
import type { call_submissions } from '@prisma/client';

async function upsertStudentRecord(sub: call_submissions) {
	const existing = await prisma.students.findFirst({ where: { email: sub.email } });
	const data = {
		first_name: sub.first_name,
		last_name: sub.last_name,
		email: sub.email,
		nationality: sub.nationality,
		gender: sub.gender.slice(0, 2),
		university: sub.university,
		residence: sub.country,
	};
	if (existing) {
		await prisma.students.update({ where: { id: existing.id }, data });
	} else {
		await prisma.students.create({ data });
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) {
		throw redirect(303, '/auth/login');
	}

	const currentYear = config.currentYear;

	const accepted = await prisma.call_submissions.findMany({
		where: { call_year: currentYear, accepted: true, waitlisted: false },
		orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
	});

	const emails = accepted.map((s) => s.email);
	const existingUsers = await prisma.users.findMany({
		where: { email: { in: emails } },
		include: { roles: { include: { role: true } } },
	});

	const provisionedEmails = new Set(
		existingUsers
			.filter((u) => u.roles.some((ur) => ur.role.name === 'student'))
			.map((u) => u.email)
	);

	const students = accepted.map((s) => ({
		id: s.id.toString(),
		firstName: s.first_name,
		lastName: s.last_name,
		email: s.email,
		university: s.university,
		hasAccount: provisionedEmails.has(s.email),
	}));

	return {
		students,
		year: currentYear,
		stats: {
			total: students.length,
			provisioned: students.filter((s) => s.hasAccount).length,
			pending: students.filter((s) => !s.hasAccount).length,
		},
	};
};

export const actions: Actions = {
	provisionAll: async ({ locals, url }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Access denied.' });
		}

		const currentYear = config.currentYear;

		const accepted = await prisma.call_submissions.findMany({
			where: { call_year: currentYear, accepted: true, waitlisted: false },
		});

		const emails = accepted.map((s) => s.email);
		const existingUsers = await prisma.users.findMany({
			where: { email: { in: emails } },
			include: { roles: { include: { role: true } } },
		});
		const provisionedEmails = new Set(
			existingUsers
				.filter((u) => u.roles.some((ur) => ur.role.name === 'student'))
				.map((u) => u.email)
		);

		const toProvision = accepted.filter((s) => !provisionedEmails.has(s.email));

		if (toProvision.length === 0) {
			return { success: true, message: 'All accepted students already have accounts.' };
		}

		const loginUrl = `${url.origin}/auth/login`;
		let created = 0;
		const errors: string[] = [];

		for (const sub of toProvision) {
			try {
				const password = generateRandomPassword();
				const name = `${sub.first_name} ${sub.last_name}`;
				await createUser({
					email: sub.email,
					name,
					password,
					roleNames: ['student'],
					grantedBy: locals.session.userId,
				});
				await upsertStudentRecord(sub);
				await sendEmail(welcomeUserEmail({ name, email: sub.email, temporaryPassword: password, loginUrl }));
				created++;
			} catch (err) {
				errors.push(sub.email);
				console.error(`Failed to provision ${sub.email}:`, err);
			}
		}

		const msg = `${created} student account${created !== 1 ? 's' : ''} created and welcome emails sent.`;
		return {
			success: true,
			message: errors.length > 0 ? `${msg} Errors on: ${errors.join(', ')}.` : msg,
		};
	},

	provision: async ({ locals, request, url }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Access denied.' });
		}

		const formData = await request.formData();
		const submissionIdStr = String(formData.get('submission_id') ?? '');

		if (!/^\d+$/.test(submissionIdStr)) {
			return fail(400, { error: 'Invalid submission ID.' });
		}

		const submissionId = BigInt(submissionIdStr);
		const sub = await prisma.call_submissions.findUnique({ where: { id: submissionId } });

		if (!sub) {
			return fail(404, { error: 'Submission not found.' });
		}

		if (!sub.accepted || sub.waitlisted) {
			return fail(400, { error: 'This submission is not accepted.' });
		}

		const existing = await prisma.users.findUnique({ where: { email: sub.email } });
		if (existing) {
			return fail(400, { error: `An account already exists for ${sub.email}.` });
		}

		const name = `${sub.first_name} ${sub.last_name}`;
		const password = generateRandomPassword();

		await createUser({
			email: sub.email,
			name,
			password,
			roleNames: ['student'],
			grantedBy: locals.session.userId,
		});
		await upsertStudentRecord(sub);

		const loginUrl = `${url.origin}/auth/login`;
		await sendEmail(welcomeUserEmail({ name, email: sub.email, temporaryPassword: password, loginUrl }));

		return { success: true, message: `Account created for ${name}. Welcome email sent to ${sub.email}.` };
	},
};
