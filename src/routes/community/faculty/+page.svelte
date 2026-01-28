<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	interface Props {
		data: {
			faculty: Array<{
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
	<title>The Faculty | IOEA</title>
	<meta name="description" content="Meet the distinguished faculty members who teach at the Institutional and Organizational Economics Academy." />
</svelte:head>

<PageHeader title="The Faculty" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<article class="content">
					<p class="text-lg sm:text-xl font-medium text-text mb-12 leading-relaxed">
						The IOEA brings together world-renowned scholars in institutional and
						organizational economics. Our faculty members are leaders in their fields,
						with extensive research and teaching experience.
					</p>

					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
						{#each data.faculty as member}
							<div class="bg-white rounded-xl overflow-hidden border border-border shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
								<div class="aspect-square overflow-hidden bg-bg-alt relative">
									{#if member.photo}
									<img
										src={`/images/lec/${member.photo}`}
										alt="{member.firstName} {member.lastName}"
										class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										onerror={(e) => {
											const img = e.currentTarget as HTMLImageElement;
											img.src = '/images/placeholder-person.jpg';
										}}
									/>
									{:else}
										<div class="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-bold">
											{member.firstName[0]}{member.lastName[0]}
										</div>
									{/if}
									<div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</div>
								<div class="p-4">
									<h3 class="text-base font-bold mb-1.5 leading-tight">
										{#if member.website}
											<a href={member.website} target="_blank" rel="noopener" class="text-primary hover:text-secondary transition-colors no-underline">
												{member.firstName} {member.lastName}
											</a>
										{:else}
											<span class="text-text">{member.firstName} {member.lastName}</span>
										{/if}
									</h3>
									{#if member.institution}
										<p class="text-xs font-medium text-text-light m-0 leading-snug line-clamp-2">{member.institution}</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>

					{#if data.faculty.length === 0}
						<div class="text-center py-20 bg-bg-alt rounded-2xl border-2 border-dashed border-border mt-8">
							<p class="text-text-light text-lg italic m-0">Faculty information will be available soon.</p>
						</div>
					{/if}
				</article>
			</div>

			<aside class="sticky top-[100px] self-start lg:static">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

