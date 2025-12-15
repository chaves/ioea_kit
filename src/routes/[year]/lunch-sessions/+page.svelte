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
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<p class="text-lg text-text-light mb-8">
					Lunch sessions provide informal opportunities for discussion and networking
					during the IOEA program.
				</p>

				<div>
					<h2 class="mb-4">About Lunch Sessions</h2>
					<p class="leading-loose mb-4">
						The lunch sessions complement the formal program by offering:
					</p>
					<ul class="mb-6 pl-6">
						<li class="mb-2 leading-relaxed">Informal presentations by faculty on emerging topics</li>
						<li class="mb-2 leading-relaxed">Q&A sessions with lecturers</li>
						<li class="mb-2 leading-relaxed">Career development discussions</li>
						<li class="mb-2 leading-relaxed">Networking opportunities with peers and faculty</li>
					</ul>

					<p class="leading-loose mb-4">
						These sessions take place during lunch breaks and provide a relaxed
						atmosphere for continued learning and discussion.
					</p>
				</div>

				<div class="bg-bg-alt p-6 rounded-lg mt-8">
					<h3 class="mb-4">Schedule</h3>
					<p class="m-0 leading-loose">
						The detailed schedule for lunch sessions will be announced during the program.
						Sessions typically cover topics not addressed in the main lectures and provide
						opportunities for more interactive discussions.
					</p>
				</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


