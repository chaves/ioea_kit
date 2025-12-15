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
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">

				<div class="mb-8 text-lg leading-relaxed">
					<p>
						IOEA could not be possible without the precious work of a strong, close-knit and competent organization team.
						This organization team is composed of the director, the academy's coordinators and the seminars chairs.
					</p>
				</div>

				<!-- Director -->
				<section class="mb-12">
					<h2 class="text-primary mb-4 pb-2 border-b-2 border-secondary">Director</h2>
					<div class="flex gap-8 bg-white p-8 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] group flex-col sm:flex-row sm:text-left text-center sm:items-start items-center">
						<div class="flex-shrink-0 w-[150px] h-auto overflow-hidden rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 relative after:content-[''] after:absolute after:inset-0 after:rounded-lg after:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] after:pointer-events-none group-hover:scale-[1.02] group-hover:shadow-[0_8px_15px_-3px_rgba(0,0,0,0.15),0_4px_6px_-4px_rgba(0,0,0,0.1),0_0_0_3px_var(--color-secondary)]">
							<img src="/images/organizers/eric.jpg" alt="Eric Brousseau" class="w-full h-auto block" onerror={(e) => { e.currentTarget.style.display = 'none'; }} />
						</div>
						<div class="flex-1">
							<h3 class="mb-2 text-primary text-[1.35rem] transition-colors duration-200 group-hover:text-secondary-dark">Eric Brousseau</h3>
							<p class="mb-3 leading-relaxed">
								Professor of Economics and Management at the <a href="http://www.dauphine.fr/" class="text-link">University Paris-Dauphine</a>.
								He is the scientific director of the <a href="http://chairgovreg.fondation-dauphine.fr/" class="text-link">Chair Governance and Regulation</a>
								and a past-president of <a href="http://www.sioe.org/" class="text-link">SIOE</a>.
							</p>
							<p class="mb-3 leading-relaxed">
								He initiated IOEA — at that time the European School for New Institutional Economics (ESNIE) — in 2002
								and has been running this event and the related network since then.
							</p>
							<p class="mb-0"><a href="http://www.brousseau.info" class="text-link">www.brousseau.info</a></p>
						</div>
					</div>
				</section>

				<!-- Coordinators -->
				<section class="mb-12">
					<h2 class="text-primary mb-4 pb-2 border-b-2 border-secondary">IOEA Coordinators</h2>
					<p class="mb-4">
						As coordination and communication challenges are crucial for the organization of such an international network
						and regular set of events, IOEA is also critically depending upon the professionalism and personal involvement
						of those responsible for the organizational, administrative, and logistic coordination of the academy.
					</p>
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-6">
						{#each coordinators as coord}
							<div class="text-center group">
								<div class="w-[110px] h-auto mx-auto mb-4 bg-white rounded-md overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 relative after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:via-transparent after:to-primary/10 after:opacity-0 group-hover:opacity-100 after:transition-opacity after:duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1),0_0_0_3px_var(--color-secondary)]">
									<img src={coord.photo} alt={coord.name} class="w-full h-auto block transition-transform duration-300 group-hover:scale-103" onerror={(e) => { e.currentTarget.src = '/images/placeholder-person.jpg'; }} />
								</div>
								<div>
									<strong class="block text-primary text-sm transition-colors duration-200 group-hover:text-secondary-dark">{coord.name}</strong>
									<span class="inline-block text-xs text-text-light mt-1 px-2 py-0.5 bg-bg-alt rounded-full">{coord.years}</span>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Seminar Chairs -->
				<section class="mb-12">
					<h2 class="text-primary mb-4 pb-2 border-b-2 border-secondary">Seminar Chairs</h2>
					<p class="mb-4">
						Seminars chairs play a key role in the organization and the proper functioning of IOEA.
						During the spring session, they chair the daily seminars organized around the participants' presentation,
						discuss their paper or their research project and ensure the dynamism and the quality of the exchanges
						among the participants, and between them and the faculties lecturers and workshops organizers.
					</p>
					<p class="mb-4">
						Before the conference, they collegially manage the selection process of participants and the constitution
						of seminars' group, thereby guaranteeing the quality of the academy. They are also active member of the IOEA
						network that organizes on a regular basis conferences and workshops, and manages cooperative research projects.
					</p>
					<p class="mb-4">
						All members of this organization team hold a PhD. They either have academic positions or work as economist
						for regulatory authorities. Most of the time, they are themselves IOEA alumni.
					</p>

					{#if data.chairs.length > 0}
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
							{#each data.chairs as chair}
								<div class="text-center">
									<div class="aspect-square overflow-hidden bg-bg-alt rounded-lg mb-2">
										{#if chair.photo}
											<img
												src={`/images/semchairs/${chair.photo}`}
												alt="{chair.firstName} {chair.lastName}"
												class="w-full h-full object-cover"
												onerror={(e) => { e.currentTarget.src = '/images/placeholder-person.jpg'; }}
											/>
										{:else}
											<div class="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-semibold">
												{chair.firstName[0]}{chair.lastName[0]}
											</div>
										{/if}
									</div>
									<div class="text-sm">
										{#if chair.website}
											<a href={chair.website} target="_blank" rel="noopener" class="text-primary no-underline transition-colors duration-200 hover:text-secondary">
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
						<p class="text-center py-12 bg-bg-alt rounded-lg text-text-light">Seminar chairs information is not available at this time.</p>
					{/if}
				</section>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


