import type { RequestHandler } from './$types';
import { prisma } from '#lib/server/db.js';
import { toSummary } from '#lib/utils/news.js';

// Hand-rolled like sitemap.xml: no feed dependency to keep in step.
const ITEM_COUNT = 50;

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

// "]]>" would close the CDATA section early
function escapeCdata(value: string): string {
	return value.replace(/]]>/g, ']]]]><![CDATA[>');
}

/** RFC-822 date. `toUTCString()` emits the RFC-1123 form, which RSS accepts. */
function toRfc822(value: Date | null | undefined): string | null {
	return value && !Number.isNaN(value.getTime()) ? value.toUTCString() : null;
}

export const GET: RequestHandler = async ({ url }) => {
	const site = url.origin;

	// Feed readers render items outside any page context, so root-relative URLs
	// in the article HTML would resolve against the reader, not the site.
	const absolutizeUrls = (html: string) =>
		html.replace(/(\b(?:href|src)=)(["'])\/(?!\/)([^"']*)\2/gi, (_m, attr: string, q: string, rest: string) => `${attr}${q}${site}/${rest}${q}`);

	let articles: Awaited<ReturnType<typeof prisma.news_article.findMany>> = [];
	try {
		articles = await prisma.news_article.findMany({
			where: { published: true },
			orderBy: { publishedAt: 'desc' },
			take: ITEM_COUNT
		});
	} catch (err) {
		// Degrade to an empty channel rather than a 500
		console.error('[rss] news unavailable:', err);
	}

	const items = articles.map((a) => {
		const link = `${site}/news/${a.slug}`;
		const parts = [
			`<title>${escapeXml(a.title)}</title>`,
			`<link>${escapeXml(link)}</link>`,
			`<guid isPermaLink="true">${escapeXml(link)}</guid>`,
			`<description>${escapeXml(toSummary(a.excerpt || a.content, 400))}</description>`,
			`<content:encoded><![CDATA[${escapeCdata(absolutizeUrls(a.content))}]]></content:encoded>`
		];
		const pubDate = toRfc822(a.publishedAt);
		if (pubDate) parts.push(`<pubDate>${pubDate}</pubDate>`);
		if (a.author?.trim()) parts.push(`<dc:creator>${escapeXml(a.author.trim())}</dc:creator>`);
		if (a.image) {
			// length is required by the spec but unknowable without reading the file; readers ignore it
			parts.push(`<enclosure url="${escapeXml(new URL(a.image, site).toString())}" type="image/jpeg" length="0" />`);
		}
		return `<item>${parts.join('')}</item>`;
	});

	const lastBuild = toRfc822(articles[0]?.updatedAt ?? null) ?? new Date().toUTCString();

	const body =
		`<?xml version="1.0" encoding="UTF-8"?>` +
		`<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"` +
		` xmlns:content="http://purl.org/rss/1.0/modules/content/"` +
		` xmlns:dc="http://purl.org/dc/elements/1.1/">` +
		`<channel>` +
		`<title>IOEA News</title>` +
		`<link>${site}/news</link>` +
		`<atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />` +
		`<description>News and announcements from the Institutional and Organizational Economics Academy (IOEA).</description>` +
		`<language>en</language>` +
		`<lastBuildDate>${lastBuild}</lastBuildDate>` +
		`<image><url>${site}/site-logo.png</url><title>IOEA News</title><link>${site}/news</link></image>` +
		items.join('') +
		`</channel></rss>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=1800'
		}
	});
};
