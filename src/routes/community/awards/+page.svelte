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
		<div class="main-grid">
			<div class="main-content">

				<div class="content">
					<p class="lead">
						The quality of the academy and its selection can also be seen through the professional evolution
						of students who have obtained an award. Indeed, the academy awards two prizes each year
						(and sometimes several Accessits) for the best Ph.D. project and the best working paper.
					</p>

					<p>
						The laureate of the best Ph.D. project wins participation in the next IOEA session while
						the laureate of the best working paper wins participation in the <a href="https://www.sioe.org/" target="_blank" rel="noopener" class="text-link">SIOE</a> conference
						(these participations are funded by IOEA).
					</p>

					<h2>Laureates Since 2007</h2>

					{#each years as year}
						<div class="year-section">
							<h3 class="year-header">{year}</h3>
							<div class="awards-list">
								{#each awardsByYear[year] as award}
									<div class="award-card">
										<span class="award-type">{award.award}</span>
										<div class="award-info">
											<strong class="laureate-name">{award.name}</strong>
											<span class="institution">{award.institution}</span>
											{#if award.status}
												<span class="status">{award.status}</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
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
		margin-bottom: 1rem;
	}

	.content p {
		margin-bottom: 1rem;
		line-height: 1.7;
	}

	.content h2 {
		color: var(--color-primary);
		margin: 2rem 0 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.year-section {
		margin-bottom: 2rem;
	}

	.year-header {
		background: var(--color-primary);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}

	.awards-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.award-card {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
	}

	.award-type {
		flex-shrink: 0;
		width: 150px;
		font-weight: 600;
		color: var(--color-secondary);
		font-size: 0.9rem;
	}

	.award-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
		min-width: 0;
	}

	.laureate-name {
		color: var(--color-primary);
	}

	.institution {
		font-size: 0.9rem;
		color: var(--color-text);
	}

	.status {
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
	}

	@media (max-width: 900px) {
		.awards-list {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.award-card {
			flex-direction: column;
			gap: 0.5rem;
		}

		.award-type {
			width: auto;
		}

		.area {
			max-width: none;
			text-align: left;
			align-self: flex-start;
		}
	}
</style>

