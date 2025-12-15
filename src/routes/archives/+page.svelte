<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { config } from '$lib/config';

	interface Props {
		data: {
			yearsWithPhotos: Array<{
				year: number;
				photo: string | null;
			}>;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Past Editions | IOEA</title>
	<meta name="description" content="Explore the archives of past IOEA sessions from {config.archiveFromYear} to {config.archiveToYear}." />
</svelte:head>

<PageHeader title="Past Editions" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<p class="lead">
					The IOEA has been providing world-class training in institutional and organizational
					economics since {config.archiveFromYear}. Explore our past editions to learn about the
					program and faculty from each year.
				</p>

				<div class="years-grid">
					{#each data.yearsWithPhotos as { year, photo }}
						<div class="year-card">
							<a href="/{year}" class="year-image">
								<img
									src={photo ? `/images/photos/${year}/${photo}` : '/images/placeholder-year.jpg'}
									alt="IOEA {year}"
									onerror={(e) => { e.currentTarget.src = '/images/placeholder-year.jpg'; }}
								/>
								<div class="year-overlay">
									<span>View Lectures & Workshops</span>
								</div>
							</a>
							<div class="year-info">
								<h3><a href="/{year}">IOEA {year}</a></h3>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<aside class="sidebar">
				<Sidebar showPhotos={true} />
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
		margin-bottom: 2rem;
		line-height: 1.7;
	}

	.years-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.year-card {
		background: white;
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid var(--color-border);
		transition: all 0.2s ease;
	}

	.year-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}

	.year-image {
		position: relative;
		display: block;
		aspect-ratio: 16/10;
		overflow: hidden;
		background-color: var(--color-bg-alt);
	}

	.year-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.year-card:hover .year-image img {
		transform: scale(1.05);
	}

	.year-overlay {
		position: absolute;
		inset: 0;
		background: rgba(26, 54, 93, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.year-card:hover .year-overlay {
		opacity: 1;
	}

	.year-overlay span {
		color: white;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border: 2px solid white;
		border-radius: 0.25rem;
	}

	.year-info {
		padding: 1rem;
	}

	.year-info h3 {
		font-size: 1.25rem;
		margin: 0;
		color: var(--color-primary);
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
</style>

