import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	const year = parseInt(params.year);

	// Get all themes for this year that are workshops
	const themes = await prisma.$queryRaw<
		Array<{
			id: number;
			theme: string;
			date_formated: string;
			titres: string | null;
			presentation_ids: string | null;
			prenoms: string | null;
			noms: string | null;
			instits: string | null;
			homes: string | null;
			photos: string | null;
		}>
	>`
		SELECT
			e_themes.id,
			theme,
			DATE_FORMAT(e_themes.date_new, '%W, %D %M %Y') AS date_formated,
			GROUP_CONCAT(e_presentation.titre ORDER BY e_presentation.rang ASC SEPARATOR '|') AS titres,
			GROUP_CONCAT(e_presentation.id ORDER BY e_presentation.rang ASC SEPARATOR '|') AS presentation_ids,
			GROUP_CONCAT(e_auteurs.prenom ORDER BY e_presentation.rang ASC SEPARATOR '|') AS prenoms,
			GROUP_CONCAT(e_auteurs.nom ORDER BY e_presentation.rang ASC SEPARATOR '|') AS noms,
			GROUP_CONCAT(e_auteurs.instit ORDER BY e_presentation.rang ASC SEPARATOR '|') AS instits,
			GROUP_CONCAT(e_auteurs.home ORDER BY e_presentation.rang ASC SEPARATOR '|') AS homes,
			GROUP_CONCAT(e_auteurs.photo ORDER BY e_presentation.rang ASC SEPARATOR '|') AS photos
		FROM e_themes
		LEFT JOIN e_presentation ON e_themes.id = e_presentation.id_themes
		LEFT JOIN e_auteurs ON e_auteurs.id = e_presentation.id_auteur
		WHERE YEAR(e_themes.date_new) = ${year} AND lecwp = 'workshops'
		GROUP BY e_themes.id
		ORDER BY e_themes.date_new ASC, theme ASC
	`;

	// Parse themes into grouped workshops (by date/theme)
	const themeGroups = themes.map((t) => {
		const titres = t.titres?.split('|') ?? [];
		const ids = t.presentation_ids?.split('|') ?? [];
		const prenoms = t.prenoms?.split('|') ?? [];
		const noms = t.noms?.split('|') ?? [];
		const instits = t.instits?.split('|') ?? [];
		const homes = t.homes?.split('|') ?? [];
		const photos = t.photos?.split('|') ?? [];

		const workshops = titres.map((titre, i) => ({
			id: parseInt(ids[i]) || 0,
			title: titre || null,
			abstract: null,
			link: null,
			author: {
				firstName: prenoms[i] ?? '',
				lastName: noms[i] ?? '',
				institution: instits[i] ?? null,
				website: homes[i] && homes[i].trim() !== '' ? homes[i] : null,
				photo: photos[i] && photos[i].trim() !== '' ? photos[i] : null
			}
		}));

		return {
			id: t.id,
			name: t.theme,
			dateFormatted: t.date_formated,
			workshops
		};
	});

	return {
		year,
		themeGroups
	};
};

