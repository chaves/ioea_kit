<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';

	interface Props {
		data: {
			year: number;
			chairs: Array<{
				id: number;
				firstName: string;
				lastName: string;
				university: string | null;
				website: string | null;
				photo: string | null;
				bio: string | null;
				groupId: number | null;
			}>;
		};
	}

	let { data }: Props = $props();

	// Group chairs by group
	const chairsByGroup = $derived(() => {
		const groups: Record<number, typeof data.chairs> = {};
		data.chairs.forEach((chair) => {
			const groupId = chair.groupId ?? 0;
			if (!groups[groupId]) {
				groups[groupId] = [];
			}
			groups[groupId].push(chair);
		});
		return groups;
	});
</script>

<SEO
	title="Seminars - IOEA {data.year}"
	description="Research seminars at the IOEA {data.year} session where participants present their work."
/>

<PageHeader title="Seminars - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<p class="text-lg text-text-light mb-8">
					The seminar sessions at IOEA {data.year} provide participants with the opportunity
					to present their research and receive feedback from faculty and peers.
				</p>

				<div class="bg-bg-alt p-6 rounded-lg mb-8">
					<h2 class="mb-4">About the Seminars</h2>
					<p class="m-0 leading-relaxed">
						Participants are organized into small groups, each led by experienced seminar chairs.
						In these sessions, participants present their work-in-progress and receive
						constructive feedback to help advance their research.
					</p>
				</div>

				{#if data.chairs.length > 0}
					<div>
						<h2 class="mb-6">Seminar Chairs</h2>
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
							{#each data.chairs as chair}
								<div class="bg-white rounded-lg border border-border overflow-hidden">
									<div class="aspect-square overflow-hidden bg-bg-alt">
										{#if chair.photo}
											<img
												src={`/images/semchairs/${chair.photo}`}
												alt="{chair.firstName} {chair.lastName}"
												class="w-full h-full object-cover"
												onerror={(e) => e.currentTarget.src = '/images/placeholder-person.jpg'}
											/>
										{:else}
											<div class="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-semibold">
												{chair.firstName[0]}{chair.lastName[0]}
											</div>
										{/if}
									</div>
									<div class="p-4">
										<h3 class="text-base mb-1 m-0">
											{#if chair.website}
												<a href={chair.website} target="_blank" rel="noopener" class="text-primary no-underline hover:text-secondary">
													{chair.firstName} {chair.lastName}
												</a>
											{:else}
												{chair.firstName} {chair.lastName}
											{/if}
										</h3>
										{#if chair.university}
											<p class="text-sm text-text-light m-0 mb-2">{chair.university}</p>
										{/if}
										{#if chair.groupId}
											<span class="inline-block px-3 py-1 bg-secondary text-white text-xs font-semibold rounded-full">Group {chair.groupId}</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<div class="text-center py-12 bg-bg-alt rounded-lg text-text-light">
						<p>Seminar chair information will be available soon.</p>
					</div>
				{/if}
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


