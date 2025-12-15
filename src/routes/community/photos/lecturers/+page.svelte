<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	interface Props {
		data: {
			lecturers: Array<{
				id: number;
				firstName: string;
				lastName: string;
				institution: string | null;
				website: string | null;
				photo: string | null;
			}>;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Lecturers & Organizers | IOEA Community</title>
	<meta name="description" content="Photos of lecturers and organizers who have taught at the Institutional and Organizational Economics Academy." />
</svelte:head>

<PageHeader title="Lecturers & Organizers" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<p class="text-lg leading-relaxed mb-8 text-text-light">
					Meet the distinguished lecturers and workshop organizers who have contributed to the IOEA over the years.
				</p>

				{#if data.lecturers.length > 0}
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
						{#each data.lecturers as lecturer}
							<div class="bg-white rounded-lg overflow-hidden border border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
								<div class="aspect-square overflow-hidden bg-bg-alt">
									{#if lecturer.photo}
										<img
											src={`/images/lec/${lecturer.photo}`}
											alt="{lecturer.firstName} {lecturer.lastName}"
											class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
											onerror={(e) => { e.currentTarget.src = '/images/placeholder-person.jpg'; }}
										/>
									{:else}
										<div class="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-semibold">
											{lecturer.firstName[0]}{lecturer.lastName[0]}
										</div>
									{/if}
								</div>
								<div class="p-4">
									<h3 class="text-base mb-1 m-0">
										{#if lecturer.website}
											<a href={lecturer.website} target="_blank" rel="noopener" class="text-primary no-underline transition-colors duration-200 hover:text-secondary">
												{lecturer.firstName} {lecturer.lastName}
											</a>
										{:else}
											{lecturer.firstName} {lecturer.lastName}
										{/if}
									</h3>
									{#if lecturer.institution}
										<p class="text-sm text-text-light m-0">{lecturer.institution}</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-center py-12 bg-bg-alt rounded-lg text-text-light">No lecturer photos available.</p>
				{/if}
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar showPhotos={false} />
			</aside>
		</div>
	</div>
</section>

