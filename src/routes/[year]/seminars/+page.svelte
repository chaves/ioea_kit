<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	interface Props {
		data: {
			year: number;
			chairs: Array<{
				id: number;
				firstName: string;
				lastName: string;
				university: string | null;
				website: string | null;
				photo: string | null;
				bio: string | null;
				groupId: number | null;
			}>;
		};
	}

	let { data }: Props = $props();

	// Group chairs by group
	const chairsByGroup = $derived(() => {
		const groups: Record<number, typeof data.chairs> = {};
		data.chairs.forEach((chair) => {
			const groupId = chair.groupId ?? 0;
			if (!groups[groupId]) {
				groups[groupId] = [];
			}
			groups[groupId].push(chair);
		});
		return groups;
	});
</script>

<svelte:head>
	<title>Seminars - IOEA {data.year}</title>
</svelte:head>

<PageHeader title="Seminars - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<p class="lead">
					The seminar sessions at IOEA {data.year} provide participants with the opportunity
					to present their research and receive feedback from faculty and peers.
				</p>

				<div class="seminar-info">
					<h2>About the Seminars</h2>
					<p>
						Participants are organized into small groups, each led by experienced seminar chairs.
						In these sessions, participants present their work-in-progress and receive
						constructive feedback to help advance their research.
					</p>
				</div>

				{#if data.chairs.length > 0}
					<div class="chairs-section">
						<h2>Seminar Chairs</h2>
						<div class="chairs-grid">
							{#each data.chairs as chair}
								<div class="chair-card">
									<div class="chair-photo">
										{#if chair.photo}
										<img
											src={`/images/semchairs/${chair.photo}`}
											alt="{chair.firstName} {chair.lastName}"
											onerror={(e) => e.currentTarget.src = '/images/placeholder-person.jpg'}
										/>
										{:else}
											<div class="photo-placeholder">
												{chair.firstName[0]}{chair.lastName[0]}
											</div>
										{/if}
									</div>
									<div class="chair-info">
										<h3>
											{#if chair.website}
												<a href={chair.website} target="_blank" rel="noopener">
													{chair.firstName} {chair.lastName}
												</a>
											{:else}
												{chair.firstName} {chair.lastName}
											{/if}
										</h3>
										{#if chair.university}
											<p class="university">{chair.university}</p>
										{/if}
										{#if chair.groupId}
											<span class="group-badge">Group {chair.groupId}</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<div class="no-data">
						<p>Seminar chair information will be available soon.</p>
					</div>
				{/if}
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
		font-size: 1.1rem;
		color: var(--color-text-light);
		margin-bottom: 2rem;
	}

	.seminar-info {
		background: var(--color-bg-alt);
		padding: 1.5rem;
		border-radius: 0.5rem;
		margin-bottom: 2rem;
	}

	.seminar-info h2 {
		margin-bottom: 1rem;
	}

	.seminar-info p {
		margin: 0;
		line-height: 1.7;
	}

	.chairs-section h2 {
		margin-bottom: 1.5rem;
	}

	.chairs-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1.5rem;
	}

	@media (max-width: 1200px) {
		.chairs-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 900px) {
		.chairs-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 600px) {
		.chairs-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.chair-card {
		background: white;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		overflow: hidden;
	}

	.chair-photo {
		aspect-ratio: 1;
		overflow: hidden;
		background: var(--color-bg-alt);
	}

	.chair-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.photo-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-primary);
		color: white;
		font-size: 2rem;
		font-weight: 600;
	}

	.chair-info {
		padding: 1rem;
	}

	.chair-info h3 {
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}

	.chair-info h3 a {
		color: var(--color-primary);
	}

	.university {
		font-size: 0.85rem;
		color: var(--color-text-light);
		margin: 0 0 0.5rem 0;
	}

	.group-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: var(--color-secondary);
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 1rem;
	}

	.no-data {
		text-align: center;
		padding: 3rem;
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
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

