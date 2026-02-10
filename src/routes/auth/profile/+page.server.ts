import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getSession, hashPassword, verifyPassword, createEmailChangeToken } from '$lib/server/auth';
import { prisma } from '$lib/server/db';
import { sendEmail, emailChangeVerificationEmail } from '$lib/server/email';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		throw redirect(303, '/auth/login');
	}

	// Check for pending email change
	const pendingToken = await prisma.email_change_tokens.findFirst({
		where: {
			user_id: locals.session.userId,
			used_at: null,
			expires_at: { gt: new Date() },
		},
		orderBy: { created_at: 'desc' },
	});

	return {
		user: {
			name: locals.session.name,
			email: locals.session.email,
		},
		pendingEmail: pendingToken?.new_email ?? null,
	};
};

export const actions: Actions = {
	updateProfile: async ({ cookies, request, url }) => {
		const session = await getSession(cookies);
		if (!session) throw redirect(303, '/auth/login');

		const formData = await request.formData();
		const name = (formData.get('name') as string)?.trim();
		const email = (formData.get('email') as string)?.trim().toLowerCase();

		if (!name || !email) {
			return fail(400, { error: 'Name and email are required.', name, email });
		}

		// Always update the name
		await prisma.users.update({
			where: { id: session.userId },
			data: { name }
		});
		session.name = name;

		// If email changed, send verification instead of applying directly
		const emailChanged = email !== session.email.toLowerCase();

		if (emailChanged) {
			// Check email uniqueness
			const existing = await prisma.users.findFirst({
				where: { email, id: { not: session.userId } }
			});
			if (existing) {
				return fail(400, { error: 'This email is already in use.', name, email });
			}

			const token = await createEmailChangeToken(session.userId, email);
			const verifyUrl = `${url.origin}/auth/verify-email?token=${token}`;

			await sendEmail(emailChangeVerificationEmail({
				name: session.name,
				newEmail: email,
				verifyUrl,
			}));

			return { profileSuccess: true, emailPending: true, pendingEmail: email, name, email: session.email };
		}

		return { profileSuccess: true, name, email };
	},

	changePassword: async ({ cookies, request }) => {
		const session = await getSession(cookies);
		if (!session) throw redirect(303, '/auth/login');

		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!currentPassword) {
			return fail(400, { passwordError: 'Current password is required.' });
		}

		if (!password || password.length < 8) {
			return fail(400, { passwordError: 'New password must be at least 8 characters.' });
		}

		if (password !== confirmPassword) {
			return fail(400, { passwordError: 'Passwords do not match.' });
		}

		// Verify current password
		const user = await prisma.users.findUnique({ where: { id: session.userId } });
		if (!user || !user.password_hash || !(await verifyPassword(currentPassword, user.password_hash))) {
			return fail(400, { passwordError: 'Current password is incorrect.' });
		}

		const passwordHash = await hashPassword(password);
		await prisma.users.update({
			where: { id: session.userId },
			data: { password_hash: passwordHash, must_change_password: false }
		});

		return { passwordSuccess: true };
	}
};
