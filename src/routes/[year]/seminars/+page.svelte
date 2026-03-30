<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SEO from '$lib/components/SEO.svelte';

	interface Chair {
		id: number;
		firstName: string;
		lastName: string;
		institution: string | null;
		website: string | null;
		photo: string | null;
	}

	interface Student {
		id: number;
		firstName: string;
		lastName: string;
		university: string | null;
		photo: string | null;
		paperTitle: string | null;
	}

	interface Group {
		groupId: number;
		chairs: Chair[];
		students: Student[];
	}

	interface Props {
		data: {
			year: number;
			groups: Group[];
		};
	}

	let { data }: Props = $props();
</script>

<SEO
	title="Seminars - IOEA {data.year}"
	description="Research seminars at IOEA {data.year} — participants present their work in small groups supervised by seminar chairs."
/>

<PageHeader title="Seminars - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div>
			<div class="main-content">
				{#if data.groups.length === 0}
					<div class="text-center py-16 px-8 bg-bg-alt rounded-lg">
						<p class="text-lg text-text">Seminar group information for IOEA {data.year} will be available soon.</p>
					</div>
				{:else}
					<p class="text-lg text-text-light mb-10">
						Participants are organized into {data.groups.length} seminar groups. Each group is led by two chairs and presents their research work throughout the week.
					</p>

					<div class="flex flex-col gap-12">
						{#each data.groups as group}
							<div class="border border-border rounded-xl overflow-hidden shadow-sm">
								<!-- Group header -->
								<div class="bg-primary px-6 py-4">
									<h2 class="text-white text-xl font-bold m-0">Group {group.groupId}</h2>
								</div>

								<div class="p-6 flex flex-col gap-8">
									<!-- Chairs -->
									{#if group.chairs.length > 0}
										<div>
											<h3 class="text-sm font-bold uppercase tracking-widest text-text-light mb-4">Seminar Chairs</h3>
											<div class="flex flex-wrap gap-4">
												{#each group.chairs as chair}
													<div class="flex items-center gap-4 bg-bg-alt rounded-lg p-3 flex-1 min-w-[220px]">
														<div class="w-24 h-24 rounded-full overflow-hidden bg-primary flex-shrink-0">
															{#if chair.photo}
																<img
																	src={`/images/semchairs/${chair.photo}`}
																	alt="{chair.firstName} {chair.lastName}"
																	class="w-full h-full object-cover"
																	onerror={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder-person.jpg'; }}
																/>
															{:else}
																<div class="w-full h-full flex items-center justify-center text-white text-xl font-semibold">
																	{chair.firstName[0]}{chair.lastName[0]}
																</div>
															{/if}
														</div>
														<div class="flex flex-col gap-0.5 min-w-0">
															{#if chair.website}
																<a href={chair.website} target="_blank" rel="noopener" class="font-semibold text-primary no-underline hover:text-secondary truncate">
																	{chair.firstName} {chair.lastName}
																</a>
															{:else}
																<span class="font-semibold text-primary truncate">{chair.firstName} {chair.lastName}</span>
															{/if}
															{#if chair.institution}
																<span class="text-xs text-text-light truncate">{chair.institution}</span>
															{/if}
														</div>
													</div>
												{/each}
											</div>
										</div>
									{/if}

									<!-- Students -->
									{#if group.students.length > 0}
										<div>
											<h3 class="text-sm font-bold uppercase tracking-widest text-text-light mb-4">Participants ({group.students.length})</h3>
											<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
												{#each group.students as student}
													<a
														href="/{data.year}/students/{student.id}"
														class="flex items-center gap-3 p-3 rounded-lg border border-border bg-white hover:border-primary hover:shadow-sm transition-all no-underline group"
													>
														<div class="w-14 h-14 rounded-full overflow-hidden bg-bg-alt flex-shrink-0">
															{#if student.photo}
																<img
																	src={`/student-photos/${student.photo}`}
																	alt="{student.firstName} {student.lastName}"
																	class="w-full h-full object-cover"
																	onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
																/>
															{:else}
																<div class="w-full h-full flex items-center justify-center bg-secondary text-white text-sm font-semibold">
																	{student.firstName[0]}{student.lastName[0]}
																</div>
															{/if}
														</div>
														<div class="flex flex-col gap-0.5 min-w-0">
															<span class="font-semibold text-primary text-sm group-hover:text-secondary transition-colors truncate">
																{student.lastName}, {student.firstName}
															</span>
															{#if student.university}
																<span class="text-xs text-text-light truncate">{student.university}</span>
															{/if}
														</div>
													</a>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
