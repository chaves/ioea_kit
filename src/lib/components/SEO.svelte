<script lang="ts">
	import { page } from '$app/state';
	import { config } from '#lib/config.js';

	interface Props {
		title?: string;
		description?: string;
		canonical?: string;
		ogType?: 'website' | 'article' | 'event';
		ogImage?: string;
		ogImageAlt?: string;
		jsonLd?: any;
		noindex?: boolean;
	}

	let {
		title,
		description,
		canonical,
		ogType = 'website',
		ogImage = '/site-logo.png',
		ogImageAlt = 'Institutional and Organizational Economics Academy Logo',
		jsonLd,
		noindex = false
	}: Props = $props();

	const siteName = 'Institutional and Organizational Economics Academy (IOEA)';
	const defaultDescription = 'The Institutional and Organizational Economics Academy (IOEA) is dedicated to the analysis of institutions, organizations and contracts.';

	// Short suffix keeps titles under ~60 chars in search results; skip it when the title already names IOEA
	const fullTitle = $derived(!title ? siteName : title.includes('IOEA') ? title : `${title} | IOEA`);
	const metaDescription = $derived(description || defaultDescription);
	// Query strings (filters, tracking) must not create duplicate canonical URLs
	const url = $derived(canonical || `${page.url.origin}${page.url.pathname}`);

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
	<meta name="description" content={metaDescription} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{:else}
		<link rel="canonical" href={url} />
	{/if}

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:image" content={absoluteOgImage} />
	<meta property="og:image:alt" content={ogImageAlt} />
	<meta property="og:site_name" content={siteName} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={absoluteOgImage} />

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(finalJsonLd)}<\/script>`}
</svelte:head>
