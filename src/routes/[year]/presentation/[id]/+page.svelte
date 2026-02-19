<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { page } from '$app/stores';
	import { pdfUrl } from '$lib/utils/files';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const typeLabel = $derived(data.presentation.type === 'lectures' ? 'Lecture' : 'Workshop');
	const backUrl = $derived(`/${data.year}/${data.presentation.type}`);

	// Get file extension from link to determine icon type
	function getFileExtension(link: string | null): 'pdf' | 'pptx' | null {
		if (!link) return null;
		const lowerLink = link.toLowerCase();
		if (lowerLink.endsWith('.pdf')) return 'pdf';
		if (lowerLink.endsWith('.pptx') || lowerLink.endsWith('.ppt')) return 'pptx';
		return null;
	}

	const fileExtension = $derived(getFileExtension(data.presentation.link));

	const abstractHtml = $derived(data.presentation.abstract ?? '');

	const seoTitle = $derived(data.presentation.title ? `${data.presentation.title} - ${data.presentation.author.firstName} ${data.presentation.author.lastName}` : `${typeLabel} - IOEA ${data.year}`);
	const seoDescription = $derived(data.presentation.abstract ? data.presentation.abstract.replace(/<[^>]*>/g, '').substring(0, 160) : `${typeLabel} by ${data.presentation.author.firstName} ${data.presentation.author.lastName} at IOEA ${data.year}`);
</script>

<SEO
	title={seoTitle}
	description={seoDescription}
	ogType="article"
	ogImage={data.presentation.author.photo ? `/images/lec/${data.presentation.author.photo}` : '/site-logo.png'}
/>

<PageHeader title="{typeLabel} - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<div class="mb-6">
					<a href={backUrl} class="inline-flex gap-2 items-center font-medium no-underline transition-colors duration-200 text-primary hover:text-secondary">
						← Back to {data.presentation.type === 'lectures' ? 'Lectures' : 'Workshops'}
					</a>
				</div>

				<article class="bg-white rounded-xl border border-border p-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-6">
					<header class="flex flex-wrap gap-4 pb-6 mb-8 border-b border-border">
						{#if data.presentation.theme}
							<div class="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br rounded-lg from-primary to-primary-dark">
								{data.presentation.theme}
							</div>
						{/if}
						{#if data.presentation.date}
							<div class="px-4 py-2 text-sm font-medium rounded-lg bg-bg-alt text-text">
								{new Date(data.presentation.date).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</div>
						{/if}
					</header>

					<div class="flex flex-col-reverse gap-6 justify-between items-start items-center pb-6 mb-8 text-center border-b border-border sm:flex-row sm:items-start sm:text-left">
						<div class="flex-1 w-full sm:w-auto">
							<h2 class="mb-2 text-2xl">
								{#if data.presentation.author.website}
									<a href={data.presentation.author.website} target="_blank" rel="noopener" class="no-underline text-primary hover:text-secondary">
										{data.presentation.author.firstName} {data.presentation.author.lastName}
									</a>
								{:else}
									{data.presentation.author.firstName} {data.presentation.author.lastName}
								{/if}
							</h2>
							{#if data.presentation.author.institution}
								<p class="m-0 text-base text-text-light">{data.presentation.author.institution}</p>
							{/if}
						</div>
						{#if data.presentation.author.photo}
							<img
								src={`/images/lec/${data.presentation.author.photo}`}
								alt="{data.presentation.author.firstName} {data.presentation.author.lastName}"
								class="max-w-[200px] w-auto h-auto rounded-full object-cover border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex-shrink-0"
								onerror={(e) => {
									const img = e.currentTarget as HTMLImageElement;
									img.style.display = 'none';
								}}
							/>
						{/if}
					</div>

					{#if data.presentation.title}
						<h1 class="text-[1.75rem] text-primary mb-8 leading-snug sm:text-2xl">{data.presentation.title}</h1>
					{/if}

					{#if data.presentation.abstract}
						<div class="mb-8 abstract-markdown">
							<h3 class="mb-4 text-xl text-primary">Abstract</h3>
							<div class="abstract-content text-text leading-relaxed text-[1.05rem]">{@html abstractHtml}</div>
						</div>
					{/if}

					{#if data.presentation.link}
						<div class="pt-6 border-t border-border">
							<a href={data.presentation.link} target="_blank" rel="noopener" class="inline-flex items-center gap-3 text-primary font-medium text-base px-5 py-3 bg-bg-alt rounded-lg border border-border transition-all duration-200 no-underline hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
								{#if fileExtension === 'pdf'}
									<svg class="flex-shrink-0 w-6 h-6 text-[#dc2626] group-hover:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
										<polyline points="14 2 14 8 20 8"></polyline>
										<line x1="16" y1="13" x2="8" y2="13"></line>
										<line x1="16" y1="17" x2="8" y2="17"></line>
										<polyline points="10 9 9 9 8 9"></polyline>
									</svg>
									<span>Download the presentation{#if data.presentation.fileSize} - {data.presentation.fileSize}{/if}</span>
								{:else if fileExtension === 'pptx'}
									<svg class="flex-shrink-0 w-6 h-6 text-[#f59e0b] group-hover:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
										<polyline points="14 2 14 8 20 8"></polyline>
										<line x1="16" y1="13" x2="8" y2="13"></line>
										<line x1="16" y1="17" x2="8" y2="17"></line>
										<polyline points="10 9 9 9 8 9"></polyline>
									</svg>
									<span>Download the presentation{#if data.presentation.fileSize} - {data.presentation.fileSize}{/if}</span>
								{:else}
									<span>View Materials →</span>
								{/if}
							</a>
						</div>
					{/if}
				</article>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

<style>
	.abstract-content :global(p) {
		margin: 0 0 1em;
	}

	.abstract-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.abstract-content :global(ul),
	.abstract-content :global(ol) {
		margin: 0 0 1em;
		padding-left: 1.5em;
	}

	.abstract-content :global(li) {
		margin-bottom: 0.35em;
	}

	.abstract-content :global(strong) {
		font-weight: 600;
	}

	.abstract-content :global(em) {
		font-style: italic;
	}

	.abstract-content :global(code) {
		font-size: 0.9em;
		background: var(--color-bg-alt, #f3f1f5);
		padding: 0.15em 0.4em;
		border-radius: 0.25rem;
	}

	.abstract-content :global(pre) {
		overflow-x: auto;
		background: var(--color-bg-alt, #f3f1f5);
		padding: 1rem;
		border-radius: 0.375rem;
		margin: 0 0 1em;
	}

	.abstract-content :global(pre code) {
		background: none;
		padding: 0;
	}

	.abstract-content :global(a) {
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.abstract-content :global(a:hover) {
		color: var(--color-secondary);
	}

	.abstract-content :global(h1),
	.abstract-content :global(h2),
	.abstract-content :global(h3) {
		font-size: 1.1em;
		font-weight: 600;
		margin: 1em 0 0.5em;
		color: var(--color-text);
	}

	.abstract-content :global(blockquote) {
		border-left: 4px solid var(--color-primary);
		margin: 0 0 1em;
		padding-left: 1rem;
		color: var(--color-text-light);
	}
</style>
