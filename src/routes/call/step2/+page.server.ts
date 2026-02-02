import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ cookies }) => {
	// Check if step 1 was completed
	const step1Data = cookies.get('call_step1');
	if (!step1Data) {
		throw redirect(303, '/call');
	}

	// Parse step1 data to get user status
	let step1 = null;
	try {
		step1 = JSON.parse(step1Data);
	} catch (e) {
		throw redirect(303, '/call');
	}

	const countries = await prisma.countries.findMany({
		orderBy: { name: 'asc' }
	});

	return {
		countries: countries.map((c) => ({
			id: c.id,
			name: c.name
		})),
		status: step1.status // Pass status to determine if PhD student (1) or not
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const step1Data = cookies.get('call_step1');
		if (!step1Data) {
			throw redirect(303, '/call');
		}

		// Parse step1 to get user status
		let step1 = null;
		try {
			step1 = JSON.parse(step1Data);
		} catch (e) {
			throw redirect(303, '/call');
		}

		const isPhDStudent = step1.status === 1; // Status 1 = PhD student

		const data = await request.formData();

		const university = data.get('university')?.toString().trim();
		const department = data.get('department')?.toString().trim();
		const country = data.get('country')?.toString();
		const phdTitle = data.get('phd_title')?.toString().trim();
		const phdAdName = data.get('phd_ad_name')?.toString().trim();
		const phdAdMail = data.get('phd_ad_mail')?.toString().trim().toLowerCase();
		const phdYear = data.get('phd_year')?.toString();
		const phdSummary = data.get('phd_summary')?.toString().trim();

		const values = {
			university: university ?? '',
			department: department ?? '',
			country: country ?? '',
			phd_title: phdTitle ?? '',
			phd_ad_name: phdAdName ?? '',
			phd_ad_mail: phdAdMail ?? '',
			phd_year: phdYear ?? '',
			phd_summary: phdSummary ?? ''
		};

		// Basic validation (required for all)
		if (!university || !department || !country || !phdTitle || !phdSummary) {
			return fail(400, { error: 'Please fill in all required fields.', values });
		}

		// Additional validation for PhD students only
		if (isPhDStudent) {
			if (!phdAdName || !phdAdMail || !phdYear) {
				return fail(400, {
					error: 'PhD students must provide supervisor name, email, and expected year of completion.',
					values
				});
			}
		}

		// Store step 2 data
		const step2Data = JSON.stringify({
			university,
			department,
			country: parseInt(country),
			phd_title: phdTitle,
			phd_ad_name: phdAdName || null,
			phd_ad_mail: phdAdMail || null,
			phd_year: phdYear ? parseInt(phdYear) : null,
			phd_summary: phdSummary
		});

		cookies.set('call_step2', step2Data, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60
		});

		throw redirect(303, '/call/step3');
	}
};

