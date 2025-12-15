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
		<div class="main-grid">
			<div class="main-content">
				<p>
					Having world-class researchers and young scientists for a week in the same place allows multiple informal and bilateral meetings. IOEA allows networking and provide participants and lecturers with multiple occasions to launch co-operative projects.
				</p>
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

	.main-content p {
		font-size: 1.05rem;
		line-height: 1.7;
		margin-bottom: 1rem;
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

