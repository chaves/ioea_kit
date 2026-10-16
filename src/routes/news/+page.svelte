<script lang="ts">
	import { page } from '$app/state';
	import PageHeader from '#lib/components/PageHeader.svelte';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import SEO from '#lib/components/SEO.svelte';
	import NewsCard from '#lib/components/NewsCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// The first card with an image is the page's LCP element: load it eagerly.
	const firstImage = $derived(data.articles.findIndex((a) => a.image));
</script>

<SEO
	title={data.page > 1 ? `News - page ${data.page}` : 'News'}
	canonical={data.page > 1 ? `${page.url.origin}/news?page=${data.page}` : undefined}
	description="News and announcements from the Institutional and Organizational Economics Academy (IOEA): sessions, calls for applications, faculty and alumni."
/>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="IOEA News" href="/rss.xml" />
</svelte:head>

<PageHeader title="News" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				{#if data.articles.length === 0}
					<p class="text-text-light text-center py-12">No news yet.</p>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each data.articles as article, i (article.slug)}
							<NewsCard {article} eager={i === firstImage} />
						{/each}
					</div>

					{#if data.totalPages > 1}
						<nav class="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
							{#if data.page > 1}
								<a href={data.page === 2 ? '/news' : `/news?page=${data.page - 1}`} class="pagination-btn">← Previous</a>
							{/if}
							<span class="px-4 py-2 text-sm text-text-light">Page {data.page} of {data.totalPages}</span>
							{#if data.page < data.totalPages}
								<a href="/news?page={data.page + 1}" class="pagination-btn">Next →</a>
							{/if}
						</nav>
					{/if}
				{/if}
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

<style>
	.pagination-btn {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 0.375rem;
		border: 1px solid var(--color-border);
		background: white;
		color: var(--color-text-light);
	}

	.pagination-btn:hover {
		background: var(--color-bg-alt);
		color: var(--color-primary);
	}
</style>
