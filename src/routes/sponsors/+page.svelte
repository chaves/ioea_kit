<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { sponsorsByYear } from '$lib/data/sponsors';
</script>

<svelte:head>
	<title>Sponsors | IOEA</title>
	<meta name="description" content="The IOEA is made possible thanks to the generous support of our sponsors and partner institutions." />
</svelte:head>

<PageHeader title="Sponsors" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<p class="lead">
					The Institutional and Organizational Economics Academy is made possible thanks to
					the generous support of our sponsors and partner institutions. Their commitment to
					advancing research and education in our field is invaluable.
				</p>

				{#each Object.entries(sponsorsByYear).sort(([a], [b]) => {
					// Sort by year descending (most recent first)
					// Handle year ranges like "2002-2019" by extracting the first year
					const yearA = parseInt(a.split('-')[0]);
					const yearB = parseInt(b.split('-')[0]);
					return yearB - yearA;
				}) as [year, sponsors]}
					<div class="sponsor-section">
						<h2>{year}</h2>
						<div class="sponsors-row">
							{#each sponsors as sponsor}
								{#if sponsor.url && sponsor.url.trim() !== ''}
									<a href={sponsor.url} target="_blank" rel="noopener" class="sponsor-item" title={sponsor.name}>
										<img
											src={sponsor.logo}
											alt={sponsor.name}
											onerror={(e) => {
												const img = e.currentTarget as HTMLImageElement;
												img.style.display = 'none';
												const link = img.parentElement as HTMLAnchorElement;
												if (link) link.textContent = sponsor.name;
											}}
										/>
									</a>
								{:else}
									<div class="sponsor-item" title={sponsor.name}>
										<img
											src={sponsor.logo}
											alt={sponsor.name}
											onerror={(e) => {
												const img = e.currentTarget as HTMLImageElement;
												img.style.display = 'none';
												const div = img.parentElement as HTMLDivElement;
												if (div) div.textContent = sponsor.name;
											}}
										/>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<aside class="sidebar">
				<Sidebar showBrochure={true} showPhotos={false} />
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

	.lead {
		font-size: 1.2rem;
		color: var(--color-text-light);
		margin-bottom: 3rem;
		line-height: 1.7;
	}

	.sponsor-section {
		margin-bottom: 3rem;
	}

	.sponsor-section h2 {
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid var(--color-border);
	}

	.sponsors-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 3rem;
		padding: 2rem;
		background: white;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
	}

	.sponsor-item {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		color: var(--color-text);
		font-weight: 600;
		text-align: center;
		cursor: default;
	}

	a.sponsor-item {
		cursor: pointer;
	}

	.sponsor-item img {
		max-height: 80px;
		max-width: 200px;
		width: auto;
		filter: grayscale(20%);
		transition: all 0.3s ease;
	}

	.sponsor-item:hover img {
		filter: grayscale(0%);
		transform: scale(1.05);
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

	@media (max-width: 767px) {
		.sponsors-row {
			gap: 2rem;
		}

		.sponsor-item img {
			max-height: 60px;
			max-width: 150px;
		}
	}
</style>

