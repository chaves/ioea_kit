import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';
import { hasAnyRole } from '$lib/server/auth';
import * as XLSX from 'xlsx';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin'])) {
		throw error(403, 'Access denied');
	}

	const submissions = await prisma.call_submissions.findMany({
		orderBy: { last_name: 'asc' }
	});

	const countries = await prisma.countries.findMany();
	const countryMap = new Map(countries.map((c) => [c.id, c.name]));

	const statusLabels: Record<number, string> = {
		1: 'PhD Student',
		2: 'Post-doc',
		3: 'Academic',
		4: 'Other'
	};

	function getSubmissionState(s: { accepted: boolean; waitlisted: boolean }): {
		processed: 'Yes' | 'No';
		decision: 'Accepted' | 'In waiting list' | 'Rejected' | 'Not processed';
	} {
		if (s.accepted && s.waitlisted) {
			return { processed: 'Yes', decision: 'Rejected' };
		}
		if (s.accepted) {
			return { processed: 'Yes', decision: 'Accepted' };
		}
		if (s.waitlisted) {
			return { processed: 'Yes', decision: 'In waiting list' };
		}
		return { processed: 'No', decision: 'Not processed' };
	}

	const data = submissions.map((s) => {
		const state = getSubmissionState(s);
		return {
			'Processed': state.processed,
			'Decision': state.decision,
			'Last Name': s.last_name,
			'First Name': s.first_name,
			'Email': s.email,
			'Gender': s.gender,
			'Age': s.age,
			'Status': statusLabels[s.status] ?? '',
			'Nationality': countryMap.get(s.nationality) ?? '',
			'University': s.university,
			'Department': s.department,
			'Country': countryMap.get(s.country) ?? '',
			'Domain': s.domain,
			'Diploma': s.diploma,
			'PhD Advisor': s.phd_ad_name ?? '',
			'PhD Advisor Email': s.phd_ad_mail ?? '',
			'Title': s.title,
			'Abstract': s.summary
		};
	});

	const wb = XLSX.utils.book_new();
	const ws = XLSX.utils.json_to_sheet(data);

	// Auto-size columns based on header length
	const colWidths = Object.keys(data[0] ?? {}).map((key) => ({
		wch: Math.max(key.length, 15)
	}));
	// Make Abstract column wider
	const abstractIdx = Object.keys(data[0] ?? {}).indexOf('Abstract');
	if (abstractIdx >= 0) colWidths[abstractIdx] = { wch: 60 };
	ws['!cols'] = colWidths;

	XLSX.utils.book_append_sheet(wb, ws, 'Submissions');

	const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

	return new Response(buf, {
		headers: {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': 'attachment; filename="ioea_submissions.xlsx"',
		},
	});
};
