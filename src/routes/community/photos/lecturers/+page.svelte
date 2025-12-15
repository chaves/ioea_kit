<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	interface Props {
		data: {
			lecturers: Array<{
				id: number;
				firstName: string;
				lastName: string;
				institution: string | null;
				website: string | null;
				photo: string | null;
			}>;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Lecturers & Organizers | IOEA Community</title>
	<meta name="description" content="Photos of lecturers and organizers who have taught at the Institutional and Organizational Economics Academy." />
</svelte:head>

<PageHeader title="Lecturers & Organizers" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<p class="intro">
					Meet the distinguished lecturers and workshop organizers who have contributed to the IOEA over the years.
				</p>

				{#if data.lecturers.length > 0}
					<div class="lecturers-grid">
						{#each data.lecturers as lecturer}
							<div class="lecturer-card">
								<div class="lecturer-photo">
									{#if lecturer.photo}
										<img
											src={`/images/lec/${lecturer.photo}`}
											alt="{lecturer.firstName} {lecturer.lastName}"
											onerror={(e) => { e.currentTarget.src = '/images/placeholder-person.jpg'; }}
										/>
									{:else}
										<div class="photo-placeholder">
											{lecturer.firstName[0]}{lecturer.lastName[0]}
										</div>
									{/if}
								</div>
								<div class="lecturer-info">
									<h3>
										{#if lecturer.website}
											<a href={lecturer.website} target="_blank" rel="noopener">
												{lecturer.firstName} {lecturer.lastName}
											</a>
										{:else}
											{lecturer.firstName} {lecturer.lastName}
										{/if}
									</h3>
									{#if lecturer.institution}
										<p class="institution">{lecturer.institution}</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="no-data">No lecturer photos available.</p>
				{/if}
			</div>

			<aside class="sidebar">
				<Sidebar showPhotos={false} />
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

	.intro {
		font-size: 1.1rem;
		line-height: 1.7;
		margin-bottom: 2rem;
		color: var(--color-text-light);
	}

	.lecturers-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1.5rem;
	}

	@media (max-width: 1200px) {
		.lecturers-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 900px) {
		.lecturers-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 600px) {
		.lecturers-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.lecturer-card {
		background: white;
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid var(--color-border);
		transition: all 0.2s ease;
	}

	.lecturer-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.lecturer-photo {
		aspect-ratio: 1;
		overflow: hidden;
		background: var(--color-bg-alt);
	}

	.lecturer-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.lecturer-card:hover .lecturer-photo img {
		transform: scale(1.05);
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

	.lecturer-info {
		padding: 1rem;
	}

	.lecturer-info h3 {
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}

	.lecturer-info h3 a {
		color: var(--color-primary);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.lecturer-info h3 a:hover {
		color: var(--color-secondary);
	}

	.institution {
		font-size: 0.85rem;
		color: var(--color-text-light);
		margin: 0;
	}

	.no-data {
		text-align: center;
		padding: 3rem;
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
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
</style>

