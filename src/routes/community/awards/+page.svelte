<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { getAwardsByYear, getAwardYears } from '$lib/data/awards';

	const awardsByYear = getAwardsByYear();
	const years = getAwardYears();
</script>

<svelte:head>
	<title>Prize Winners | IOEA Community</title>
	<meta name="description" content="IOEA award winners - Best Paper and Best PhD Project laureates since 2007." />
</svelte:head>

<PageHeader title="Prize Winners" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<div>
					<p class="text-lg leading-relaxed mb-4">
						The quality of the academy and its selection can also be seen through the professional evolution
						of students who have obtained an award. Indeed, the academy awards two prizes each year
						(and sometimes several Accessits) for the best Ph.D. project and the best working paper.
					</p>

					<p class="mb-4 leading-relaxed">
						The laureate of the best Ph.D. project wins participation in the next IOEA session while
						the laureate of the best working paper wins participation in the <a href="https://www.sioe.org/" target="_blank" rel="noopener" class="text-link">SIOE</a> conference
						(these participations are funded by IOEA).
					</p>

					<h2 class="text-primary my-8 mb-6 pb-2 border-b-2 border-secondary">Laureates Since 2007</h2>

					{#each years as year}
						<div class="mb-8">
							<h3 class="bg-primary text-white px-4 py-2 rounded-md text-xl mb-4">{year}</h3>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{#each awardsByYear[year] as award}
									<div class="bg-white rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
										<span class="inline-block bg-secondary-light/15 text-secondary-dark px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">{award.award}</span>
										<div class="flex flex-col gap-1">
											<strong class="text-primary text-base">{award.name}</strong>
											<span class="text-sm text-text-light">{award.institution}</span>
											{#if award.status}
												<span class="text-xs text-text-muted italic">{award.status}</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


