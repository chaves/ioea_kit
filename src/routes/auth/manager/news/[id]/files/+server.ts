import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { hasRole } from '#lib/server/auth.js';
import { prisma } from '#lib/server/db.js';
import { saveNewsFile, deleteNewsFile } from '#lib/server/newsFiles.js';

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export const POST: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) throw error(403, 'Forbidden');

	const id = parseInt(params.id);
	if (isNaN(id)) throw error(400, 'Invalid id');

	const article = await prisma.news_article.findUnique({ where: { id }, select: { slug: true } });
	if (!article) throw error(404, 'Article not found');

	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const label = String(formData.get('label') ?? '').trim() || null;
	if (!file || !file.size) throw error(400, 'No file provided');
	if (file.size > MAX_SIZE) throw error(400, 'File too large (max 20 MB)');

	const buffer = Buffer.from(await file.arrayBuffer());
	// Check the content, not just the name: only real PDFs are published
	if (!file.name.toLowerCase().endsWith('.pdf') || buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
		throw error(400, 'Only PDF files are allowed');
	}

	// Safe filename: slug_originalname.pdf, made unique so an upload never overwrites another
	const safeName = file.name
		.replace(/[^a-zA-Z0-9._-]/g, '_')
		.replace(/_+/g, '_')
		.toLowerCase();
	let filename = `${article.slug}_${safeName}`;
	if (await prisma.news_file.findFirst({ where: { filename } })) {
		filename = `${article.slug}_${Date.now()}_${safeName}`;
	}

	await saveNewsFile(filename, buffer);

	const record = await prisma.news_file.create({
		data: { articleId: id, filename, label, size: file.size }
	});

	return Response.json(record);
};

export const DELETE: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) throw error(403, 'Forbidden');

	const id = parseInt(params.id);
	if (isNaN(id)) throw error(400, 'Invalid id');

	const formData = await request.formData();
	const fileId = parseInt(String(formData.get('fileId')));
	if (isNaN(fileId)) throw error(400, 'Invalid file id');

	const file = await prisma.news_file.findFirst({ where: { id: fileId, articleId: id } });
	if (!file) throw error(404, 'File not found');

	await prisma.news_file.delete({ where: { id: fileId } });
	await deleteNewsFile(file.filename);

	return Response.json({ success: true });
};
