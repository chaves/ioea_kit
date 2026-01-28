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
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<p class="text-lg sm:text-xl font-medium text-text mb-10 leading-relaxed">
					Browse photos from IOEA sessions by year, or view photos of our lecturers and organizers.
				</p>

				<div class="mb-12">
					<a href="/community/photos/lecturers" class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg no-underline transition-all duration-300 hover:bg-primary-dark hover:-translate-y-1 hover:shadow-2xl">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
						View Lecturers & Organizers
					</a>
				</div>

				<div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
					{#each data.yearsWithPhotos as { year, photo }}
						<a href="/photos/{year}" class="bg-white rounded-xl overflow-hidden border border-border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl block group">
							<div class="aspect-[4/3] overflow-hidden bg-bg-alt relative">
								<img
									src={photo ? `/images/photos/${year}/${photo}` : '/images/placeholder-year.jpg'}
									alt="IOEA {year}"
									class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
									onerror={(e) => { e.currentTarget.src = '/images/placeholder-year.jpg'; }}
								/>
								<div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>
							<div class="p-5 text-center font-bold text-primary text-xl group-hover:text-secondary transition-colors">
								IOEA {year}
							</div>
						</a>
					{/each}
				</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar showPhotos={false} />
			</aside>
		</div>
	</div>
</section>

