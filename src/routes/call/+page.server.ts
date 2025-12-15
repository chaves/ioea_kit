import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const countries = await prisma.countries.findMany({
		orderBy: { name: 'asc' }
	});

	return {
		countries: countries.map((c) => ({
			id: c.id,
			name: c.name
		}))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const firstName = data.get('first_name')?.toString().trim();
		const lastName = data.get('last_name')?.toString().trim();
		const email = data.get('email')?.toString().trim().toLowerCase();
		const nationality = data.get('nationality')?.toString();
		const gender = data.get('gender')?.toString();
		const age = data.get('age')?.toString();
		const status = data.get('status')?.toString();
		const domain = data.get('domain')?.toString().trim();
		const diploma = data.get('diploma')?.toString().trim();

		// Collect values for re-population
		const values = {
			first_name: firstName ?? '',
			last_name: lastName ?? '',
			email: email ?? '',
			nationality: nationality ?? '',
			gender: gender ?? '',
			age: age ?? '',
			status: status ?? '',
			domain: domain ?? '',
			diploma: diploma ?? ''
		};

		// Validation
		if (!firstName || !lastName || !email || !nationality || !gender || !age || !status || !domain || !diploma) {
			return fail(400, { error: 'Please fill in all required fields.', values });
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Please enter a valid email address.', values });
		}

		// Check if email already exists
		const existing = await prisma.call_proposals.findFirst({
			where: { email }
		});

		if (existing) {
			return fail(400, { error: 'An application with this email address already exists.', values });
		}

		// Store step 1 data in a cookie (encrypted in production)
		const step1Data = JSON.stringify({
			first_name: firstName,
			last_name: lastName,
			email,
			nationality: parseInt(nationality),
			gender,
			age: parseInt(age),
			status: parseInt(status),
			domain,
			diploma
		});

		cookies.set('call_step1', step1Data, {
			path: '/call',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 // 1 hour
		});

		throw redirect(303, '/call/step2');
	}
};

