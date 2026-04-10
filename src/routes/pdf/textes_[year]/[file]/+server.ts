import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// 301 redirect: /pdf/textes_{year}/{file} → /slides/{year}/{file}
// Preserves Google-indexed URLs after migrating legacy static files to managed uploads.
export const GET: RequestHandler = async ({ params }) => {
	const { year, file } = params;
	throw redirect(301, `/slides/${year}/${file}`);
};
