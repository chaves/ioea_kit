<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	const researchAreas = [
		'Organization Studies',
		'Industrial Organization, Business and Strategy',
		'Innovation and Entrepreneurship',
		'Natural Resources and Environment',
		'Public Economic, Public Choice and Public Management',
		'Law and Economics',
		'Political Economy',
		'Development and Transition Economics, Economic History'
	];
</script>

<svelte:head>
	<title>Research Areas | IOEA</title>
	<meta name="description" content="Explore the wide variety of research themes covered by the Institutional and Organizational Economics Academy." />
</svelte:head>

<PageHeader title="A Wide Variety of Themes" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">

				<article class="content">
					<p class="lead">
						The IOE is characterized by a multi-disciplinary approach, and as a consequence,
						by reliance on multiple scientific methodologies (case studies, econometrics,
						field experiments, experimental economics, etc.) as well as a diversity of
						analytical frameworks.
					</p>

					<p>
						Its field is composed of a wide range of approaches which creates synergies
						and complementarities: economics and organizational sociology, historical and
						institutional dynamics analysis, formal and informal coordination mechanisms
						analysis, public-private relations analysis, etc.
					</p>

					<p>
						The ability to mobilize for one week international specialists of these themes
						provides a unique opportunity to spread research works and to give the students
						a chance to benefit from top researchers' experience through lectures and interactions.
					</p>

					<h2>Main Research Fields</h2>

					<p>Over the years, the main fields covered by the lectures and workshops have been:</p>

					<ul class="research-list">
						{#each researchAreas as area}
							<li>{area}</li>
						{/each}
					</ul>

					<p class="note">
						That said the school also hosted talks in finance, labor economics and human
						resource management, history of economic thought and methodology, etc.
					</p>
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

	.content p {
		line-height: 1.7;
		margin-bottom: 1.25rem;
	}

	.lead {
		font-size: 1.2rem;
		color: var(--color-text-light);
		margin-bottom: 1.5rem;
		line-height: 1.7;
	}

	.content h2 {
		color: var(--color-primary);
		margin: 2rem 0 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.research-list {
		background: var(--color-bg-alt);
		padding: 1.5rem 1.5rem 1.5rem 2.5rem;
		border-radius: 0.5rem;
		margin: 1.5rem 0;
		border-left: 4px solid var(--color-secondary);
	}

	.research-list li {
		padding: 0.5rem 0;
		color: var(--color-text);
		font-weight: 500;
	}

	.research-list li::marker {
		color: var(--color-secondary);
	}

	.note {
		font-style: italic;
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

