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
	<title>Meetings - IOEA {data.year}</title>
</svelte:head>

<PageHeader title="Bilateral and Informal Meetings - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<p class="text-lg sm:text-xl font-medium text-text leading-relaxed mb-10">
					Having world-class researchers and young scientists for a week in the same place allows multiple informal and bilateral meetings. IOEA allows networking and provide participants and lecturers with multiple occasions to launch co-operative projects.
				</p>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

