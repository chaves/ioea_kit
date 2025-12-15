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
					<p class="text-xl text-[var(--color-text-light)] mb-8 leading-[1.7]">
						The IOEA brings together world-renowned scholars in institutional and
						organizational economics. Our faculty members are leaders in their fields,
						with extensive research and teaching experience.
					</p>

					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
						{#each data.faculty as member}
							<div class="bg-white rounded-lg overflow-hidden border border-[var(--color-border)] transition-shadow duration-200 hover:shadow-lg">
								<div class="aspect-square overflow-hidden bg-[var(--color-bg-alt)]">
									{#if member.photo}
									<img
										src={`/images/lec/${member.photo}`}
										alt="{member.firstName} {member.lastName}"
										class="w-full h-full object-cover"
										onerror={(e) => {
											const img = e.currentTarget as HTMLImageElement;
											img.src = '/images/placeholder-person.jpg';
										}}
									/>
									{:else}
										<div class="w-full h-full flex items-center justify-center bg-[var(--color-primary)] text-white text-2xl font-semibold">
											{member.firstName[0]}{member.lastName[0]}
										</div>
									{/if}
								</div>
								<div class="p-3">
									<h3 class="!text-sm !font-semibold mb-0.5 !leading-tight !font-sans">
										{#if member.website}
											<a href={member.website} target="_blank" rel="noopener" class="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
												{member.firstName} {member.lastName}
											</a>
										{:else}
											<span class="text-[var(--color-primary)]">{member.firstName} {member.lastName}</span>
										{/if}
									</h3>
									{#if member.institution}
										<p class="text-xs text-[var(--color-text-light)] m-0 leading-snug line-clamp-2">{member.institution}</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>

					{#if data.faculty.length === 0}
						<p class="text-center text-[var(--color-text-light)] py-8">Faculty information will be available soon.</p>
					{/if}
				</article>
			</div>

			<aside class="sticky top-[100px] self-start lg:static">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

