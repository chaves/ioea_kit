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
					<p class="text-lg sm:text-xl font-medium text-text leading-relaxed mb-8">
						The IOE is characterized by a multi-disciplinary approach, and as a consequence,
						by reliance on multiple scientific methodologies (case studies, econometrics,
						field experiments, experimental economics, etc.) as well as a diversity of
						analytical frameworks.
					</p>

					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-6 text-text">
						Its field is composed of a wide range of approaches which creates synergies
						and complementarities: economics and organizational sociology, historical and
						institutional dynamics analysis, formal and informal coordination mechanisms
						analysis, public-private relations analysis, etc.
					</p>

					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-6 text-text">
						The ability to mobilize for one week international specialists of these themes
						provides a unique opportunity to spread research works and to give the students
						a chance to benefit from top researchers' experience through lectures and interactions.
					</p>

					<h2 class="text-primary mt-12 mb-6 pb-2 border-b-2 border-secondary text-2xl">Main Research Fields</h2>

					<p class="text-base sm:text-[1.05rem] mb-6">Over the years, the main fields covered by the lectures and workshops have been:</p>

					<ul class="bg-bg-alt py-8 px-8 pl-12 rounded-lg my-8 border-l-4 border-secondary shadow-sm">
						{#each researchAreas as area}
							<li class="py-2.5 text-text font-medium text-[1.05rem]">{area}</li>
						{/each}
					</ul>

					<p class="italic text-text-light text-base mt-8 leading-relaxed">
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


