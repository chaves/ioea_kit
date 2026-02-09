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

				<div class="mb-12 text-lg sm:text-xl font-medium text-text leading-relaxed">
					<p>
						IOEA could not be possible without the precious work of a strong, close-knit and competent organization team.
						This organization team is composed of the director, the academy's coordinators and the seminars chairs.
					</p>
				</div>

				<!-- Director -->
				<section class="mb-16">
					<h2 class="text-primary text-2xl mb-8 pb-3 border-b-2 border-secondary font-bold">Director</h2>
						<div class="flex gap-10 bg-white p-10 rounded-2xl border border-border shadow-md hover:shadow-2xl transition-all duration-300 group flex-col sm:flex-row sm:text-left text-center sm:items-start items-center">
							<div class="flex-shrink-0 w-[180px] h-auto overflow-hidden rounded-xl shadow-lg transition-all duration-300 relative group-hover:scale-105 group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-secondary/20">
								<img
									src="/images/organizers/eric.jpg"
									alt="Eric Brousseau"
									class="w-full h-auto block"
									onerror={(e) => {
										(e.currentTarget as HTMLImageElement).style.display = 'none';
									}}
								/>
							</div>
							<div class="flex-1">
								<h3 class="mb-4 text-primary text-3xl font-bold transition-colors duration-200 group-hover:text-secondary-dark">Eric Brousseau</h3>
								<div class="text-base sm:text-lg leading-relaxed text-text space-y-4">
								<p>
									Professor of Economics and Management at the <a href="http://www.dauphine.fr/" class="text-link font-bold">University Paris-Dauphine</a>.
									He is the scientific director of the <a href="http://chairgovreg.fondation-dauphine.fr/" class="text-link font-bold">Chair Governance and Regulation</a>
									and a past-president of <a href="http://www.sioe.org/" class="text-link font-bold">SIOE</a>.
								</p>
								<p>
									He initiated IOEA — at that time the European School for New Institutional Economics (ESNIE) — in 2002
									and has been running this event and the related network since then.
								</p>
								<p class="mt-6">
									<a href="http://www.brousseau.info" class="inline-flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
										www.brousseau.info
									</a>
								</p>
							</div>
						</div>
					</div>
				</section>

				<!-- Coordinators -->
				<section class="mb-16">
					<h2 class="text-primary text-2xl mb-8 pb-3 border-b-2 border-secondary font-bold">IOEA Coordinators</h2>
					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-8 text-text">
						As coordination and communication challenges are crucial for the organization of such an international network
						and regular set of events, IOEA is also critically depending upon the professionalism and personal involvement
						of those responsible for the organizational, administrative, and logistic coordination of the academy.
					</p>
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-10">
							{#each coordinators as coord}
								<div class="text-center group">
									<div class="w-[120px] h-[120px] mx-auto mb-4 bg-white rounded-full overflow-hidden shadow-md transition-all duration-300 border-4 border-white group-hover:border-secondary/30 group-hover:scale-110 group-hover:shadow-xl">
										<img
											src={coord.photo}
											alt={coord.name}
											class="w-full h-full object-cover"
											onerror={(e) => {
												(e.currentTarget as HTMLImageElement).src = '/images/placeholder-person.jpg';
											}}
										/>
									</div>
									<div>
										<strong class="block text-primary text-base font-bold transition-colors duration-200 group-hover:text-secondary-dark">{coord.name}</strong>
										<span class="inline-block text-xs font-bold uppercase tracking-wider text-text-light mt-2 px-3 py-1 bg-bg-alt rounded-full border border-border">{coord.years}</span>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Seminar Chairs -->
				<section class="mb-12">
					<h2 class="text-primary text-2xl mb-8 pb-3 border-b-2 border-secondary font-bold">Seminar Chairs</h2>
					<div class="text-base sm:text-[1.05rem] leading-relaxed text-text space-y-4 mb-10">
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
					</div>

					{#if data.chairs.length > 0}
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10">
							{#each data.chairs as chair}
								<div class="text-center group">
									<div class="aspect-square overflow-hidden bg-bg-alt rounded-xl mb-3 shadow-sm border-2 border-transparent transition-all duration-300 group-hover:border-secondary group-hover:shadow-lg group-hover:-translate-y-1">
											{#if chair.photo}
												<img
													src={`/images/semchairs/${chair.photo}`}
													alt="{chair.firstName} {chair.lastName}"
													class="w-full h-full object-cover"
													onerror={(e) => {
														(e.currentTarget as HTMLImageElement).src = '/images/placeholder-person.jpg';
													}}
												/>
											{:else}
												<div class="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-bold">
													{chair.firstName[0]}{chair.lastName[0]}
											</div>
										{/if}
									</div>
									<div class="text-base font-bold">
										{#if chair.website}
											<a href={chair.website} target="_blank" rel="noopener" class="text-primary no-underline transition-colors duration-200 hover:text-secondary hover:underline">
												{chair.firstName} {chair.lastName}
											</a>
										{:else}
											<span class="text-text">{chair.firstName} {chair.lastName}</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-center py-16 bg-bg-alt rounded-2xl text-text-light text-lg italic border-2 border-dashed border-border">Seminar chairs information is not available at this time.</p>
					{/if}
				</section>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

