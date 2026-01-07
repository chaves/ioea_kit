import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { staticConfig } from '$lib/config';
import { loadDynamicConfig } from '$lib/server/config';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	const year = parseInt(params.year);
	const isCurrent = year === staticConfig.currentYear;

	// Load dynamic config for the page
	const dynamicConfig = await loadDynamicConfig();

	// For archive years, redirect to lectures page
	if (!isCurrent) {
		throw redirect(302, `/${year}/lectures`);
	}

	// Get lecturers (lectures) for this year
	const lecturers = await prisma.$queryRaw<
		Array<{
			id: number;
			prenom: string | null;
			nom: string | null;
			instit: string | null;
		}>
	>`
		SELECT DISTINCT
			e_presentation.id,
			e_auteurs.prenom,
			e_auteurs.nom,
			e_auteurs.instit
		FROM e_presentation
		LEFT JOIN e_themes ON e_presentation.id_themes = e_themes.id
		LEFT JOIN e_auteurs ON e_presentation.id_auteur = e_auteurs.id
		WHERE YEAR(e_themes.date_new) = ${year} AND e_themes.lecwp = 'lectures'
		ORDER BY e_auteurs.nom ASC
	`;

	// Get workshop organizers for this year
	const workshopOrganizers = await prisma.$queryRaw<
		Array<{
			id: number;
			prenom: string | null;
			nom: string | null;
			instit: string | null;
		}>
	>`
		SELECT DISTINCT
			e_presentation.id,
			e_auteurs.prenom,
			e_auteurs.nom,
			e_auteurs.instit
		FROM e_presentation
		LEFT JOIN e_themes ON e_presentation.id_themes = e_themes.id
		LEFT JOIN e_auteurs ON e_presentation.id_auteur = e_auteurs.id
		WHERE YEAR(e_themes.date_new) = ${year} AND e_themes.lecwp = 'workshops'
		ORDER BY e_auteurs.nom ASC
	`;

	return {
		year,
		isCurrent,
		dynamicConfig,
		lecturers: lecturers.map((l) => ({
			id: l.id,
			firstName: l.prenom ?? '',
			lastName: l.nom ?? '',
			institution: l.instit ?? ''
		})),
		workshopOrganizers: workshopOrganizers.map((w) => ({
			id: w.id,
			firstName: w.prenom ?? '',
			lastName: w.nom ?? '',
			institution: w.instit ?? ''
		}))
	};
};

