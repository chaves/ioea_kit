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
				<p class="text-lg sm:text-xl font-medium text-text mb-10 leading-relaxed">
					Meet the distinguished lecturers and workshop organizers who have contributed to the IOEA over the years.
				</p>

				{#if data.lecturers.length > 0}
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
						{#each data.lecturers as lecturer}
							<div class="bg-white rounded-xl overflow-hidden border border-border shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
								<div class="aspect-square overflow-hidden bg-bg-alt relative">
										{#if lecturer.photo}
											<img
												src={`/images/lec/${lecturer.photo}`}
												alt="{lecturer.firstName} {lecturer.lastName}"
												class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
												onerror={(e) => {
													(e.currentTarget as HTMLImageElement).src = '/images/placeholder-person.jpg';
												}}
											/>
										{:else}
											<div class="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-bold">
												{lecturer.firstName[0]}{lecturer.lastName[0]}
										</div>
									{/if}
									<div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</div>
								<div class="p-4">
									<h3 class="text-base font-bold mb-1.5 leading-tight">
										{#if lecturer.website}
											<a href={lecturer.website} target="_blank" rel="noopener" class="text-primary no-underline transition-colors duration-200 hover:text-secondary">
												{lecturer.firstName} {lecturer.lastName}
											</a>
										{:else}
											<span class="text-text">{lecturer.firstName} {lecturer.lastName}</span>
										{/if}
									</h3>
									{#if lecturer.institution}
										<p class="text-xs font-medium text-text-light m-0 line-clamp-2">{lecturer.institution}</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-20 bg-bg-alt rounded-2xl border-2 border-dashed border-border">
						<p class="text-text-light text-lg italic m-0">No lecturer photos available.</p>
					</div>
				{/if}
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar showPhotos={false} />
			</aside>
		</div>
	</div>
</section>
