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
		<div class="main-grid">
			<div class="main-content">

				<div class="content">
					<h2>What have they become?</h2>
					<h3>Current professions of former students</h3>

					<div class="table-container">
						<table class="data-table">
							<thead>
								<tr>
									<th>Professions</th>
									<th>Current Positions</th>
									<th>Frequency</th>
								</tr>
							</thead>
							<tbody>
								{#each professions as row}
									<tr>
										<td class="profession">{row.profession}</td>
										<td class="positions">{row.positions}</td>
										<td class="frequency">{row.frequency}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<p>
						Most former participants have chosen a career in academia. Indeed, the majority of the participants
						who have completed their PhD or their post doc are now academics (55%), namely they obtained a position
						as full, associate or assistant professor in various universities, or they work as a researcher in a
						research institute (such as CNRS and INRA in France, or CNR in Italy etc.).
					</p>

					<p>
						Another significant number of former students are currently working as economists in international institutions,
						national banks, regulatory agencies, development agencies and international research centers. As a non-exhaustive list,
						we can highlight the following institutions where IOEA alumni currently hold positions:
					</p>

					<div class="institutions-cloud">
						Brazilian Regulatory Agency • Central Bank of Malaysia • Deutsche Bank • European Banking Authority •
						European Central Bank • European Commission • European Court of Justice • European Investment Bank •
						European Medicines Agency • European Regional Development Fund • French Agency for Development •
						French Authority of Competition • French Institute of Research for Development •
						French Regulatory Authority for Railway • International Health Economic Association •
						International Labor Organization • National Bank of Poland • National Bank of Slovakia •
						Organization for Economic Cooperation and Development • United Nations • World Bank
					</div>

					<p>
						Some alumni also went to the private sector (11.8%), working for international firms, banks or consulting groups
						including: Capgemini, Crédit Suisse, Ernst and Young, McKinsey and even Facebook.
					</p>

					<h2>Most Representative Institutions of Alumni</h2>

					<div class="table-container">
						<table class="data-table">
							<thead>
								<tr>
									<th>Number of Former Participants</th>
									<th>Current Institutions</th>
								</tr>
							</thead>
							<tbody>
								{#each topInstitutions as row}
									<tr>
										<td class="count">{row.count}</td>
										<td>{row.institutions}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<h2>Former Students Who Returned as Organizers</h2>

					<p>
						As an additional illustration of the attractiveness of IOEA, 18 former students came back
						to the academy as workshop organizers:
					</p>

					<div class="returned-list">
						{#each returnedAsOrganizers as name}
							<span class="alumni-name">{name}</span>
						{/each}
					</div>

					<h2>Number of Participations</h2>

					<div class="table-container">
						<table class="data-table">
							<thead>
								<tr>
									<th>Number of Participations</th>
									<th>Students</th>
									<th>Lecturers</th>
									<th>Workshop Organizers</th>
								</tr>
							</thead>
							<tbody>
								{#each participationStats as row}
									<tr>
										<td class="count">{row.participations}</td>
										<td class="number">{row.students}</td>
										<td class="number">{row.lecturers}</td>
										<td class="number">{row.organizers}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<aside class="sidebar">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

<style>
	.main-grid {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 3rem;
	}

	.content p {
		margin-bottom: 1rem;
		line-height: 1.7;
	}

	.content h2 {
		color: var(--color-primary);
		margin: 2rem 0 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.content h3 {
		color: var(--color-text-light);
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}

	.table-container {
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.data-table th {
		background: var(--color-primary);
		color: white;
		padding: 0.75rem 1rem;
		text-align: left;
		font-weight: 600;
	}

	.data-table td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	.data-table tr:nth-child(even) {
		background: var(--color-bg-alt);
	}

	.data-table .profession,
	.data-table .count {
		font-weight: 600;
		color: var(--color-primary);
	}

	.data-table .positions {
		font-size: 0.85rem;
		color: var(--color-text-light);
	}

	.data-table .frequency,
	.data-table .number {
		text-align: center;
	}

	.institutions-cloud {
		background: var(--color-bg-alt);
		padding: 1.5rem;
		border-radius: 0.5rem;
		font-size: 0.9rem;
		line-height: 2;
		color: var(--color-text-light);
		margin: 1rem 0;
	}

	.returned-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.alumni-name {
		background: var(--color-primary);
		color: white;
		padding: 0.375rem 0.75rem;
		border-radius: 2rem;
		font-size: 0.85rem;
	}

	.sidebar {
		position: sticky;
		top: 100px;
		align-self: start;
	}

	@media (max-width: 1024px) {
		.main-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
		}
	}
</style>

