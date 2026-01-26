import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { validateProgramAdminPassword, createSession, getSession, hasRole } from '$lib/server/auth';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);
	if (session && hasRole(session, 'program-admin')) {
		throw redirect(302, '/program-admin');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;

		if (!password) {
			return fail(400, { error: 'Password is required' });
		}

		const isValid = await validateProgramAdminPassword(password);
		if (!isValid) {
			return fail(401, { error: 'Invalid password' });
		}

		// Find or create program admin user
		const programAdminEmail = 'program-admin@ioea.eu';
		let user = await prisma.users.findUnique({
			where: { email: programAdminEmail },
			include: {
				roles: {
					include: {
						role: true,
					},
				},
			},
		});

		if (!user) {
			// Create program admin user if it doesn't exist
			const programAdminRole = await prisma.roles.findUnique({
				where: { name: 'program-admin' },
			});

			if (!programAdminRole) {
				return fail(500, { error: 'Program admin role not found. Please run migration.' });
			}

			user = await prisma.users.create({
				data: {
					email: programAdminEmail,
					name: 'Program Administrator',
					password_hash: null, // Password is validated via env var
					roles: {
						create: {
							role_id: programAdminRole.id,
						},
					},
				},
				include: {
					roles: {
						include: {
							role: true,
						},
					},
				},
			});
		}

		const roleNames = user.roles.map((ur) => ur.role.name);

		await createSession(cookies, {
			userId: user.id,
			email: user.email,
			name: user.name,
			roles: roleNames
		});

		throw redirect(302, '/program-admin');
	}
};
