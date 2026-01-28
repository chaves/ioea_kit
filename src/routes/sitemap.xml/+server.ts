import { config, getArchiveYears } from "$lib/config";

export async function GET({ url }) {
  const domain = url.origin;
  const years = [config.currentYear, ...getArchiveYears()];

  const staticPages = [
    "",
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
    "archives",
    "videos",
    "sponsors",
    "call",
  ];

  const yearPages = [
    "",
    "lectures",
    "workshops",
    "seminars",
    "lunch-sessions",
    "meetings",
    "informations",
    "students",
  ];

  const allPages = [
    ...staticPages.map((page) => `${domain}/${page}`),
    ...years.flatMap((year) =>
      yearPages.map((page) => `${domain}/${year}${page ? `/${page}` : ""}`),
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page === domain ? "1.0" : "0.8"}</priority>
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
