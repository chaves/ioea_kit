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
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<article>
					<p class="text-xl text-text-light mb-6 leading-relaxed">
						The IOE is characterized by a multi-disciplinary approach, and as a consequence,
						by reliance on multiple scientific methodologies (case studies, econometrics,
						field experiments, experimental economics, etc.) as well as a diversity of
						analytical frameworks.
					</p>

					<p class="leading-relaxed mb-5">
						Its field is composed of a wide range of approaches which creates synergies
						and complementarities: economics and organizational sociology, historical and
						institutional dynamics analysis, formal and informal coordination mechanisms
						analysis, public-private relations analysis, etc.
					</p>

					<p class="leading-relaxed mb-5">
						The ability to mobilize for one week international specialists of these themes
						provides a unique opportunity to spread research works and to give the students
						a chance to benefit from top researchers' experience through lectures and interactions.
					</p>

					<h2 class="text-primary my-8 mb-4 pb-2 border-b-2 border-secondary">Main Research Fields</h2>

					<p class="mb-5">Over the years, the main fields covered by the lectures and workshops have been:</p>

					<ul class="bg-bg-alt py-6 px-6 pl-10 rounded-lg my-6 border-l-4 border-secondary">
						{#each researchAreas as area}
							<li class="py-2 text-text font-medium">{area}</li>
						{/each}
					</ul>

					<p class="italic text-text-light mb-0">
						That said the school also hosted talks in finance, labor economics and human
						resource management, history of economic thought and methodology, etc.
					</p>
				</article>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


