<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

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
	<title>Photos | IOEA Community</title>
	<meta name="description" content="Photo gallery of the IOEA community - lecturers and annual sessions." />
</svelte:head>

<PageHeader title="Photos" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<p class="intro">
					Browse photos from IOEA sessions by year, or view photos of our lecturers and organizers.
				</p>

				<div class="quick-links">
					<a href="/community/photos/lecturers" class="quick-link">
						View Lecturers & Organizers →
					</a>
				</div>

				<div class="years-grid">
					{#each data.yearsWithPhotos as { year, photo }}
						<a href="/photos/{year}" class="year-card">
							<div class="year-image">
								<img
									src={photo ? `/images/photos/${year}/${photo}` : '/images/placeholder-year.jpg'}
									alt="IOEA {year}"
									onerror={(e) => { e.currentTarget.src = '/images/placeholder-year.jpg'; }}
								/>
							</div>
							<div class="year-label">
								IOEA {year}
							</div>
						</a>
					{/each}
				</div>
			</div>

			<aside class="sidebar">
				<Sidebar showPhotos={false} />
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

	.intro {
		font-size: 1.1rem;
		line-height: 1.7;
		margin-bottom: 1.5rem;
		color: var(--color-text-light);
	}

	.quick-links {
		margin-bottom: 2rem;
	}

	.quick-link {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: var(--color-primary);
		color: white;
		border-radius: 0.375rem;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.quick-link:hover {
		background: var(--color-secondary);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.years-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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
		aspect-ratio: 4/3;
		overflow: hidden;
		background: var(--color-bg-alt);
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

	.year-label {
		padding: 0.75rem;
		text-align: center;
		font-weight: 600;
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

