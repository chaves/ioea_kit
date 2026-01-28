<script lang="ts">
	import { page } from '$app/state';
	import { config } from '$lib/config';

	interface Props {
		title?: string;
		description?: string;
		canonical?: string;
		ogType?: 'website' | 'article' | 'event';
		ogImage?: string;
		ogImageAlt?: string;
		jsonLd?: any;
	}

	let {
		title,
		description,
		canonical,
		ogType = 'website',
		ogImage = '/site-logo.png',
		ogImageAlt = 'Institutional and Organizational Economics Academy Logo',
		jsonLd
	}: Props = $props();

	const siteName = 'Institutional and Organizational Economics Academy (IOEA)';
	const defaultDescription = 'The Institutional and Organizational Economics Academy (IOEA) is dedicated to the analysis of institutions, organizations and contracts.';

	const fullTitle = $derived(title ? `${title} | ${siteName}` : siteName);
	const metaDescription = $derived(description || defaultDescription);
	const url = $derived(canonical || page.url.href);

	// Ensure absolute URL for social images
	const absoluteOgImage = $derived(ogImage.startsWith('http') ? ogImage : `${page.url.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`);

	// Default JSON-LD for Organization
	const defaultJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'EducationalOrganization',
		'name': siteName,
		'url': page.url.origin,
		'logo': `${page.url.origin}/site-logo.png`,
		'description': defaultDescription,
		'address': {
			'@type': 'PostalAddress',
			'addressLocality': 'Paris',
			'addressCountry': 'FR'
		}
	};

	const finalJsonLd = $derived(jsonLd || defaultJsonLd);
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href={url} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:image" content={absoluteOgImage} />
	<meta property="og:image:alt" content={ogImageAlt} />
	<meta property="og:site_name" content={siteName} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={fullTitle} />
	<meta property="twitter:description" content={metaDescription} />
	<meta property="twitter:image" content={absoluteOgImage} />

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(finalJsonLd)}<\/script>`}
</svelte:head>
