import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { hasAnyRole } from '$lib/server/auth';
import { config } from '$lib/config';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

const PHOTOS_DIR = join('uploads', 'students', 'photos');
const MAX_PHOTO_SIZE = 8 * 1024 * 1024;

function slugify(email: string): string {
	return email.replace(/[@.]/g, '-').replace(/[^a-z0-9-]/gi, '');
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
		throw redirect(302, '/auth/login');
	}

	const session = locals.session;

	const studentRecord = await prisma.students.findFirst({
		where: { email: session.email },
		select: { id: true, first_name: true, last_name: true, university: true, photo: true },
	});

	const validation = await prisma.students_validations.findFirst({
		where: { student_email: session.email, call_year: config.currentYear, section: 'profile' },
	});

	return {
		year: config.currentYear,
		profile: {
			firstName: studentRecord?.first_name ?? session.name.split(' ')[0] ?? '',
			lastName: studentRecord?.last_name ?? session.name.split(' ').slice(1).join(' ') ?? '',
			email: session.email,
			university: studentRecord?.university ?? '',
			photo: studentRecord?.photo ?? null,
		},
		validated: !!validation,
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.' });
		}

		const formData = await request.formData();
		const firstName = (formData.get('firstName') as string)?.trim() ?? '';
		const lastName = (formData.get('lastName') as string)?.trim() ?? '';
		const university = (formData.get('university') as string)?.trim() ?? '';
		const photoFile = formData.get('photo') as File | null;

		if (!firstName || !lastName || !university) {
			return fail(400, { error: 'All fields are required.' });
		}

		const studentRecord = await prisma.students.findFirst({
			where: { email: locals.session.email },
		});

		if (!studentRecord) {
			return fail(404, { error: 'Student record not found. Please contact the coordinator.' });
		}

		const updateData: { first_name: string; last_name: string; university: string; photo?: string } = {
			first_name: firstName,
			last_name: lastName,
			university,
		};

		if (photoFile && photoFile.size > 0) {
			if (photoFile.size > MAX_PHOTO_SIZE) {
				return fail(400, { error: 'Photo must be less than 8 MB.' });
			}
			const type = photoFile.type;
			if (!['image/jpeg', 'image/png', 'image/webp'].includes(type)) {
				return fail(400, { error: 'Photo must be JPEG, PNG, or WebP.' });
			}

			await mkdir(PHOTOS_DIR, { recursive: true });
			const slug = slugify(locals.session.email);
			const filename = `${slug}.jpg`;
			const outputPath = join(PHOTOS_DIR, filename);
			const buffer = Buffer.from(await photoFile.arrayBuffer());
			const processed = await sharp(buffer)
				.resize(600, 600, { fit: 'inside', withoutEnlargement: true })
				.jpeg({ quality: 85 })
				.toBuffer();
			await writeFile(outputPath, processed);
			updateData.photo = filename;
		}

		await prisma.students.update({
			where: { id: studentRecord.id },
			data: updateData,
		});

		await prisma.users.update({
			where: { id: locals.session.userId },
			data: { name: `${firstName} ${lastName}` },
		});

		// Photo required to validate
		const photoNow = updateData.photo ?? studentRecord.photo;
		if (!photoNow) {
			return fail(400, { error: 'A photo is required. Please upload one before validating.' });
		}

		await prisma.students_validations.upsert({
			where: {
				student_email_call_year_section: {
					student_email: locals.session.email,
					call_year: config.currentYear,
					section: 'profile',
				},
			},
			create: { student_email: locals.session.email, call_year: config.currentYear, section: 'profile' },
			update: { validated_at: new Date() },
		});

		throw redirect(303, '/auth/student');
	},
};
