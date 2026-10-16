<script lang="ts">
	import { formatDate } from '#lib/utils/news.js';
	import { clampPercent, normalizeImageFit } from '#lib/utils/newsImage.js';
	import { toThumbUrl, toWebpUrl } from '#lib/utils/webp.js';

	interface Props {
		article: {
			slug: string;
			title: string;
			excerpt?: string | null;
			image?: string | null;
			imageFit?: string | null;
			imageFocusX?: number | null;
			imageFocusY?: number | null;
			publishedAt?: Date | null;
			author?: string | null;
		};
		/** h2 under a page's h1 (/news); h3 under a section's h2 (homepage). */
		headingLevel?: 'h2' | 'h3';
		/** First card above the fold: its image is the LCP, so don't lazy-load it. */
		eager?: boolean;
		/** Horizontal card (image beside the text from md up), for a lone article on the homepage. */
		featured?: boolean;
	}

	let { article, headingLevel = 'h2', eager = false, featured = false }: Props = $props();

	const hasImage = $derived(Boolean(article.image));
	const fitMode = $derived(normalizeImageFit(article.imageFit));
	const focusX = $derived(clampPercent(article.imageFocusX, 50));
	const focusY = $derived(clampPercent(article.imageFocusY, 28));
	const imagePosition = $derived(`object-position: ${focusX}% ${focusY}%`);
	// Cards are at most ~400px wide (full width on phones): offer the 800px
	// thumbnail next to the 1200px original instead of always sending the latter.
	const thumb = $derived(toThumbUrl(article.image));
	const webpSrcset = $derived(
		thumb ? `${thumb} 800w, ${toWebpUrl(article.image)} 1200w` : toWebpUrl(article.image)
	);
	const sizes = $derived(featured ? '(min-width: 768px) 560px, 100vw' : '(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw');
</script>

<article class="group flex flex-col {featured ? 'md:flex-row' : ''} h-full overflow-hidden bg-white rounded-xl border border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
	{#if hasImage}
		<!-- A mouse shortcut only: the title and "Read more" already link to the
		     article, so the image is kept out of the tab order and screen readers. -->
		<a href="/news/{article.slug}" class="block overflow-hidden flex-shrink-0 {featured ? 'md:w-1/2' : ''}" tabindex="-1" aria-hidden="true">
			<!-- Featured: the social-image ratio (1.91:1), so the whole picture shows -->
			<div class="relative w-full {featured ? 'aspect-[1.91/1] md:h-full' : 'aspect-[3/1]'} overflow-hidden bg-bg-alt">
				{#if fitMode === 'contain'}
					<picture>
						<source srcset={webpSrcset} {sizes} type="image/webp" />
						<img
							src={article.image ?? ''}
							alt=""
							aria-hidden="true"
							loading="lazy"
							decoding="async"
							class="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45"
							style={imagePosition}
						/>
					</picture>
					<div class="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" aria-hidden="true"></div>
					<picture>
						<source srcset={webpSrcset} {sizes} type="image/webp" />
						<img
							src={article.image ?? ''}
							alt=""
							loading={eager ? 'eager' : 'lazy'}
							fetchpriority={eager ? 'high' : 'auto'}
							decoding="async"
							class="relative z-10 w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
							style={imagePosition}
						/>
					</picture>
				{:else}
					<picture>
						<source srcset={webpSrcset} {sizes} type="image/webp" />
						<img
							src={article.image ?? ''}
							alt=""
							loading={eager ? 'eager' : 'lazy'}
							fetchpriority={eager ? 'high' : 'auto'}
							decoding="async"
							class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
							style={imagePosition}
						/>
					</picture>
				{/if}
			</div>
		</a>
	{/if}

	<div class="{featured ? 'p-6 md:p-8 md:justify-center' : 'p-6'} flex flex-col flex-1">
		<div class="flex items-center gap-2 text-xs text-text-muted mb-3">
			<time datetime={article.publishedAt?.toISOString()}>{formatDate(article.publishedAt)}</time>
			{#if article.author}
				<span>·</span>
				<span>{article.author}</span>
			{/if}
		</div>

		<svelte:element this={headingLevel} class="{featured ? 'text-xl md:text-2xl mb-3' : 'text-lg mb-2'} leading-tight">
			<a href="/news/{article.slug}" class="text-primary-dark hover:text-secondary">{article.title}</a>
		</svelte:element>

		{#if article.excerpt}
			<p class="text-text-light {featured ? 'text-base' : 'text-sm'} leading-relaxed mb-4">{article.excerpt}</p>
		{/if}

		<a href="/news/{article.slug}" class="{featured ? 'md:mt-2' : ''} mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary">
			Read more<span class="sr-only"> about {article.title}</span>
			<span aria-hidden="true">→</span>
		</a>
	</div>
</article>
