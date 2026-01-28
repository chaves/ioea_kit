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
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
					<p class="text-lg sm:text-xl font-medium text-text mb-12 leading-relaxed">
						The Institutional and Organizational Economics Academy is made possible thanks to
						the generous support of our sponsors and partner institutions. Their commitment to
						advancing research and education in our field is invaluable.
					</p>

					{#each Object.entries(sponsorsByYear).sort(([a], [b]) => {
						// Sort by year descending (most recent first)
						const yearA = parseInt(a.split('-')[0]);
						const yearB = parseInt(b.split('-')[0]);
						return yearB - yearA;
					}) as [year, sponsors]}
						<div class="mb-16 last:mb-0">
							<h2 class="text-primary text-2xl mb-8 pb-3 border-b-2 border-secondary font-bold">{year}</h2>
							<div class="flex flex-wrap justify-center items-center gap-12 p-10 bg-white rounded-xl border border-border shadow-sm">
								{#each sponsors as sponsor}
									{#if sponsor.url && sponsor.url.trim() !== ''}
										<a href={sponsor.url} target="_blank" rel="noopener" class="flex items-center justify-center no-underline text-text font-bold text-center cursor-pointer text-lg hover:text-primary transition-colors" title={sponsor.name}>
											<img
												src={sponsor.logo}
												alt={sponsor.name}
												class="max-h-24 max-w-[220px] w-auto grayscale-[20%] transition-all duration-300 hover:grayscale-0 hover:scale-110 sm:max-h-20 sm:max-w-[180px]"
												onerror={(e) => {
													const img = e.currentTarget as HTMLImageElement;
													img.style.display = 'none';
													const link = img.parentElement as HTMLAnchorElement;
													if (link) link.textContent = sponsor.name;
												}}
											/>
										</a>
									{:else}
										<div class="flex items-center justify-center text-text font-bold text-center cursor-default text-lg" title={sponsor.name}>
											<img
												src={sponsor.logo}
												alt={sponsor.name}
												class="max-h-24 max-w-[220px] w-auto grayscale-[20%] transition-all duration-300 hover:grayscale-0 hover:scale-110 sm:max-h-20 sm:max-w-[180px]"
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

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar showBrochure={true} showPhotos={false} />
			</aside>
		</div>
	</div>
</section>

