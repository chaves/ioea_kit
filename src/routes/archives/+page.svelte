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
				<p class="text-xl text-text-light mb-8 leading-relaxed">
					The IOEA has been providing world-class training in institutional and organizational
					economics since {config.archiveFromYear}. Explore our past editions to learn about the
					program and faculty from each year.
				</p>

				<div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
					{#each data.yearsWithPhotos as { year, photo }}
						<div class="bg-white rounded-lg overflow-hidden border border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
							<a href="/{year}" class="relative block aspect-[16/10] overflow-hidden bg-bg-alt group">
								<img
									src={photo ? `/images/photos/${year}/${photo}` : '/images/placeholder-year.jpg'}
									alt="IOEA {year}"
									class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									onerror={(e) => {
										const img = e.currentTarget as HTMLImageElement;
										img.src = '/images/placeholder-year.jpg';
									}}
								/>
								<div class="absolute inset-0 bg-[rgba(26,54,93,0.8)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<span class="text-white font-semibold px-4 py-2 border-2 border-white rounded">View Lectures & Workshops</span>
								</div>
							</a>
							<div class="p-4">
								<h3 class="text-xl m-0 text-primary">
									<a href="/{year}">IOEA {year}</a>
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

