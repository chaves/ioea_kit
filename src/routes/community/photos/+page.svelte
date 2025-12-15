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
				<p class="text-lg leading-relaxed mb-6 text-text-light">
					Browse photos from IOEA sessions by year, or view photos of our lecturers and organizers.
				</p>

				<div class="mb-8">
					<a href="/community/photos/lecturers" class="inline-block px-6 py-3 bg-primary text-white rounded-md font-medium no-underline transition-all duration-200 hover:bg-secondary hover:-translate-y-0.5 hover:shadow-md">
						View Lecturers & Organizers →
					</a>
				</div>

				<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
					{#each data.yearsWithPhotos as { year, photo }}
						<a href="/photos/{year}" class="bg-white rounded-lg overflow-hidden border border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl block">
							<div class="aspect-[4/3] overflow-hidden bg-bg-alt">
								<img
									src={photo ? `/images/photos/${year}/${photo}` : '/images/placeholder-year.jpg'}
									alt="IOEA {year}"
									class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
									onerror={(e) => { e.currentTarget.src = '/images/placeholder-year.jpg'; }}
								/>
							</div>
							<div class="p-3 text-center font-semibold text-primary">
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

