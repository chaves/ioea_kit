import { config, getArchiveYears, getPhotoYears } from "#lib/config.js";
import { prisma } from "#lib/server/db.js";

// Only list URLs that answer 200: redirects and 404s waste crawl budget
export async function GET({ url }) {
  const domain = url.origin;

  const staticPages = [
    "",
    "news",
    "project",
    "project/organization",
    "project/research",
    "community",
    "community/testimonials",
    "community/faculty",
    "community/organizers",
    "community/audience",
    "community/alumni",
    "community/awards",
    "community/join",
    "community/photos",
    "community/photos/lecturers",
    "archives",
    "videos",
    "sponsors",
    // /call redirects to the current year while the call is closed
    ...(config.callIsOpen ? ["call"] : []),
  ];

  // The current year has its full set of pages; past years only keep
  // lectures and workshops (/YEAR itself redirects to /YEAR/lectures)
  const currentYearPages = [
    "",
    "lectures",
    "workshops",
    "seminars",
    "lunch-sessions",
    "meetings",
    "informations",
    "students",
  ];
  const archiveYears = getArchiveYears().filter((year) => year !== config.currentYear);

  const presentations = await prisma.$queryRaw<Array<{ id: number; year: number }>>`
		SELECT e_presentation.id, YEAR(e_themes.date_new) AS year
		FROM e_presentation
		JOIN e_themes ON e_presentation.id_themes = e_themes.id
		WHERE e_themes.lecwp IN ('lectures', 'workshops') AND e_themes.date_new IS NOT NULL
		ORDER BY year DESC, e_presentation.id ASC
	`;

  const news = await prisma.news_article.findMany({
    where: { published: true },
    select: { slug: true },
    orderBy: { publishedAt: "desc" },
  });

  const allPages = [
    ...staticPages.map((page) => `${domain}/${page}`),
    ...currentYearPages.map((page) => `${domain}/${config.currentYear}${page ? `/${page}` : ""}`),
    ...archiveYears.flatMap((year) => [`${domain}/${year}/lectures`, `${domain}/${year}/workshops`]),
    ...news.map((a) => `${domain}/news/${a.slug}`),
    ...getPhotoYears().map((year) => `${domain}/photos/${year}`),
    // Cancelled sessions (badSessions) answer 404, even if they have presentations
    ...presentations
      .filter((p) => !config.badSessions.includes(Number(p.year)))
      .map((p) => `${domain}/${Number(p.year)}/presentation/${p.id}`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page === `${domain}/` ? "1.0" : "0.8"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}
