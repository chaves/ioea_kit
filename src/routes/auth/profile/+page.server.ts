import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getSession, hashPassword, verifyPassword } from '$lib/server/auth';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/auth/login');
	}

	return {
		user: {
			name: locals.session.name,
			email: locals.session.email,
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ cookies, request, locals }) => {
		const session = await getSession(cookies);
		if (!session) throw redirect(303, '/auth/login');

		const formData = await request.formData();
		const name = (formData.get('name') as string)?.trim();
		const email = (formData.get('email') as string)?.trim();

		if (!name || !email) {
			return fail(400, { error: 'Name and email are required.', name, email });
		}

		// Check email uniqueness (excluding current user)
		const existing = await prisma.users.findFirst({
			where: { email, id: { not: session.userId } }
		});
		if (existing) {
			return fail(400, { error: 'This email is already in use.', name, email });
		}

		await prisma.users.update({
			where: { id: session.userId },
			data: { name, email }
		});

		// Update the in-memory session
		session.name = name;
		session.email = email;

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
		if (!user || !(await verifyPassword(currentPassword, user.password_hash))) {
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
