<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { professions, topInstitutions, participationStats, returnedAsOrganizers } from '$lib/data/alumni';
</script>

<svelte:head>
	<title>Alumni | IOEA Community</title>
	<meta name="description" content="IOEA Alumni - career outcomes and professional positions of former participants." />
</svelte:head>

<PageHeader title="Alumni" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<div>
					<h2 class="text-primary my-8 mb-4 pb-2 border-b-2 border-secondary">What have they become?</h2>
					<h3 class="text-text-light text-lg mb-4">Current professions of former students</h3>

					<div class="overflow-x-auto my-6">
						<table class="w-full border-collapse text-sm">
							<thead>
								<tr>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Professions</th>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Current Positions</th>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Frequency</th>
								</tr>
							</thead>
							<tbody>
								{#each professions as row}
									<tr class="even:bg-bg-alt">
										<td class="px-4 py-3 border-b border-border font-semibold text-primary">{row.profession}</td>
										<td class="px-4 py-3 border-b border-border text-xs text-text-light">{row.positions}</td>
										<td class="px-4 py-3 border-b border-border text-center">{row.frequency}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<p class="mb-4 leading-relaxed">
						Most former participants have chosen a career in academia. Indeed, the majority of the participants
						who have completed their PhD or their post doc are now academics (55%), namely they obtained a position
						as full, associate or assistant professor in various universities, or they work as a researcher in a
						research institute (such as CNRS and INRA in France, or CNR in Italy etc.).
					</p>

					<p class="mb-4 leading-relaxed">
						Another significant number of former students are currently working as economists in international institutions,
						national banks, regulatory agencies, development agencies and international research centers. As a non-exhaustive list,
						we can highlight the following institutions where IOEA alumni currently hold positions:
					</p>

					<div class="bg-bg-alt p-6 rounded-lg text-sm leading-loose text-text-light my-4">
						Brazilian Regulatory Agency • Central Bank of Malaysia • Deutsche Bank • European Banking Authority •
						European Central Bank • European Commission • European Court of Justice • European Investment Bank •
						European Medicines Agency • European Regional Development Fund • French Agency for Development •
						French Authority of Competition • French Institute of Research for Development •
						French Regulatory Authority for Railway • International Health Economic Association •
						International Labor Organization • National Bank of Poland • National Bank of Slovakia •
						Organization for Economic Cooperation and Development • United Nations • World Bank
					</div>

					<p class="mb-4 leading-relaxed">
						Some alumni also went to the private sector (11.8%), working for international firms, banks or consulting groups
						including: Capgemini, Crédit Suisse, Ernst and Young, McKinsey and even Facebook.
					</p>

					<h2 class="text-primary my-8 mb-4 pb-2 border-b-2 border-secondary">Most Representative Institutions of Alumni</h2>

					<div class="overflow-x-auto my-6">
						<table class="w-full border-collapse text-sm">
							<thead>
								<tr>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Number of Former Participants</th>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Current Institutions</th>
								</tr>
							</thead>
							<tbody>
								{#each topInstitutions as row}
									<tr class="even:bg-bg-alt">
										<td class="px-4 py-3 border-b border-border font-semibold text-primary">{row.count}</td>
										<td class="px-4 py-3 border-b border-border">{row.institutions}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<h2 class="text-primary my-8 mb-4 pb-2 border-b-2 border-secondary">Former Students Who Returned as Organizers</h2>

					<p class="mb-4 leading-relaxed">
						As an additional illustration of the attractiveness of IOEA, 18 former students came back
						to the academy as workshop organizers:
					</p>

					<div class="flex flex-wrap gap-2 my-4">
						{#each returnedAsOrganizers as name}
							<span class="bg-primary text-white px-3 py-1.5 rounded-full text-xs">{name}</span>
						{/each}
					</div>

					<h2 class="text-primary my-8 mb-4 pb-2 border-b-2 border-secondary">Number of Participations</h2>

					<div class="overflow-x-auto my-6">
						<table class="w-full border-collapse text-sm">
							<thead>
								<tr>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Number of Participations</th>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Students</th>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Lecturers</th>
									<th class="bg-primary text-white px-4 py-3 text-left font-semibold">Workshop Organizers</th>
								</tr>
							</thead>
							<tbody>
								{#each participationStats as row}
									<tr class="even:bg-bg-alt">
										<td class="px-4 py-3 border-b border-border font-semibold text-primary">{row.participations}</td>
										<td class="px-4 py-3 border-b border-border text-center">{row.students}</td>
										<td class="px-4 py-3 border-b border-border text-center">{row.lecturers}</td>
										<td class="px-4 py-3 border-b border-border text-center">{row.organizers}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


