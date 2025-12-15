<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { audienceByRegion } from '$lib/data/audience';
</script>

<svelte:head>
	<title>The Audience | IOEA Community</title>
	<meta name="description" content="International audience of the IOEA - statistics and demographics." />
</svelte:head>

<PageHeader title="The Audience" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<div>
					<p class="text-lg leading-relaxed mb-4">
						Between 2002 and 2018, 1135 scholars attended the IOEA. Among them, 858 are alumni and 277 are invited speakers.
						Thanks to the international nature of the scientific committee, the IOEA benefits from a profoundly international audience.
					</p>

					<p class="mb-4 leading-relaxed">
						The academy also benefits from the active support of the
						<a href="https://www.sioe.org/" target="_blank" rel="noopener" class="text-link">Society for Institutional and Organizational Economics (SIOE)</a>,
						formerly known as the International Society for New Institutional Economics (ISNIE).
						This society greatly contributes to the expansion of an international network of students and researchers.
					</p>

					<p class="mb-4 leading-relaxed">
						As shown below, the school has been attracting a growing number of international participants and became
						a reference for researchers working in the field. In 2002, less than 25% of students came from elsewhere
						than the European continent; in 2017, this share became more than 60%.
					</p>

					<h2 class="text-primary my-8 mb-4 pb-2 border-b-2 border-secondary">An International Audience</h2>

					<div class="overflow-x-auto my-6">
						<table class="w-full border-collapse text-sm">
							<thead>
								<tr>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Zones</th>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Countries</th>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Participants</th>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Frequency</th>
								</tr>
							</thead>
							<tbody>
								{#each audienceByRegion as row}
									<tr class="even:bg-bg-alt">
										<td class="px-4 py-3 border-b border-border font-semibold text-primary whitespace-nowrap">{row.region}</td>
										<td class="px-4 py-3 border-b border-border text-xs text-text-light">{row.countries}</td>
										<td class="px-4 py-3 border-b border-border text-center whitespace-nowrap">{row.participants}</td>
										<td class="px-4 py-3 border-b border-border text-center whitespace-nowrap">{row.frequency}</td>
									</tr>
								{/each}
								<tr class="bg-primary text-white">
									<td colspan="2" class="px-4 py-3 border-b-0"><strong>Total</strong></td>
									<td class="px-4 py-3 border-b-0 text-center"><strong>1135</strong></td>
									<td class="px-4 py-3 border-b-0 text-center"><strong>100%</strong></td>
								</tr>
							</tbody>
						</table>
					</div>

					<h2 class="text-primary my-8 mb-4 pb-2 border-b-2 border-secondary">Evolution of Participation</h2>

					<div class="my-8 text-center">
						<img
							src="/images/graphiques/participation.jpg"
							alt="Evolution of participants' and Faculty's nationalities"
							class="max-w-full rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
							onerror={(e) => { e.currentTarget.style.display = 'none'; }}
						/>
					</div>

					<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
						<div class="bg-white p-6 rounded-lg border border-border text-center">
							<span class="block text-3xl font-bold text-secondary mb-2">1135</span>
							<span class="text-xs text-text-light">Total Scholars</span>
						</div>
						<div class="bg-white p-6 rounded-lg border border-border text-center">
							<span class="block text-3xl font-bold text-secondary mb-2">858</span>
							<span class="text-xs text-text-light">Alumni</span>
						</div>
						<div class="bg-white p-6 rounded-lg border border-border text-center">
							<span class="block text-3xl font-bold text-secondary mb-2">277</span>
							<span class="text-xs text-text-light">Invited Speakers</span>
						</div>
						<div class="bg-white p-6 rounded-lg border border-border text-center">
							<span class="block text-3xl font-bold text-secondary mb-2">70+</span>
							<span class="text-xs text-text-light">Countries</span>
						</div>
					</div>
				</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


