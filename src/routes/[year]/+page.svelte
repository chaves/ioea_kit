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
	const appConfig = $derived(getConfig());

	// Use session number from config (database) if available, otherwise calculate it
	const sessionNumber = $derived(
		appConfig.session.sessionNumber
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
	<meta name="description" content="IOEA {year}, the {sessionNumber}{sessionOrdinal} session of the Institutional and Organizational Economics Academy, {appConfig.session.dateRange} {year} in Corsica, France." />
</svelte:head>

<PageHeader title="IOEA {year}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<h3 class="mb-6 text-2xl font-semibold leading-relaxed text-primary">
					{sessionNumber}<sup class="text-[0.7em] align-super">{sessionOrdinal}</sup> session of the Institutional and Organizational Economics Academy {appConfig.session.dateRange} {year} in Corsica (France)
				</h3>

				{#if appConfig.callIsOpen}
					<div class="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 mb-8 shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-primary/20">
						<div class="text-center">
							<h4 class="mb-3 text-2xl font-bold text-white">
								Applications Now Open for IOEA {year}!
							</h4>
							<p class="mx-auto mb-6 max-w-2xl text-lg text-white/90">
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
							{#if appConfig.deadlines.application}
								<p class="mt-4 text-sm text-white/80">
									Application deadline: <strong class="text-white">{appConfig.deadlines.application}</strong>
								</p>
							{/if}
						</div>
					</div>
				{:else}
					<div class="p-6 mb-8 bg-gray-100 rounded-lg border-l-4 border-gray-400">
						<p class="text-lg font-medium text-gray-700">
							The call for applications is currently closed.
						</p>
					</div>
				{/if}

				<p class="text-[1.05rem] leading-relaxed mb-6">
					Using rigorous methodologies, Institutional and Organizational Economics focuses on the theoretical and empirical analysis of institutions, organizations and contracts, as well as on the conditions under which these arrangements emerge and evolve.
				</p>

				<h4 class="mt-8 mb-4 text-xl font-semibold text-primary">Objectives</h4>
				<ul class="text-[1.05rem] leading-relaxed mb-6 pl-6">
					<li class="mb-2">To promote the use of appropriate methods to analyze governance, structures and dynamics of collectives and communities.</li>
					<li class="mb-2">To provide researchers with up to date synthesis on the evolutions of the research program.</li>
					<li class="mb-2">To develop networking and cooperation among researchers and among their institutions.</li>
				</ul>

				<h4 class="mt-8 mb-4 text-xl font-semibold text-primary">Public</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">Ph.D. students, Post-docs and researchers, in Economics, Management, Political Science, Sociology, Law and other social sciences.</p>

				<h4 class="mt-8 mb-4 text-xl font-semibold text-primary">Program</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">Formal lectures will be given every morning. Each lecture is dedicated to the extensive presentation of the state of the art of the discipline on a specific applied or theoretical topic. Afternoons will be dedicated to workshops devoted either to research questions or methodologies. Seminars, held in the second part of the afternoon, allow the participants to have their work discussed by recognized scholars in the field.</p>

				<h4 class="mt-8 mb-4 text-xl font-semibold text-primary">Lecturers</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">
					{#each data.lecturers as lecturer, index}
						<strong>
							<a href="/{year}/presentation/{lecturer.id}" class="font-semibold no-underline transition-colors duration-200 text-primary hover:text-secondary hover:underline">
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

				<h4 class="mt-8 mb-4 text-xl font-semibold text-primary">Workshop organizers</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">
					{#each data.workshopOrganizers as organizer, index}
						<strong>
							<a href="/{year}/presentation/{organizer.id}" class="font-semibold no-underline transition-colors duration-200 text-primary hover:text-secondary hover:underline">
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

				<h4 class="mt-8 mb-4 text-xl font-semibold text-primary">Director</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">
					<strong>Eric Brousseau</strong> (University Paris-Dauphine - PSL)
				</p>

				<h4 class="mt-8 mb-4 text-xl font-semibold text-primary">Registrations</h4>
				<p class="text-[1.05rem] leading-relaxed mb-6">Attendants will be selected on the basis of their resume, and of a paper or of a presentation of their research program.</p>

				<h4 class="mt-8 mb-4 text-xl font-semibold text-primary">Calendar</h4>
				<p class="text-[1.05rem] leading-relaxed mb-4">
					Applications will be continuously assessed from February 15th until March 15th.
				</p>
				<p class="text-[1.05rem] leading-relaxed mb-6">
					As the number of available positions is limited, early submission of applications is strongly encouraged.
				</p>
				<div class="space-y-4 mb-6">
					<div class="flex items-start gap-4 p-4 bg-bg-alt rounded-lg border-l-4 border-primary">
						<div class="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
								<line x1="16" y1="2" x2="16" y2="6"></line>
								<line x1="8" y1="2" x2="8" y2="6"></line>
								<line x1="3" y1="10" x2="21" y2="10"></line>
							</svg>
						</div>
						<div>
							<p class="font-semibold text-text">Closing date for application</p>
							<p class="text-primary font-bold">{appConfig.deadlines.application}</p>
							<p class="text-sm text-text-light">Earlier application is recommended</p>
						</div>
					</div>
					<div class="flex items-start gap-4 p-4 bg-bg-alt rounded-lg border-l-4 border-secondary">
						<div class="flex-shrink-0 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
								<polyline points="22 4 12 14.01 9 11.01"></polyline>
							</svg>
						</div>
						<div>
							<p class="font-semibold text-text">Notification of acceptance</p>
							<p class="text-secondary font-bold">from Mid-February</p>
						</div>
					</div>
					{#if appConfig.deadlines.registration}
						<div class="flex items-start gap-4 p-4 bg-bg-alt rounded-lg border-l-4 border-primary-dark">
							<div class="flex-shrink-0 w-10 h-10 bg-primary-dark rounded-lg flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
									<circle cx="8.5" cy="7" r="4"></circle>
									<line x1="20" y1="8" x2="20" y2="14"></line>
									<line x1="23" y1="11" x2="17" y2="11"></line>
								</svg>
							</div>
							<div>
								<p class="font-semibold text-text">Closing date for registration</p>
								<p class="text-primary-dark font-bold">{appConfig.deadlines.registration}</p>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

