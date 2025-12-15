<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { config } from '$lib/config';

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

	const sessionNumber = data.year - 2002 + 1;
	const sessionOrdinal = sessionNumber === 22 ? 'nd' : sessionNumber === 21 ? 'st' : sessionNumber === 23 ? 'rd' : 'th';
</script>

<svelte:head>
	<title>IOEA {data.year} - the {sessionNumber}{sessionOrdinal} session of the Institutional and Organizational Economics Academy</title>
	<meta name="description" content="IOEA {data.year}, the {sessionNumber}{sessionOrdinal} session of the Institutional and Organizational Economics Academy, 12-16 May {data.year} in Corsica, France." />
</svelte:head>

<PageHeader title="IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<h3 class="session-title">
					{sessionNumber}<sup>{sessionOrdinal}</sup> session of the Institutional and Organizational Economics Academy 12-16 May {data.year} in Corsica (France)
				</h3>

				{#if !config.callIsOpen}
					<p class="call-status">The call for applications is closed.</p>
				{/if}

				<p>
					Using rigorous methodologies, Institutional and Organizational Economics focuses on the theoretical and empirical analysis of institutions, organizations and contracts, as well as on the conditions under which these arrangements emerge and evolve.
				</p>

				<h4>Objectives</h4>
				<ul>
					<li>To promote the use of appropriate methods to analyze governance, structures and dynamics of collectives and communities.</li>
					<li>To provide researchers with up to date synthesis on the evolutions of the research program.</li>
					<li>To develop networking and cooperation among researchers and among their institutions.</li>
				</ul>

				<h4>Public</h4>
				<p>Ph.D. students, Post-docs and researchers, in Economics, Management, Political Science, Sociology, Law and other social sciences.</p>

				<h4>Program</h4>
				<p>Formal lectures will be given every morning. Each lecture is dedicated to the extensive presentation of the state of the art of the discipline on a specific applied or theoretical topic. Afternoons will be dedicated to workshops devoted either to research questions or methodologies. Seminars, held in the second part of the afternoon, allow the participants to have their work discussed by recognized scholars in the field.</p>

				<h4>Lecturers</h4>
				<p>
					{#each data.lecturers as lecturer, index}
						<strong>
							<a href="/{data.year}/presentation/{lecturer.id}" class="lecturer-link">
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

				<h4>Workshop organizers</h4>
				<p>
					{#each data.workshopOrganizers as organizer, index}
						<strong>
							<a href="/{data.year}/presentation/{organizer.id}" class="organizer-link">
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

				<h4>Director</h4>
				<p>
					<strong>Eric Brousseau</strong> (University Paris-Dauphine - PSL)
				</p>

				<h4>Registrations</h4>
				<p>Attendants will be selected on the basis of their resume, and of a paper or of a presentation of their research program.</p>

				<h4>Calendar</h4>
				<p>There are three deadlines for applications. As capacity is limited, we recommend that you do not wait until the last date to apply in order to have the best chance of being accepted.</p>
				<ul>
					<li>
						Closing dates for application:
						<ul>
							<li class:strikethrough={!config.applicationDeadlines.first.active}>
								{config.applicationDeadlines.first.date} - Notification of acceptance on {config.applicationDeadlines.first.notificationDate}
							</li>
							<li class:strikethrough={!config.applicationDeadlines.second.active}>
								{config.applicationDeadlines.second.date} - Notification of acceptance on {config.applicationDeadlines.second.notificationDate}
							</li>
						</ul>
					</li>
					<li class:strikethrough={!config.registrationDeadline.active}>
						Closing date for registration: {config.registrationDeadline.date}
					</li>
				</ul>
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

	.session-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: var(--color-primary);
		line-height: 1.6;
	}

	.session-title sup {
		font-size: 0.7em;
		vertical-align: super;
	}

	.call-status {
		font-size: 1.1rem;
		font-weight: 500;
		color: var(--color-text);
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
	}

	h4 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: var(--color-primary);
	}

	p {
		font-size: 1.05rem;
		line-height: 1.7;
		margin-bottom: 1.5rem;
	}

	ul {
		font-size: 1.05rem;
		line-height: 1.7;
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
	}

	ul ul {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	.lecturer-link,
	.organizer-link {
		color: var(--color-primary);
		text-decoration: none;
		font-weight: 600;
		transition: color 0.2s ease;
	}

	.lecturer-link:hover,
	.organizer-link:hover {
		color: var(--color-secondary);
		text-decoration: underline;
	}

	.strikethrough {
		text-decoration: line-through;
		opacity: 0.6;
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
