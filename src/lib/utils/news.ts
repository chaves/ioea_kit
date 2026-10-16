// Text helpers for the news pages, admin and feeds

export function formatDate(date: Date | string | null | undefined): string {
	if (!date) return '';
	const d = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Accents are folded first so "Cargèse" gives "cargese" rather than "cargse"
export function slugify(text: string): string {
	return text
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** Plain-text summary of HTML (meta description, RSS), cut on a word boundary. */
export function toSummary(html: string | null | undefined, max = 160): string {
	if (!html) return '';
	const text = html
		.replace(/<[^>]*>/g, ' ')
		.replace(/&(#\d+|[a-z]+);/gi, (m, e: string) =>
			e.startsWith('#') ? String.fromCharCode(Number(e.slice(1))) : (ENTITIES[e.toLowerCase()] ?? m)
		)
		.replace(/\s+/g, ' ')
		.trim();
	return text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}
