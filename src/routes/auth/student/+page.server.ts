import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { hasAnyRole } from '$lib/server/auth';
import { config } from '$lib/config';

function formatDateForInput(dt: Date | null): string {
	if (!dt || isNaN(dt.getTime()) || dt.getFullYear() < 100) return '';
	return dt.toISOString().slice(0, 10);
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
		throw redirect(302, '/auth/login');
	}

	const session = locals.session;
	const currentYear = config.currentYear;

	const submission = await prisma.call_submissions.findFirst({
		where: { email: session.email, call_year: currentYear, accepted: true, waitlisted: false },
		select: {
			first_name: true,
			last_name: true,
			email: true,
			university: true,
			title: true,
			summary: true,
		},
	});

	const travel = await prisma.students_travels.findFirst({
		where: { student_id: String(session.userId) },
	});

	return {
		year: currentYear,
		submission: submission
			? {
					firstName: submission.first_name,
					lastName: submission.last_name,
					email: submission.email,
					university: submission.university ?? '',
					title: submission.title ?? '',
					summary: submission.summary ?? '',
				}
			: null,
		travel: travel
			? {
					arrivalDate: formatDateForInput(travel.arrival_date_time),
					arrivalTransport: travel.arrival_transport,
					arrivalLocation: travel.arrival_location,
					arrivalFlight: travel.arrival_flight,
					arrivalTransfer: travel.arrival_transfer,
					departureDate: formatDateForInput(travel.departure_date_time),
					departureTransport: travel.departure_transport,
					departureLocation: travel.departure_location,
					departureFlight: travel.departure_flight,
					departureTransfer: travel.departure_transfer,
				}
			: null,
		transportOptions: config.travel.transport,
		locationOptions: config.travel.locations,
		arrivalTransferOptions: config.transfer.arrival,
		departureTransferOptions: config.transfer.departure,
	};
};

export const actions: Actions = {
	updatePaper: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.', action: 'updatePaper' });
		}

		const formData = await request.formData();
		const title = (formData.get('title') as string)?.trim() ?? '';
		const summary = (formData.get('summary') as string)?.trim() ?? '';

		const submission = await prisma.call_submissions.findFirst({
			where: {
				email: locals.session.email,
				call_year: config.currentYear,
				accepted: true,
				waitlisted: false,
			},
		});

		if (!submission) {
			return fail(404, { error: 'No accepted submission found for your account.', action: 'updatePaper' });
		}

		await prisma.call_submissions.update({
			where: { id: submission.id },
			data: { title, summary },
		});

		return { success: true, message: 'Paper information saved.', action: 'updatePaper' };
	},

	updateTravel: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.', action: 'updateTravel' });
		}

		const formData = await request.formData();

		const travelData = {
			arrival_date_time: formData.get('arrivalDate')
				? new Date(formData.get('arrivalDate') as string)
				: new Date(0),
			arrival_transport: (formData.get('arrivalTransport') as string) || '',
			arrival_location: (formData.get('arrivalLocation') as string) || '',
			arrival_flight: (formData.get('arrivalFlight') as string) || '',
			arrival_transfer: parseInt((formData.get('arrivalTransfer') as string) || '0') || 0,
			departure_date_time: formData.get('departureDate')
				? new Date(formData.get('departureDate') as string)
				: new Date(0),
			departure_transport: (formData.get('departureTransport') as string) || '',
			departure_location: (formData.get('departureLocation') as string) || '',
			departure_flight: (formData.get('departureFlight') as string) || '',
			departure_transfer: parseInt((formData.get('departureTransfer') as string) || '0') || 0,
		};

		try {
			const existing = await prisma.students_travels.findFirst({
				where: { student_id: String(locals.session.userId) },
			});

			if (existing) {
				await prisma.students_travels.update({
					where: { id: existing.id },
					data: travelData,
				});
			} else {
				await prisma.students_travels.create({
					data: { ...travelData, student_id: String(locals.session.userId) },
				});
			}

			return { success: true, message: 'Travel information saved.', action: 'updateTravel' };
		} catch (err) {
			console.error('Error saving travel:', err);
			return fail(500, { error: 'Failed to save travel information.', action: 'updateTravel' });
		}
	},
};
