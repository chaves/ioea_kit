<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { coordinators } from '$lib/data/organizers';

	interface Props {
		data: {
			chairs: Array<{
				id: number;
				firstName: string;
				lastName: string;
				institution: string;
				website: string;
				photo: string;
			}>;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>The Organizers | IOEA Community</title>
	<meta name="description" content="Meet the organizers and coordinators of the IOEA." />
</svelte:head>

<PageHeader title="The Organizers" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">

				<div class="intro">
					<p>
						IOEA could not be possible without the precious work of a strong, close-knit and competent organization team.
						This organization team is composed of the director, the academy's coordinators and the seminars chairs.
					</p>
				</div>

				<!-- Director -->
				<section class="org-section">
					<h2>Director</h2>
					<div class="director-card">
						<div class="director-photo">
							<img src="/images/organizers/eric.jpg" alt="Eric Brousseau" onerror={(e) => { e.currentTarget.style.display = 'none'; }} />
						</div>
						<div class="director-info">
							<h3>Eric Brousseau</h3>
							<p>
								Professor of Economics and Management at the <a href="http://www.dauphine.fr/" class="text-link">University Paris-Dauphine</a>.
								He is the scientific director of the <a href="http://chairgovreg.fondation-dauphine.fr/" class="text-link">Chair Governance and Regulation</a>
								and a past-president of <a href="http://www.sioe.org/" class="text-link">SIOE</a>.
							</p>
							<p>
								He initiated IOEA — at that time the European School for New Institutional Economics (ESNIE) — in 2002
								and has been running this event and the related network since then.
							</p>
							<p><a href="http://www.brousseau.info" class="text-link">www.brousseau.info</a></p>
						</div>
					</div>
				</section>

				<!-- Coordinators -->
				<section class="org-section">
					<h2>IOEA Coordinators</h2>
					<p>
						As coordination and communication challenges are crucial for the organization of such an international network
						and regular set of events, IOEA is also critically depending upon the professionalism and personal involvement
						of those responsible for the organizational, administrative, and logistic coordination of the academy.
					</p>
					<div class="coordinators-grid">
						{#each coordinators as coord}
							<div class="coordinator-card">
								<div class="coordinator-photo">
									<img src={coord.photo} alt={coord.name} onerror={(e) => { e.currentTarget.src = '/images/placeholder-person.jpg'; }} />
								</div>
								<div class="coordinator-info">
									<strong>{coord.name}</strong>
									<span class="years">{coord.years}</span>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Seminar Chairs -->
				<section class="org-section">
					<h2>Seminar Chairs</h2>
					<p>
						Seminars chairs play a key role in the organization and the proper functioning of IOEA.
						During the spring session, they chair the daily seminars organized around the participants' presentation,
						discuss their paper or their research project and ensure the dynamism and the quality of the exchanges
						among the participants, and between them and the faculties lecturers and workshops organizers.
					</p>
					<p>
						Before the conference, they collegially manage the selection process of participants and the constitution
						of seminars' group, thereby guaranteeing the quality of the academy. They are also active member of the IOEA
						network that organizes on a regular basis conferences and workshops, and manages cooperative research projects.
					</p>
					<p>
						All members of this organization team hold a PhD. They either have academic positions or work as economist
						for regulatory authorities. Most of the time, they are themselves IOEA alumni.
					</p>

					{#if data.chairs.length > 0}
						<div class="chairs-grid">
							{#each data.chairs as chair}
								<div class="chair-card">
									<div class="chair-photo">
										{#if chair.photo}
											<img
												src={`/images/semchairs/${chair.photo}`}
												alt="{chair.firstName} {chair.lastName}"
												onerror={(e) => { e.currentTarget.src = '/images/placeholder-person.jpg'; }}
											/>
										{:else}
											<div class="photo-placeholder">
												{chair.firstName[0]}{chair.lastName[0]}
											</div>
										{/if}
									</div>
									<div class="chair-info">
										{#if chair.website}
											<a href={chair.website} target="_blank" rel="noopener">
												{chair.firstName} {chair.lastName}
											</a>
										{:else}
											<span>{chair.firstName} {chair.lastName}</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="no-data">Seminar chairs information is not available at this time.</p>
					{/if}
				</section>
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

	.intro {
		margin-bottom: 2rem;
		font-size: 1.1rem;
		line-height: 1.7;
	}

	.org-section {
		margin-bottom: 3rem;
	}

	.org-section h2 {
		color: var(--color-primary);
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.director-card {
		display: flex;
		gap: 2rem;
		background: white;
		padding: 2rem;
		border-radius: 0.75rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -2px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.director-card:hover {
		box-shadow:
			0 10px 25px -5px rgba(0, 0, 0, 0.1),
			0 8px 10px -6px rgba(0, 0, 0, 0.1);
	}

	.director-photo {
		flex-shrink: 0;
		width: 150px;
		height: auto;
		overflow: hidden;
		border-radius: 0.5rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -2px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		position: relative;
	}

	.director-photo::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 0.5rem;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
		pointer-events: none;
	}

	.director-card:hover .director-photo {
		transform: scale(1.02);
		box-shadow:
			0 8px 15px -3px rgba(0, 0, 0, 0.15),
			0 4px 6px -4px rgba(0, 0, 0, 0.1),
			0 0 0 3px var(--color-secondary);
	}

	.director-photo img {
		width: 100%;
		height: auto;
		display: block;
	}

	.director-info h3 {
		margin-bottom: 0.5rem;
		color: var(--color-primary);
		font-size: 1.35rem;
		transition: color 0.2s ease;
	}

	.director-card:hover .director-info h3 {
		color: var(--color-secondary-dark);
	}

	.director-info p {
		margin-bottom: 0.75rem;
		line-height: 1.6;
	}

	.coordinators-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 2rem;
		margin-top: 1.5rem;
	}

	@media (max-width: 1200px) {
		.coordinators-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 900px) {
		.coordinators-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 600px) {
		.coordinators-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.coordinator-card {
		text-align: center;
	}

	.coordinator-photo {
		width: 110px;
		height: auto;
		margin: 0 auto 1rem;
		background: white;
		border-radius: 0.375rem;
		overflow: hidden;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -2px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		position: relative;
	}

	.coordinator-photo::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			transparent 60%,
			rgba(var(--color-primary-rgb, 61, 58, 66), 0.1) 100%
		);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.coordinator-card:hover .coordinator-photo {
		transform: translateY(-4px);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1),
			0 0 0 3px var(--color-secondary);
	}

	.coordinator-card:hover .coordinator-photo::after {
		opacity: 1;
	}

	.coordinator-photo img {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 0.3s ease;
	}

	.coordinator-card:hover .coordinator-photo img {
		transform: scale(1.03);
	}

	.coordinator-info strong {
		display: block;
		color: var(--color-primary);
		font-size: 0.95rem;
		transition: color 0.2s ease;
	}

	.coordinator-card:hover .coordinator-info strong {
		color: var(--color-secondary-dark);
	}

	.coordinator-info .years {
		display: inline-block;
		font-size: 0.8rem;
		color: var(--color-text-light);
		margin-top: 0.25rem;
		padding: 0.15rem 0.5rem;
		background: var(--color-bg-alt);
		border-radius: 1rem;
	}

	.chairs-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1rem;
		margin-top: 1.5rem;
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
		text-align: center;
	}

	.chair-photo {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		overflow: hidden;
		margin: 0 auto 0.5rem;
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
		font-weight: 600;
	}

	.chair-info {
		font-size: 0.85rem;
	}

	.chair-info a {
		color: var(--color-primary);
	}

	.chair-info a:hover {
		color: var(--color-secondary);
	}

	.no-data {
		text-align: center;
		padding: 2rem;
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

	@media (max-width: 600px) {
		.director-card {
			flex-direction: column;
			text-align: center;
		}

		.director-photo {
			margin: 0 auto;
		}
	}
</style>

