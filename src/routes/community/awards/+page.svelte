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
					<p class="text-lg sm:text-xl font-medium text-text leading-relaxed mb-8">
						The quality of the academy and its selection can also be seen through the professional evolution
						of students who have obtained an award. Indeed, the academy awards two prizes each year
						(and sometimes several Accessits) for the best Ph.D. project and the best working paper.
					</p>

					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-10 text-text">
						The laureate of the best Ph.D. project wins participation in the next IOEA session while
						the laureate of the best working paper wins participation in the <a href="https://www.sioe.org/" target="_blank" rel="noopener" class="text-link font-medium">SIOE</a> conference
						(these participations are funded by IOEA).
					</p>

					<h2 class="text-primary mt-12 mb-8 pb-3 border-b-2 border-secondary text-2xl font-bold">Laureates Since 2007</h2>

					{#each years as year}
						<div class="mb-12 last:mb-0">
							<h3 class="bg-primary text-white px-6 py-3 rounded-lg text-xl font-bold mb-6 shadow-sm">{year}</h3>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
								{#each awardsByYear[year] as award}
									<div class="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
										<span class="inline-block bg-secondary/10 text-secondary-dark px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4 border border-secondary/20">{award.award}</span>
										<div class="flex flex-col gap-1.5">
											<strong class="text-primary text-lg font-bold">{award.name}</strong>
											<span class="text-base text-text-light font-medium">{award.institution}</span>
											{#if award.status}
												<span class="text-sm text-text-light italic mt-1">{award.status}</span>
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


