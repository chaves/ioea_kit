<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';
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

<SEO
	title="Past Editions"
	description="Explore the archives of past IOEA sessions from {config.archiveFromYear} to {config.archiveToYear}."
/>

<PageHeader title="Past Editions" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
					<p class="text-lg sm:text-xl font-medium text-text mb-12 leading-relaxed">
						The IOEA has been providing world-class training in institutional and organizational
						economics since {config.archiveFromYear}. Explore our past editions to learn about the
						program and faculty from each year.
					</p>

					<div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
						{#each data.yearsWithPhotos as { year, photo }}
							<div class="bg-white rounded-xl overflow-hidden border border-border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
								<a href="/{year}" class="relative block aspect-[16/10] overflow-hidden bg-bg-alt">
									<img
										src={photo ? `/images/photos/${year}/${photo}` : '/images/placeholder-year.jpg'}
										alt="IOEA {year}"
										class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										onerror={(e) => {
											const img = e.currentTarget as HTMLImageElement;
											img.src = '/images/placeholder-year.jpg';
										}}
									/>
									<div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<span class="text-white font-bold px-6 py-3 border-2 border-white rounded-lg uppercase tracking-wider text-sm shadow-lg">View Edition</span>
									</div>
								</a>
								<div class="p-6 text-center">
									<h3 class="text-2xl m-0 font-bold">
										<a href="/{year}" class="text-primary no-underline hover:text-secondary transition-colors">IOEA {year}</a>
									</h3>
								</div>
							</div>
						{/each}
					</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar showPhotos={true} />
			</aside>
		</div>
	</div>
</section>

