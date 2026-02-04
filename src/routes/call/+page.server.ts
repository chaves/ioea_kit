import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { sendEmail, applicationReceiptEmail } from '$lib/server/email';
import { config } from '$lib/config';

const UPLOAD_DIR = `uploads/IOEA${config.currentYear}_call`;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const load: PageServerLoad = async ({ cookies }) => {
	// Clean up any old multi-step cookies (migration from old flow)
	try {
		cookies.delete('call_step1', { path: '/' });
		cookies.delete('call_step2', { path: '/' });
		cookies.delete('call_step1', { path: '/call' });
		cookies.delete('call_step2', { path: '/call' });
	} catch {
		// Ignore
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
	default: async ({ request }) => {
		const data = await request.formData();

		// Extract all form values
		const firstName = data.get('first_name')?.toString()?.trim() || '';
		const lastName = data.get('last_name')?.toString()?.trim() || '';
		const email = data.get('email')?.toString()?.trim()?.toLowerCase() || '';
		const nationalityStr = data.get('nationality')?.toString() || '';
		const gender = data.get('gender')?.toString() || '';
		const ageStr = data.get('age')?.toString() || '';
		const statusStr = data.get('status')?.toString() || '';
		const domain = data.get('domain')?.toString()?.trim() || '';
		const diploma = data.get('diploma')?.toString()?.trim() || '';

		const university = data.get('university')?.toString()?.trim() || '';
		const department = data.get('department')?.toString()?.trim() || '';
		const countryStr = data.get('country')?.toString() || '';
		const phdTitle = data.get('phd_title')?.toString()?.trim() || '';
		const phdAdName = data.get('phd_ad_name')?.toString()?.trim() || '';
		const phdAdMail = data.get('phd_ad_mail')?.toString()?.trim()?.toLowerCase() || '';
		const phdYearStr = data.get('phd_year')?.toString() || '';
		const phdSummary = data.get('phd_summary')?.toString()?.trim() || '';

		const cvFile = data.get('cv') as File;
		const paperFile = data.get('paper') as File;

		// Collect values for re-population on error
		const values = {
			first_name: firstName,
			last_name: lastName,
			email,
			nationality: nationalityStr,
			gender,
			age: ageStr,
			status: statusStr,
			domain,
			diploma,
			university,
			department,
			country: countryStr,
			phd_title: phdTitle,
			phd_ad_name: phdAdName,
			phd_ad_mail: phdAdMail,
			phd_year: phdYearStr,
			phd_summary: phdSummary
		};

		// === SECTION 1: Personal Information Validation ===
		if (!firstName || firstName.length < 2) {
			return fail(400, {
				error: 'First name is required and must be at least 2 characters long.',
				values
			});
		}

		if (!lastName || lastName.length < 2) {
			return fail(400, {
				error: 'Last name is required and must be at least 2 characters long.',
				values
			});
		}

		if (!email) {
			return fail(400, { error: 'Email address is required.', values });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Please enter a valid email address (e.g., name@example.com).',
				values
			});
		}

		if (!nationalityStr) {
			return fail(400, { error: 'Please select your nationality.', values });
		}

		const nationality = parseInt(nationalityStr, 10);
		if (isNaN(nationality) || nationality <= 0) {
			return fail(400, { error: 'Invalid nationality selection. Please try again.', values });
		}

		if (!gender || (gender !== 'F' && gender !== 'M')) {
			return fail(400, { error: 'Please select your gender.', values });
		}

		if (!ageStr) {
			return fail(400, { error: 'Age is required.', values });
		}

		const age = parseInt(ageStr, 10);
		if (isNaN(age) || age < 18 || age > 100) {
			return fail(400, {
				error: 'Please enter a valid age between 18 and 100.',
				values
			});
		}

		if (!statusStr) {
			return fail(400, { error: 'Please select your current status.', values });
		}

		const status = parseInt(statusStr, 10);
		if (isNaN(status) || status < 1 || status > 4) {
			return fail(400, { error: 'Invalid status selection. Please try again.', values });
		}

		if (!domain || domain.length < 3) {
			return fail(400, {
				error: 'Research domain is required and must be at least 3 characters long.',
				values
			});
		}

		if (!diploma || diploma.length < 3) {
			return fail(400, {
				error: 'Highest diploma is required and must be at least 3 characters long.',
				values
			});
		}

		// === SECTION 2: Affiliation Validation ===
		if (!university || university.length < 2) {
			return fail(400, {
				error: 'University/Institution is required.',
				values
			});
		}

		if (!department || department.length < 2) {
			return fail(400, {
				error: 'Department is required.',
				values
			});
		}

		if (!countryStr) {
			return fail(400, { error: 'Please select your institution country.', values });
		}

		const country = parseInt(countryStr, 10);
		if (isNaN(country) || country <= 0) {
			return fail(400, { error: 'Invalid country selection. Please try again.', values });
		}

		if (!phdTitle || phdTitle.length < 3) {
			return fail(400, {
				error: 'Project/PhD title is required.',
				values
			});
		}

		if (!phdSummary || phdSummary.length < 50) {
			return fail(400, {
				error: 'Research summary is required and must be at least 50 characters.',
				values
			});
		}

		// PhD-specific validation (status 1 = PhD student)
		const isPhDStudent = status === 1;
		if (isPhDStudent) {
			if (!phdAdName) {
				return fail(400, {
					error: 'PhD students must provide their supervisor name.',
					values
				});
			}
			if (!phdAdMail || !emailRegex.test(phdAdMail)) {
				return fail(400, {
					error: 'PhD students must provide a valid supervisor email.',
					values
				});
			}
			if (!phdYearStr) {
				return fail(400, {
					error: 'PhD students must provide expected year of completion.',
					values
				});
			}
		}

		const phdYear = phdYearStr ? parseInt(phdYearStr, 10) : null;

		// === SECTION 3: File Validation ===
		if (!cvFile || cvFile.size === 0) {
			return fail(400, { error: 'Please upload your CV.', values });
		}

		if (!paperFile || paperFile.size === 0) {
			return fail(400, { error: 'Please upload your research paper.', values });
		}

		if (cvFile.size > MAX_FILE_SIZE) {
			return fail(400, { error: 'CV file size must be less than 5MB.', values });
		}

		if (paperFile.size > MAX_FILE_SIZE) {
			return fail(400, { error: 'Research paper file size must be less than 5MB.', values });
		}

		if (!cvFile.name.toLowerCase().endsWith('.pdf')) {
			return fail(400, { error: 'CV must be a PDF file.', values });
		}

		if (!paperFile.name.toLowerCase().endsWith('.pdf')) {
			return fail(400, { error: 'Research paper must be a PDF file.', values });
		}

		// === Check for duplicate submission ===
		const currentYear = new Date().getFullYear();
		const existing = await prisma.call_submissions.findFirst({
			where: {
				email,
				call_year: currentYear
			}
		});

		if (existing) {
			return fail(400, {
				error: `An application with this email address already exists for ${currentYear}. If you need to update your application, please contact us.`,
				values
			});
		}

		// === Save files and create database entry ===
		try {
			await mkdir(UPLOAD_DIR, { recursive: true });

			const timestamp = Date.now();
			const sanitizedName = `${lastName}_${firstName}`.replace(/[^a-zA-Z0-9]/g, '_');
			const cvFilename = `${sanitizedName}_CV_${timestamp}.pdf`;
			const paperFilename = `${sanitizedName}_PAPER_${timestamp}.pdf`;

			const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
			const paperBuffer = Buffer.from(await paperFile.arrayBuffer());

			await writeFile(join(UPLOAD_DIR, cvFilename), cvBuffer);
			await writeFile(join(UPLOAD_DIR, paperFilename), paperBuffer);

			await prisma.call_submissions.create({
				data: {
					call_year: currentYear,
					first_name: firstName,
					last_name: lastName,
					email,
					nationality,
					gender,
					age,
					status,
					domain,
					diploma,
					university,
					department,
					country,
					title: phdTitle,
					phd_ad_name: isPhDStudent ? phdAdName : null,
					phd_ad_mail: isPhDStudent ? phdAdMail : null,
					phd_year: isPhDStudent ? phdYear : null,
					summary: phdSummary,
					cv: cvFilename,
					paper: paperFilename,
					created_at: new Date(),
					updated_at: new Date()
				}
			});

			// Send confirmation email
			try {
				await sendEmail(
					await applicationReceiptEmail({
						firstName,
						lastName,
						email
					})
				);
			} catch (emailError) {
				console.error('Email sending error (non-fatal):', emailError);
			}
		} catch (error) {
			console.error('Application submission error:', error);
			return fail(500, {
				error: 'An error occurred while submitting your application. Please try again.',
				values
			});
		}

		redirect(303, '/call/success');
	}
};
