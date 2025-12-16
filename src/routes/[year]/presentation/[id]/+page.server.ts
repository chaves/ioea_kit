import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";

export const load: PageServerLoad = async ({ params }) => {
  const year = parseInt(params.year);
  const presentationId = parseInt(params.id);

  if (isNaN(presentationId)) {
    throw error(404, "Presentation not found");
  }

  // Get presentation details
  const presentation = await prisma.$queryRaw<
    Array<{
      id: number;
      titre: string | null;
      resume: string | null;
      lien: string | null;
      lecwp: string | null;
      date_new: Date | null;
      theme: string | null;
      prenom: string | null;
      nom: string | null;
      instit: string | null;
      home: string | null;
      photo: string | null;
    }>
  >`
		SELECT
			e_presentation.id,
			e_presentation.titre,
			e_presentation.resume,
			e_presentation.lien,
			e_themes.lecwp,
			e_themes.date_new,
			e_themes.theme,
			e_auteurs.prenom,
			e_auteurs.nom,
			e_auteurs.instit,
			e_auteurs.home,
			e_auteurs.photo
		FROM e_presentation
		LEFT JOIN e_themes ON e_presentation.id_themes = e_themes.id
		LEFT JOIN e_auteurs ON e_presentation.id_auteur = e_auteurs.id
		WHERE e_presentation.id = ${presentationId}
		LIMIT 1
	`;

  if (!presentation || presentation.length === 0) {
    throw error(404, "Presentation not found");
  }

  const p = presentation[0];

  // Verify it's for the correct year
  if (p.date_new && new Date(p.date_new).getFullYear() !== year) {
    throw error(404, "Presentation not found for this year");
  }

  // Convert link to local path if it's a filename
  let presentationLink: string | null = p.lien;
  if (p.lien && !p.lien.startsWith("http") && !p.lien.startsWith("/")) {
    // It's just a filename, construct the full path
    // Assume it's in pdf/textes_{year}/ directory
    presentationLink = `/pdf/textes_${year}/${p.lien}`;
  } else if (
    p.lien &&
    !p.lien.startsWith("http") &&
    !p.lien.startsWith("/pdf/")
  ) {
    // It's a relative path, ensure it starts with /pdf/
    presentationLink = `/pdf/${p.lien}`;
  }

  // File size calculation removed since files are now external
  let fileSize: string | null = null;

  return {
    year,
    presentation: {
      id: p.id,
      title: p.titre,
      abstract: p.resume,
      link: presentationLink,
      fileSize,
      type: p.lecwp,
      date: p.date_new,
      theme: p.theme,
      author: {
        firstName: p.prenom ?? "",
        lastName: p.nom ?? "",
        institution: p.instit,
        website: p.home,
        photo: p.photo,
      },
    },
  };
};
