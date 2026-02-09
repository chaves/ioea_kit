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
					<p class="text-lg sm:text-xl font-medium text-text leading-relaxed mb-8">
						Between 2002 and 2018, 1135 scholars attended the IOEA. Among them, 858 are alumni and 277 are invited speakers.
						Thanks to the international nature of the scientific committee, the IOEA benefits from a profoundly international audience.
					</p>

					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-6 text-text">
						The academy also benefits from the active support of the
						<a href="https://www.sioe.org/" target="_blank" rel="noopener" class="text-link font-medium">Society for Institutional and Organizational Economics (SIOE)</a>,
						formerly known as the International Society for New Institutional Economics (ISNIE).
						This society greatly contributes to the expansion of an international network of students and researchers.
					</p>

					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-6 text-text">
						As shown below, the school has been attracting a growing number of international participants and became
						a reference for researchers working in the field. In 2002, less than 25% of students came from elsewhere
						than the European continent; in 2017, this share became more than 60%.
					</p>

					<h2 class="text-primary mt-12 mb-6 pb-2 border-b-2 border-secondary text-2xl">An International Audience</h2>

					<div class="overflow-x-auto my-8 rounded-xl border border-border shadow-sm">
						<table class="w-full border-collapse text-sm sm:text-base">
							<thead>
								<tr>
									<th class="bg-primary text-white px-6 py-4 text-left font-semibold">Zones</th>
									<th class="bg-primary text-white px-6 py-4 text-left font-semibold">Countries</th>
									<th class="bg-primary text-white px-6 py-4 text-center font-semibold">Participants</th>
									<th class="bg-primary text-white px-6 py-4 text-center font-semibold">Frequency</th>
								</tr>
							</thead>
							<tbody>
								{#each audienceByRegion as row}
									<tr class="even:bg-bg-alt hover:bg-bg-alt/50 transition-colors">
										<td class="px-6 py-4 border-b border-border font-semibold text-primary whitespace-nowrap">{row.region}</td>
										<td class="px-6 py-4 border-b border-border text-sm text-text-light leading-relaxed">{row.countries}</td>
										<td class="px-6 py-4 border-b border-border text-center font-medium whitespace-nowrap">{row.participants}</td>
										<td class="px-6 py-4 border-b border-border text-center font-medium whitespace-nowrap">{row.frequency}</td>
									</tr>
								{/each}
								<tr class="bg-primary text-white">
									<td colspan="2" class="px-6 py-4 border-b-0"><strong>Total</strong></td>
									<td class="px-6 py-4 border-b-0 text-center"><strong>1135</strong></td>
									<td class="px-6 py-4 border-b-0 text-center"><strong>100%</strong></td>
								</tr>
							</tbody>
						</table>
					</div>

					<h2 class="text-primary mt-12 mb-6 pb-2 border-b-2 border-secondary text-2xl">Evolution of Participation</h2>

						<div class="my-10 text-center">
							<img
								src="/images/graphiques/participation.jpg"
								alt="Evolution of participants' and Faculty's nationalities"
								class="max-w-full rounded-xl shadow-lg border border-border"
								onerror={(e) => {
									(e.currentTarget as HTMLImageElement).style.display = 'none';
								}}
							/>
						</div>

					<div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
						<div class="bg-white p-8 rounded-xl border border-border text-center shadow-sm">
							<span class="block text-4xl font-bold text-secondary mb-2">1135</span>
							<span class="text-sm font-medium uppercase tracking-wider text-text-light">Total Scholars</span>
						</div>
						<div class="bg-white p-8 rounded-xl border border-border text-center shadow-sm">
							<span class="block text-4xl font-bold text-secondary mb-2">858</span>
							<span class="text-sm font-medium uppercase tracking-wider text-text-light">Alumni</span>
						</div>
						<div class="bg-white p-8 rounded-xl border border-border text-center shadow-sm">
							<span class="block text-4xl font-bold text-secondary mb-2">277</span>
							<span class="text-sm font-medium uppercase tracking-wider text-text-light">Invited Speakers</span>
						</div>
						<div class="bg-white p-8 rounded-xl border border-border text-center shadow-sm">
							<span class="block text-4xl font-bold text-secondary mb-2">70+</span>
							<span class="text-sm font-medium uppercase tracking-wider text-text-light">Countries</span>
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

