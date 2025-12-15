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
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<!-- Back Link -->
				<div class="mb-8">
					<a href="/community/photos" class="btn btn-secondary no-underline">
						← Go back to all years
					</a>
				</div>

				{#if data.photos.length > 0}
					<div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
						{#each data.photos as photo}
							<button
								class="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer border-0 p-0 bg-bg-alt"
								onclick={() => (selectedPhoto = photo)}
							>
								<img
									src={`/images/photos/${data.year}/${photo}`}
									alt="IOEA {data.year}"
									loading="lazy"
									class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
								/>
							</button>
						{/each}
					</div>
				{:else}
					<div class="text-center py-16 px-8 bg-bg-alt rounded-lg">
						<p class="text-text-light mb-2">Photos for IOEA {data.year} are not available yet.</p>
						<p class="text-text-light m-0">Check back later or view photos from other years.</p>
					</div>
				{/if}

				<div class="mt-8">
					<a href="/archives/{data.year}" class="btn btn-secondary no-underline">
						← View IOEA {data.year} Program
					</a>
				</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar showPhotos={false} />
			</aside>
		</div>
	</div>
</section>

<!-- Lightbox -->
{#if selectedPhoto}
	<div
		class="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000] p-8"
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
		<button class="absolute top-4 right-4 w-12 h-12 bg-white/10 border-0 text-white text-3xl cursor-pointer rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/20" onclick={() => (selectedPhoto = null)} aria-label="Close lightbox">×</button>
		<img
			src={`/images/photos/${data.year}/${selectedPhoto}`}
			alt="IOEA {data.year}"
			class="max-w-full max-h-full object-contain"
		/>
	</div>
{/if}


