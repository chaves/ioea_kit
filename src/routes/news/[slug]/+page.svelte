<script lang="ts">
	import { page } from '$app/state';
	import PageHeader from '#lib/components/PageHeader.svelte';
	import SEO from '#lib/components/SEO.svelte';
	import NewsCard from '#lib/components/NewsCard.svelte';
	import { formatDate, toSummary } from '#lib/utils/news.js';
	import { toWebpUrl } from '#lib/utils/webp.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const articleUrl = $derived(`${page.url.origin}/news/${data.article.slug}`);
	const description = $derived(toSummary(data.article.excerpt || data.article.content));
	// LinkedIn's share dialog reads the title, excerpt and image from the
	// article's own Open Graph tags, so the URL is all it needs.
	const linkedinShareUrl = $derived(
		`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`
	);

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: data.article.title,
		description: description || undefined,
		datePublished: data.article.publishedAt?.toISOString(),
		dateModified: data.article.updatedAt?.toISOString(),
		author: data.article.author
			? { '@type': 'Person', name: data.article.author }
			: { '@type': 'Organization', name: 'IOEA', url: page.url.origin },
		publisher: {
			'@type': 'EducationalOrganization',
			name: 'Institutional and Organizational Economics Academy (IOEA)',
			url: page.url.origin,
			logo: { '@type': 'ImageObject', url: `${page.url.origin}/site-logo.png` }
		},
		mainEntityOfPage: articleUrl,
		image: data.article.image ? new URL(data.article.image, page.url.origin).toString() : undefined,
		url: articleUrl,
		inLanguage: 'en'
	});

	function formatFileSize(bytes: number): string {
		if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
</script>

<SEO
	title={data.article.title}
	{description}
	ogType="article"
	ogImage={data.article.image ?? '/site-logo.png'}
	ogImageAlt={data.article.title}
	{jsonLd}
/>

<PageHeader title={data.article.title} />

<article class="section-space bg-white">
	<div class="container max-w-4xl">
		<a href="/news" class="inline-flex items-center gap-2 text-sm font-medium mb-6">← Back to News</a>

		<div class="flex flex-wrap items-center gap-2 text-text-light mb-8">
			<time datetime={data.article.publishedAt?.toISOString()}>{formatDate(data.article.publishedAt)}</time>
			{#if data.article.author}<span>·</span><span>by {data.article.author}</span>{/if}
		</div>

		{#if data.article.image}
			<picture>
				<source srcset={toWebpUrl(data.article.image)} type="image/webp" />
				<img
					src={data.article.image}
					alt={data.article.title}
					width={data.imageSize?.width}
					height={data.imageSize?.height}
					fetchpriority="high"
					decoding="async"
					class="w-full h-auto rounded-lg mb-8"
				/>
			</picture>
		{/if}

		<div class="news-content">
			{@html data.article.content}
		</div>

		{#if data.article.files.length > 0}
			<div class="mt-10 border-t border-border pt-6">
				<h2 class="text-sm font-sans font-semibold text-text-light uppercase tracking-wide mb-3">Attached files</h2>
				<div class="space-y-2">
					{#each data.article.files as file (file.id)}
						<a
							href="/files/news/{file.filename}"
							target="_blank"
							rel="noopener"
							class="flex items-center gap-3 px-4 py-3 rounded-lg bg-bg-alt border border-border hover:border-primary transition-colors"
						>
							<svg class="w-5 h-5 text-[#dc2626] flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
								<polyline points="14 2 14 8 20 8"></polyline>
							</svg>
							<span class="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">{file.label || file.filename}</span>
							<span class="ml-auto text-xs text-text-muted flex-shrink-0">PDF · {formatFileSize(file.size)}</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		<div class="flex flex-wrap items-center gap-x-6 gap-y-3 mt-12 pt-6 border-t border-border">
			<a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" class="btn btn-secondary text-sm">
				Share on LinkedIn<span class="sr-only"> (opens in a new tab)</span>
			</a>
			<a href="/community/join" class="text-sm font-medium">Join the IOEA mailing list →</a>
		</div>
	</div>
</article>

{#if data.moreNews.length > 0}
	<section class="section-space bg-bg-alt" aria-labelledby="more-news">
		<div class="container max-w-4xl">
			<div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 mb-8">
				<h2 id="more-news" class="mb-0">More news</h2>
				<a href="/news" class="btn btn-primary text-sm">All news →</a>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each data.moreNews as article (article.slug)}
					<NewsCard {article} headingLevel="h3" />
				{/each}
			</div>
		</div>
	</section>
{/if}
