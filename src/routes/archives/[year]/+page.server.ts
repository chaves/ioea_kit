import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// Redirect from old /archives/{year} to new /{year}
	throw redirect(301, `/${params.year}`);
};
