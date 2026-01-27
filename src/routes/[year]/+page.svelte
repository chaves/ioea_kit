<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { getConfig, staticConfig } from '$lib/config';

	interface Props {
		data: {
			year: number;
			isCurrent: boolean;
			lecturers: Array<{
				id: number;
				firstName: string;
				lastName: string;
				institution: string;
			}>;
			workshopOrganizers: Array<{
				id: number;
				firstName: string;
				lastName: string;
				institution: string;
			}>;
		};
	}

	let { data }: Props = $props();
	const year = $derived(data.year);
	const config = $derived(getConfig());

	// Use session number from config (database) if available, otherwise calculate it
	const sessionNumber = $derived(
		config.session.sessionNumber || staticConfig.sessionNumber
	);
	
	// Calculate ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
	function getOrdinal(num: number): string {
		const lastDigit = num % 10;
		const lastTwoDigits = num % 100;
		
		// Handle special cases: 11th, 12th, 13th (not 11st, 12nd, 13rd)
		if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
			return 'th';
		}
		
		// Handle regular cases
		if (lastDigit === 1) return 'st';
		if (lastDigit === 2) return 'nd';
		if (lastDigit === 3) return 'rd';
		return 'th';
	}
	
	const sessionOrdinal = $derived(getOrdinal(sessionNumber));
</script>

<svelte:head>
	<title>IOEA {year} - the {sessionNumber}{sessionOrdinal} session of the Institutional and Organizational Economics Academy</title>
	<meta name="description" content="IOEA {year}, the {sessionNumber}{sessionOrdinal} session of the Institutional and Organizational Economics Academy, {config.session.dateRange} {year} in Corsica, France." />
</svelte:head>

<PageHeader title="IOEA {year}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<h3 class="text-2xl font-semibold mb-6 text-primary leading-relaxed">
					{sessionNumber}<sup class="text-[0.7em] align-super">{sessionOrdinal}</sup> session of the Institutional and Organizational Economics Academy {config.session.dateRange} {year} in Corsica (France)
				</h3>

				{#if config.callIsOpen}
					<div class="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 mb-8 shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-primary/20">
						<div class="text-center">
							<h4 class="text-2xl font-bold text-white mb-3">
								Applications Now Open for IOEA {year}!
							</h4>
							<p class="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
								Join us for an intensive week of lectures, workshops, and seminars with leading scholars in Institutional and Organizational Economics.
							</p>
							<a
								href="/call"
								class="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:scale-105 transition-all duration-200 no-underline"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
									<polyline points="14 2 14 8 20 8"></polyline>
									<line x1="16" y1="13" x2="8" y2="13"></line>
									<line x1="16" y1="17" x2="8" y2="17"></line>
									<polyline points="10 9 9 9 8 9"></polyline>
								</svg>
								Submit Your Application
							</a>
							{#if config.deadlines.application}
								<p class="text-white/80 text-sm mt-4">
									Application deadline: <strong class="text-white">{config.deadlines.application}</strong>
								</p>
							{/if}
						</div>
					</div>
				{:else}
					<div class="bg-gray-100 border-l-4 border-gray-400 p-6 mb-8 rounded-lg">
						<p class="text-lg font-medium text-gray-700">
							The call for applications is currently closed.
						</p>
					</div>
				{/if}

				<p class="text-[1.05rem] leading-relaxed mb-6">
					Using rigorous methodologies, Institutional and Organizational Economics focuses on the theoretical and empirical analysis of institutions, organizations and contracts, as well as on the conditions under which these arrangements emerge and evolve.
				</p>

				<h4 class="text-xl font-semibold mt-8 mb-4 text-primary">Objectives</h4>
				<ul class="text-[1.05rem] leading-relaxed mb-6 pl-6">
					<li class="mb-2">To promote the use of appropriate methods to analyze governance, structures and dynamics of collectives and communities.</li>
					<li class="mb-2">To provide researchers with up to date synthesis on the evolutions of the research program.</li>
					<li class="mb-2">To develop networking and cooperation among researchers and among their institutions.</li>
				</ul>

				<h4 class="text-xl font-semibold mt-8 mb-4 text-primary">Public</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">Ph.D. students, Post-docs and researchers, in Economics, Management, Political Science, Sociology, Law and other social sciences.</p>

				<h4 class="text-xl font-semibold mt-8 mb-4 text-primary">Program</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">Formal lectures will be given every morning. Each lecture is dedicated to the extensive presentation of the state of the art of the discipline on a specific applied or theoretical topic. Afternoons will be dedicated to workshops devoted either to research questions or methodologies. Seminars, held in the second part of the afternoon, allow the participants to have their work discussed by recognized scholars in the field.</p>

				<h4 class="text-xl font-semibold mt-8 mb-4 text-primary">Lecturers</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">
					{#each data.lecturers as lecturer, index}
						<strong>
							<a href="/{year}/presentation/{lecturer.id}" class="text-primary font-semibold no-underline transition-colors duration-200 hover:text-secondary hover:underline">
								{lecturer.firstName} {lecturer.lastName}
							</a>
						</strong>
						{#if lecturer.institution}
							({lecturer.institution}){index < data.lecturers.length - 1 ? ',' : '.'}
						{/if}
						{#if index < data.lecturers.length - 1}
							{' '}
						{/if}
					{/each}
				</p>

				<h4 class="text-xl font-semibold mt-8 mb-4 text-primary">Workshop organizers</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">
					{#each data.workshopOrganizers as organizer, index}
						<strong>
							<a href="/{year}/presentation/{organizer.id}" class="text-primary font-semibold no-underline transition-colors duration-200 hover:text-secondary hover:underline">
								{organizer.firstName} {organizer.lastName}
							</a>
						</strong>
						{#if organizer.institution}
							({organizer.institution}){index < data.workshopOrganizers.length - 1 ? ',' : '.'}
						{/if}
						{#if index < data.workshopOrganizers.length - 1}
							{' '}
						{/if}
					{/each}
				</p>

				<h4 class="text-xl font-semibold mt-8 mb-4 text-primary">Director</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">
					<strong>Eric Brousseau</strong> (University Paris-Dauphine - PSL)
				</p>

				<h4 class="text-xl font-semibold mt-8 mb-4 text-primary">Registrations</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">Attendants will be selected on the basis of their resume, and of a paper or of a presentation of their research program.</p>

				<h4 class="text-xl font-semibold mt-8 mb-4 text-primary">Calendar</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">As capacity is limited, we recommend that you apply early to have the best chance of being accepted.</p>
				<ul class="text-[1.05rem] leading-relaxed mb-6 pl-6">
					<li class="mb-2">
						Closing date for application: <strong>{config.deadlines.application}</strong>
						{#if config.deadlines.notification}
							<br />Notification of acceptance: {config.deadlines.notification}
						{/if}
					</li>
					{#if config.deadlines.registration}
						<li class="mb-2">
							Closing date for registration: <strong>{config.deadlines.registration}</strong>
						</li>
					{/if}
				</ul>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

