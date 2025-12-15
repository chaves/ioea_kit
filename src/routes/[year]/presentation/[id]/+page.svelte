<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { page } from '$app/stores';
	import { pdfUrl } from '$lib/utils/files';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const typeLabel = data.presentation.type === 'lectures' ? 'Lecture' : 'Workshop';
	const backUrl = `/${data.year}/${data.presentation.type}`;

	// Get file extension from link to determine icon type
	function getFileExtension(link: string | null): 'pdf' | 'pptx' | null {
		if (!link) return null;
		const lowerLink = link.toLowerCase();
		if (lowerLink.endsWith('.pdf')) return 'pdf';
		if (lowerLink.endsWith('.pptx') || lowerLink.endsWith('.ppt')) return 'pptx';
		return null;
	}

	const fileExtension = $derived(getFileExtension(data.presentation.link));
</script>

<svelte:head>
	<title>{data.presentation.title || `${typeLabel} - IOEA ${data.year}`}</title>
	<meta name="description" content="{data.presentation.abstract || `${typeLabel} by ${data.presentation.author.firstName} ${data.presentation.author.lastName} at IOEA ${data.year}`}" />
</svelte:head>

<PageHeader title="{typeLabel} - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<div class="back-link">
					<a href={backUrl}>← Back to {data.presentation.type === 'lectures' ? 'Lectures' : 'Workshops'}</a>
				</div>

				<article class="presentation-detail">
					<header class="presentation-header">
						{#if data.presentation.theme}
							<div class="theme-badge">{data.presentation.theme}</div>
						{/if}
						{#if data.presentation.date}
							<div class="date-badge">
								{new Date(data.presentation.date).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</div>
						{/if}
					</header>

					<div class="author-section">
						<div class="author-info">
							<h2>
								{#if data.presentation.author.website}
									<a href={data.presentation.author.website} target="_blank" rel="noopener">
										{data.presentation.author.firstName} {data.presentation.author.lastName}
									</a>
								{:else}
									{data.presentation.author.firstName} {data.presentation.author.lastName}
								{/if}
							</h2>
							{#if data.presentation.author.institution}
								<p class="institution">{data.presentation.author.institution}</p>
							{/if}
						</div>
						{#if data.presentation.author.photo}
							<img
								src={`/images/lec/${data.presentation.author.photo}`}
								alt="{data.presentation.author.firstName} {data.presentation.author.lastName}"
								class="author-photo-large"
								onerror={(e) => {
									const img = e.currentTarget as HTMLImageElement;
									img.style.display = 'none';
								}}
							/>
						{/if}
					</div>

					{#if data.presentation.title}
						<h1 class="presentation-title">{data.presentation.title}</h1>
					{/if}

					{#if data.presentation.abstract}
						<div class="abstract-section">
							<h3>Abstract</h3>
							<div class="abstract-content">{@html data.presentation.abstract}</div>
						</div>
					{/if}

					{#if data.presentation.link}
						<div class="materials-section">
							<a href={data.presentation.link} target="_blank" rel="noopener" class="materials-link">
								{#if fileExtension === 'pdf'}
									<svg class="file-icon pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
										<polyline points="14 2 14 8 20 8"></polyline>
										<line x1="16" y1="13" x2="8" y2="13"></line>
										<line x1="16" y1="17" x2="8" y2="17"></line>
										<polyline points="10 9 9 9 8 9"></polyline>
									</svg>
									<span>Download the presentation{#if data.presentation.fileSize} - {data.presentation.fileSize}{/if}</span>
								{:else if fileExtension === 'pptx'}
									<svg class="file-icon pptx-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

			<aside class="sidebar">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

<style>
	.main-grid {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 3rem;
	}

	.back-link {
		margin-bottom: 1.5rem;
	}

	.back-link a {
		color: var(--color-primary);
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.2s ease;
	}

	.back-link a:hover {
		color: var(--color-secondary);
	}

	.presentation-detail {
		background: white;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border);
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	}

	.presentation-header {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.theme-badge {
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.date-badge {
		background: var(--color-bg-alt);
		color: var(--color-text);
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-weight: 500;
		font-size: 0.9rem;
	}

	.author-section {
		display: flex;
		gap: 1.5rem;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.author-photo-large {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid white;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		flex-shrink: 0;
	}

	.author-info {
		flex: 1;
	}

	.author-info h2 {
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
	}

	.author-info h2 a {
		color: var(--color-primary);
	}

	.author-info h2 a:hover {
		color: var(--color-secondary);
	}

	.institution {
		color: var(--color-text-light);
		font-size: 1rem;
		margin: 0;
	}

	.presentation-title {
		font-size: 1.75rem;
		color: var(--color-primary);
		margin-bottom: 2rem;
		line-height: 1.4;
	}

	.abstract-section {
		margin-bottom: 2rem;
	}

	.abstract-section h3 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: var(--color-primary);
	}

	.abstract-content {
		color: var(--color-text);
		line-height: 1.8;
		font-size: 1.05rem;
	}

	.materials-section {
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.materials-link {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-primary);
		font-weight: 500;
		font-size: 1rem;
		padding: 0.75rem 1.25rem;
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.materials-link:hover {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.file-icon {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
	}

	.pdf-icon {
		color: #dc2626;
	}

	.materials-link:hover .pdf-icon {
		color: white;
	}

	.pptx-icon {
		color: #f59e0b;
	}

	.materials-link:hover .pptx-icon {
		color: white;
	}

	.sidebar {
		position: sticky;
		top: 100px;
		align-self: start;
	}

	@media (max-width: 1024px) {
		.main-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
		}
	}

	@media (max-width: 768px) {
		.presentation-detail {
			padding: 1.5rem;
		}

		.author-section {
			flex-direction: column-reverse;
			align-items: center;
			text-align: center;
			gap: 1rem;
		}

		.author-info {
			width: 100%;
		}

		.author-photo-large {
			width: 100px;
			height: 100px;
		}

		.presentation-title {
			font-size: 1.5rem;
		}
	}
</style>

