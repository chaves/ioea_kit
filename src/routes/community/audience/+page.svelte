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
		<div class="main-grid">
			<div class="main-content">

				<div class="content">
					<p class="lead">
						Between 2002 and 2018, 1135 scholars attended the IOEA. Among them, 858 are alumni and 277 are invited speakers.
						Thanks to the international nature of the scientific committee, the IOEA benefits from a profoundly international audience.
					</p>

					<p>
						The academy also benefits from the active support of the
						<a href="https://www.sioe.org/" target="_blank" rel="noopener" class="text-link">Society for Institutional and Organizational Economics (SIOE)</a>,
						formerly known as the International Society for New Institutional Economics (ISNIE).
						This society greatly contributes to the expansion of an international network of students and researchers.
					</p>

					<p>
						As shown below, the school has been attracting a growing number of international participants and became
						a reference for researchers working in the field. In 2002, less than 25% of students came from elsewhere
						than the European continent; in 2017, this share became more than 60%.
					</p>

					<h2>An International Audience</h2>

					<div class="table-container">
						<table class="data-table">
							<thead>
								<tr>
									<th>Zones</th>
									<th>Countries</th>
									<th>Participants</th>
									<th>Frequency</th>
								</tr>
							</thead>
							<tbody>
								{#each audienceByRegion as row}
									<tr>
										<td class="region">{row.region}</td>
										<td class="countries">{row.countries}</td>
										<td class="number">{row.participants}</td>
										<td class="frequency">{row.frequency}</td>
									</tr>
								{/each}
								<tr class="total-row">
									<td colspan="2"><strong>Total</strong></td>
									<td class="number"><strong>1135</strong></td>
									<td class="frequency"><strong>100%</strong></td>
								</tr>
							</tbody>
						</table>
					</div>

					<h2>Evolution of Participation</h2>

					<div class="chart-container">
						<img
							src="/images/graphiques/participation.jpg"
							alt="Evolution of participants' and Faculty's nationalities"
							onerror={(e) => { e.currentTarget.style.display = 'none'; }}
						/>
					</div>

					<div class="stats-boxes">
						<div class="stat-box">
							<span class="stat-number">1135</span>
							<span class="stat-label">Total Scholars</span>
						</div>
						<div class="stat-box">
							<span class="stat-number">858</span>
							<span class="stat-label">Alumni</span>
						</div>
						<div class="stat-box">
							<span class="stat-number">277</span>
							<span class="stat-label">Invited Speakers</span>
						</div>
						<div class="stat-box">
							<span class="stat-number">70+</span>
							<span class="stat-label">Countries</span>
						</div>
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

	.lead {
		font-size: 1.15rem;
		line-height: 1.7;
		margin-bottom: 1.5rem;
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

	.data-table .region {
		font-weight: 600;
		color: var(--color-primary);
		white-space: nowrap;
	}

	.data-table .countries {
		font-size: 0.85rem;
		color: var(--color-text-light);
	}

	.data-table .number,
	.data-table .frequency {
		text-align: center;
		white-space: nowrap;
	}

	.total-row {
		background: var(--color-primary) !important;
		color: white;
	}

	.total-row td {
		border-bottom: none;
	}

	.chart-container {
		margin: 2rem 0;
		text-align: center;
	}

	.chart-container img {
		max-width: 100%;
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.stats-boxes {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-top: 2rem;
	}

	.stat-box {
		background: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		text-align: center;
	}

	.stat-number {
		display: block;
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-secondary);
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--color-text-light);
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

		.stats-boxes {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.stats-boxes {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>

