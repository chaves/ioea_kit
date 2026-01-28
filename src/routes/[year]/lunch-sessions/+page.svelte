<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';

	interface Props {
		data: {
			year: number;
		};
	}

	let { data }: Props = $props();
</script>

<SEO
	title="Lunch Sessions - IOEA {data.year}"
	description="Information about the informal lunch sessions and networking opportunities during IOEA {data.year}."
/>

<PageHeader title="Lunch Sessions - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<p class="text-lg sm:text-xl font-medium text-text mb-10 leading-relaxed">
					Lunch sessions provide informal opportunities for discussion and networking
					during the IOEA program.
				</p>

				<article>
					<h2 class="text-primary text-2xl mb-6 pb-2 border-b-2 border-secondary font-bold">About Lunch Sessions</h2>
					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-6 text-text">
						The lunch sessions complement the formal program by offering:
					</p>
					<ul class="mb-8 pl-6 space-y-3 text-base sm:text-[1.05rem] text-text">
						<li class="pl-2 leading-relaxed font-medium"><span class="text-secondary mr-2">•</span> Informal presentations by faculty on emerging topics</li>
						<li class="pl-2 leading-relaxed font-medium"><span class="text-secondary mr-2">•</span> Q&A sessions with lecturers</li>
						<li class="pl-2 leading-relaxed font-medium"><span class="text-secondary mr-2">•</span> Career development discussions</li>
						<li class="pl-2 leading-relaxed font-medium"><span class="text-secondary mr-2">•</span> Networking opportunities with peers and faculty</li>
					</ul>

					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-10 text-text">
						These sessions take place during lunch breaks and provide a relaxed
						atmosphere for continued learning and discussion.
					</p>
				</article>

				<div class="bg-bg-alt p-8 rounded-2xl border border-border shadow-inner mt-10">
					<h3 class="text-xl font-bold text-primary mb-4 flex items-center gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
						Schedule
					</h3>
					<p class="text-base sm:text-[1.05rem] m-0 leading-relaxed text-text font-medium">
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


