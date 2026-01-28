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
				<div class="mb-10">
					<a href="/community/photos" class="inline-flex items-center gap-2 px-6 py-3 bg-bg-alt text-primary rounded-xl font-bold no-underline transition-all duration-300 hover:bg-primary hover:text-white border border-border shadow-sm">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
						All years
					</a>
				</div>

				{#if data.photos.length > 0}
					<div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
						{#each data.photos as photo}
							<button
								class="aspect-[4/3] overflow-hidden rounded-xl cursor-pointer border-0 p-0 bg-bg-alt shadow-md hover:shadow-2xl transition-all duration-300 group ring-4 ring-transparent hover:ring-primary/20"
								onclick={() => (selectedPhoto = photo)}
							>
								<img
									src={`/images/photos/${data.year}/${photo}`}
									alt="IOEA {data.year}"
									loading="lazy"
									class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							</button>
						{/each}
					</div>
				{:else}
					<div class="text-center py-24 px-10 bg-bg-alt rounded-2xl border-2 border-dashed border-border">
						<div class="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
							<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
						</div>
						<p class="text-text font-bold text-xl mb-2">Photos for IOEA {data.year} are not available yet.</p>
						<p class="text-text-light text-base m-0 font-medium">Check back later or view photos from other years.</p>
					</div>
				{/if}

				<div class="mt-12 pt-8 border-t border-border">
					<a href="/archives/{data.year}" class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg no-underline transition-all duration-300 hover:bg-primary-dark hover:-translate-y-1 hover:shadow-xl">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
						View IOEA {data.year} Program
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


