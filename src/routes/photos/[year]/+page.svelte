<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	interface Props {
		data: {
			year: number;
			photos: string[];
		};
	}

	let { data }: Props = $props();
	let selectedPhoto = $state<string | null>(null);
</script>

<svelte:head>
	<title>Photos IOEA {data.year}</title>
</svelte:head>

<PageHeader title="Photos - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<!-- Back Link -->
				<div class="back-link">
					<a href="/community/photos" class="btn btn-secondary">
						← Go back to all years
					</a>
				</div>

				{#if data.photos.length > 0}
					<div class="photos-grid">
						{#each data.photos as photo}
							<button
								class="photo-item"
								onclick={() => (selectedPhoto = photo)}
							>
								<img
									src={`/images/photos/${data.year}/${photo}`}
									alt="IOEA {data.year}"
									loading="lazy"
								/>
							</button>
						{/each}
					</div>
				{:else}
					<div class="no-photos">
						<p>Photos for IOEA {data.year} are not available yet.</p>
						<p>Check back later or view photos from other years.</p>
					</div>
				{/if}

				<div class="archive-link">
					<a href="/archives/{data.year}" class="btn btn-secondary">
						← View IOEA {data.year} Program
					</a>
				</div>
			</div>

			<aside class="sidebar">
				<Sidebar showPhotos={false} />
			</aside>
		</div>
	</div>
</section>

<!-- Lightbox -->
{#if selectedPhoto}
	<div
		class="lightbox"
		role="dialog"
		aria-label="Photo lightbox"
		tabindex="0"
		onclick={() => (selectedPhoto = null)}
		onkeydown={(e) => {
			if (e.key === 'Escape' || e.key === 'Enter') {
				selectedPhoto = null;
			}
		}}
	>
		<button class="lightbox-close" onclick={() => (selectedPhoto = null)} aria-label="Close lightbox">×</button>
		<img
			src={`/images/photos/${data.year}/${selectedPhoto}`}
			alt="IOEA {data.year}"
		/>
	</div>
{/if}

<style>
	.main-grid {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 3rem;
	}

	.back-link {
		margin-bottom: 2rem;
	}

	.photos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.photo-item {
		aspect-ratio: 4/3;
		overflow: hidden;
		border-radius: 0.5rem;
		cursor: pointer;
		border: none;
		padding: 0;
		background: var(--color-bg-alt);
	}

	.photo-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.photo-item:hover img {
		transform: scale(1.05);
	}

	.no-photos {
		text-align: center;
		padding: 4rem 2rem;
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
	}

	.no-photos p {
		color: var(--color-text-light);
		margin-bottom: 0.5rem;
	}

	.archive-link {
		margin-top: 2rem;
	}

	.lightbox {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 2rem;
	}

	.lightbox img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.lightbox-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 48px;
		height: 48px;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: white;
		font-size: 2rem;
		cursor: pointer;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lightbox-close:hover {
		background: rgba(255, 255, 255, 0.2);
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

