<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
	<title>Organization | IOEA</title>
	<meta name="description" content="Learn about how the IOEA is organized: lectures, workshops, seminars, and networking opportunities." />
</svelte:head>

<PageHeader title="Organization" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">

				<article class="content">
					<div class="org-section first">
						<h2>Lectures</h2>
						<p>
							Each morning features two lectures by internationally renowned researchers,
							covering broad subjects within IOE. Lecturers provide summaries of existing
							literature, discuss main research questions, and explore implications for
							public policies.
						</p>
						<p>
							Topics include institutions and economic growth, economics of formal and
							informal contracts, economics of organizations, and theories of institutional changes.
						</p>
					</div>

					<div class="org-section">
						<h2>Workshops</h2>
						<p>
							Afternoon sessions consist of two parallel workshops, allowing participants
							to choose based on their interests:
						</p>

						<div class="workshop-types">
							<div class="workshop-card">
								<h3>Thematic Workshops</h3>
								<p>
									Focus on specific research questions, presenting recent developments,
									controversies, and debates within a single theme, such as the economics
									of relational contracts. These workshops facilitate in-depth discussions
									and knowledge sharing.
								</p>
							</div>

							<div class="workshop-card">
								<h3>Methodology Workshops</h3>
								<p>
									Concentrate on particular techniques, aiming to familiarize students
									with specific methods applicable to their research. Examples include
									experimental economics, econometrics of contracts, and qualitative
									case study techniques.
								</p>
							</div>
						</div>
					</div>

					<div class="org-section">
						<h2>Thesis Seminars</h2>
						<p>
							Evening sessions are dedicated to seminars where participants present their
							research projects or working papers. These sessions foster collective discussions,
							with feedback from peers and faculty members, enhancing the quality and direction
							of individual research.
						</p>
					</div>

					<div class="org-section">
						<h2>Lunch Sessions</h2>
						<p>
							Introduced in 2012, these short sessions from Tuesday to Friday address key
							aspects of academic life, such as journal submission processes, job markets,
							and non-academic careers. Participants engage in discussions with experienced
							scholars, gaining valuable insights into professional development.
						</p>
					</div>

					<div class="org-section">
						<h2>Informal Interactions</h2>
						<p>
							Beyond formal sessions, IOEA emphasizes informal interactions between participants
							and faculty. The academy organizes events to encourage networking, fostering
							collaborations that often lead to joint research projects and publications.
						</p>
						<p>
							This network effect has resulted in numerous scientific collaborations among participants.
						</p>
					</div>

					<div class="org-section sponsors-cta">
						<a href="/sponsors" class="btn btn-secondary">View Our Sponsors</a>
					</div>
				</article>
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

	.content h2 {
		color: var(--color-primary);
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.content p {
		font-size: 1.05rem;
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.org-section {
		margin-top: 2.5rem;
		padding-top: 2rem;
		border-top: 1px solid var(--color-border);
	}

	.org-section.first {
		margin-top: 0;
		padding-top: 0;
		border-top: none;
	}

	.org-section h3 {
		margin-bottom: 0.75rem;
		color: var(--color-secondary-dark);
	}

	.workshop-types {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	.workshop-card {
		background: var(--color-bg-alt);
		padding: 1.5rem;
		border-radius: 0.5rem;
		border-left: 4px solid var(--color-secondary);
	}

	.workshop-card h3 {
		font-size: 1.1rem;
		margin-bottom: 0.75rem;
	}

	.workshop-card p {
		font-size: 0.95rem;
		margin: 0;
	}

	.sponsors-cta {
		text-align: center;
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

	@media (max-width: 767px) {
		.workshop-types {
			grid-template-columns: 1fr;
		}
	}
</style>

