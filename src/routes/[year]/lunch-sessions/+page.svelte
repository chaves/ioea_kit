<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	interface Props {
		data: {
			year: number;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Lunch Sessions - IOEA {data.year}</title>
</svelte:head>

<PageHeader title="Lunch Sessions - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<p class="lead">
					Lunch sessions provide informal opportunities for discussion and networking
					during the IOEA program.
				</p>

				<div class="content">
					<h2>About Lunch Sessions</h2>
					<p>
						The lunch sessions complement the formal program by offering:
					</p>
					<ul>
						<li>Informal presentations by faculty on emerging topics</li>
						<li>Q&A sessions with lecturers</li>
						<li>Career development discussions</li>
						<li>Networking opportunities with peers and faculty</li>
					</ul>

					<p>
						These sessions take place during lunch breaks and provide a relaxed
						atmosphere for continued learning and discussion.
					</p>
				</div>

				<div class="info-card">
					<h3>Schedule</h3>
					<p>
						The detailed schedule for lunch sessions will be announced during the program.
						Sessions typically cover topics not addressed in the main lectures and provide
						opportunities for more interactive discussions.
					</p>
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
		font-size: 1.1rem;
		color: var(--color-text-light);
		margin-bottom: 2rem;
	}

	.content h2 {
		margin-bottom: 1rem;
	}

	.content p {
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.content ul {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
	}

	.content li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	.info-card {
		background: var(--color-bg-alt);
		padding: 1.5rem;
		border-radius: 0.5rem;
		margin-top: 2rem;
	}

	.info-card h3 {
		margin-bottom: 1rem;
	}

	.info-card p {
		margin: 0;
		line-height: 1.7;
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

