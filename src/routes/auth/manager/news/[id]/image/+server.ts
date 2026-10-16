import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { hasRole } from '#lib/server/auth.js';
import { prisma } from '#lib/server/db.js';
import { storeImageVariants, deleteImageVariants } from '#lib/server/imageStore.js';

const MAX_SIZE = 15 * 1024 * 1024; // 15 MB (the cropper already sends a resized JPEG)

export const POST: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) throw error(403, 'Forbidden');

	const id = parseInt(params.id);
	if (isNaN(id)) throw error(400, 'Invalid id');

	const article = await prisma.news_article.findUnique({
		where: { id },
		select: { slug: true, image: true }
	});
	if (!article) throw error(404, 'Article not found');

	const formData = await request.formData();
	const file = formData.get('image') as File | null;
	if (!file || !file.size) throw error(400, 'No image provided');
	if (file.size > MAX_SIZE) throw error(400, 'Image too large (max 15 MB)');

	const buffer = Buffer.from(await file.arrayBuffer());

	// Versioned basename: the URL changes on every upload so the immutable
	// /images/ cache (server.js) is bypassed and the new crop is actually served.
	// sharp rejects anything that is not a decodable image.
	const basename = `${article.slug}-${Date.now()}`;
	let imageUrl: string;
	try {
		imageUrl = await storeImageVariants('news', basename, buffer);
	} catch {
		throw error(400, 'Unreadable image');
	}

	await prisma.news_article.update({ where: { id }, data: { image: imageUrl } });

	// Drop the previous image's files now that the new one is persisted.
	if (article.image && article.image !== imageUrl) {
		await deleteImageVariants(article.image);
	}

	return Response.json({ image: imageUrl });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) throw error(403, 'Forbidden');

	const id = parseInt(params.id);
	if (isNaN(id)) throw error(400, 'Invalid id');

	const article = await prisma.news_article.findUnique({ where: { id }, select: { image: true } });
	if (!article) throw error(404, 'Article not found');

	await prisma.news_article.update({ where: { id }, data: { image: null } });
	await deleteImageVariants(article.image);

	return Response.json({ success: true });
};
