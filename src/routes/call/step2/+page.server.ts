import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ cookies }) => {
	// Check if step 1 was completed
	const step1Data = cookies.get('call_step1');
	if (!step1Data) {
		throw redirect(303, '/call');
	}

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
		const step1Data = cookies.get('call_step1');
		if (!step1Data) {
			throw redirect(303, '/call');
		}

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

		// Validation
		if (!university || !department || !country || !phdTitle || !phdAdName || !phdAdMail || !phdYear || !phdSummary) {
			return fail(400, { error: 'Please fill in all required fields.', values });
		}

		// Store step 2 data
		const step2Data = JSON.stringify({
			university,
			department,
			country: parseInt(country),
			phd_title: phdTitle,
			phd_ad_name: phdAdName,
			phd_ad_mail: phdAdMail,
			phd_year: parseInt(phdYear),
			phd_summary: phdSummary
		});

		cookies.set('call_step2', step2Data, {
			path: '/call',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60
		});

		throw redirect(303, '/call/step3');
	}
};

