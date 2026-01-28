<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';

	interface Props {
		data: {
			year: number;
			students: Array<{
				id: number;
				firstName: string;
				lastName: string;
				university: string | null;
				photo: string | null;
				groupId: number | null;
				paperTitle: string | null;
			}>;
			chairs: Array<{
				id: number;
				firstName: string;
				lastName: string;
				institution: string | null;
				website: string | null;
				photo: string | null;
				groupId: number | null;
			}>;
			groups: number[];
			isCurrentYear: boolean;
			showGroups: boolean;
		};
	}

	let { data }: Props = $props();

	let viewMode = $state<'all' | number>('all');

	function setViewMode(mode: 'all' | number) {
		viewMode = mode;
	}

	const filteredStudents = $derived(
		viewMode === 'all' ? data.students : data.students.filter((s) => s.groupId === viewMode)
	);

	const filteredChairs = $derived(
		viewMode === 'all' ? data.chairs : data.chairs.filter((c) => c.groupId === viewMode)
	);
</script>

<SEO
	title="Participants - IOEA {data.year}"
	description="Meet the participants and seminar chairs of IOEA {data.year}."
/>

<PageHeader title="Participants - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				{#if data.students.length > 0 || data.chairs.length > 0}
					<!-- Filter buttons -->
					{#if data.showGroups && data.groups.length > 0}
						<div class="flex flex-wrap gap-3 mb-10">
							<button
								type="button"
								class="px-6 py-2.5 bg-white border border-border rounded-xl text-base font-bold cursor-pointer transition-all duration-300 {viewMode === 'all' ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'text-text-light hover:border-primary hover:bg-primary/5'}"
								onclick={() => setViewMode('all')}
							>
								All <span class="ml-1 opacity-70 font-medium">({data.students.length})</span>
							</button>
							{#each data.groups as group}
								{@const count = data.students.filter((s) => s.groupId === group).length}
								{#if count > 0}
									<button
										type="button"
										class="px-6 py-2.5 bg-white border border-border rounded-xl text-base font-bold cursor-pointer transition-all duration-300 {viewMode === group ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'text-text-light hover:border-primary hover:bg-primary/5'}"
										onclick={() => setViewMode(group)}
									>
										Group {group} <span class="ml-1 opacity-70 font-medium">({count})</span>
									</button>
								{/if}
							{/each}
						</div>
					{/if}

					<!-- Seminar Chairs Section -->
					{#if data.showGroups && filteredChairs.length > 0}
						<section class="mb-12">
							<h2 class="text-primary text-2xl mb-6 pb-2 border-b-2 border-secondary">Seminar Chairs</h2>
							<div class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
								{#each filteredChairs as chair}
									<div class="bg-white rounded-lg overflow-hidden border border-border transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
										<div class="aspect-square overflow-hidden bg-bg-alt">
											{#if chair.photo}
												<img
													src={`/images/semchairs/${chair.photo}`}
													alt="{chair.firstName} {chair.lastName}"
													class="w-full h-full object-cover"
													onerror={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder-person.jpg'; }}
												/>
											{:else}
												<div class="w-full h-full flex items-center justify-center bg-primary text-white text-3xl font-semibold">
													{chair.firstName[0]}{chair.lastName[0]}
												</div>
											{/if}
										</div>
										<div class="p-4 flex flex-col gap-1">
											{#if chair.website}
												<a href={chair.website} target="_blank" rel="noopener" class="text-primary font-semibold no-underline hover:text-secondary">
													{chair.firstName} {chair.lastName}
												</a>
											{:else}
												<span class="font-semibold text-primary">{chair.firstName} {chair.lastName}</span>
											{/if}
											{#if chair.institution}
												<span class="text-xs text-text-light">{chair.institution}</span>
											{/if}
											{#if chair.groupId}
												<span class="inline-block w-fit mt-1 px-2 py-0.5 bg-secondary text-white text-xs font-semibold rounded">{chair.groupId}</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</section>
					{/if}

					<!-- Students Table -->
					{#if filteredStudents.length > 0}
						<section>
							<h2 class="text-primary text-2xl mb-6 pb-2 border-b-2 border-secondary">Participants</h2>
							<div class="overflow-x-auto my-8 rounded-xl border border-border shadow-sm">
						<table class="w-full border-collapse text-sm sm:text-base">
							<thead>
								<tr>
									<th class="bg-primary text-white px-6 py-4 text-left font-bold uppercase tracking-wider">Full Name</th>
									<th class="bg-primary text-white px-6 py-4 text-left font-bold uppercase tracking-wider">Affiliation / University</th>
									<th class="bg-primary text-white px-6 py-4 text-left font-bold uppercase tracking-wider">Paper or Project</th>
									{#if data.showGroups && data.groups.length > 0}
										<th class="bg-primary text-white px-6 py-4 text-center font-bold uppercase tracking-wider w-24">Group</th>
									{/if}
									<th class="bg-primary text-white px-6 py-4 text-center font-bold uppercase tracking-wider w-24">Photo</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredStudents as student}
									<tr class="hover:bg-bg-alt/50 transition-colors last:[&>td]:border-b-0">
										<td class="px-6 py-4 border-b border-border align-middle">
											<a href="/{data.year}/students/{student.id}" class="text-primary font-bold no-underline hover:text-secondary hover:underline text-base">
												{student.lastName}, {student.firstName}
											</a>
										</td>
										<td class="px-6 py-4 border-b border-border align-middle text-text font-medium">
											{student.university ?? '-'}
										</td>
										<td class="px-6 py-4 border-b border-border align-middle max-w-[300px] sm:max-w-[200px]">
											{#if student.paperTitle}
												<span class="block whitespace-nowrap overflow-hidden text-ellipsis text-sm sm:text-base font-medium" title={student.paperTitle}>
													{student.paperTitle}
												</span>
											{:else}
												<span class="text-red-600 text-xs font-bold uppercase tracking-tight">Details not uploaded</span>
											{/if}
										</td>
										{#if data.showGroups && data.groups.length > 0}
											<td class="px-6 py-4 border-b border-border align-middle text-center">
												{#if student.groupId}
													{#if viewMode === 'all'}
														<button
															type="button"
															class="inline-block px-4 py-1.5 bg-secondary text-white rounded-md text-sm font-bold shadow-sm cursor-pointer transition-all duration-200 hover:bg-primary hover:scale-110"
															onclick={() => setViewMode(student.groupId as number)}
														>
															{student.groupId}
														</button>
													{:else}
														<span class="inline-block px-4 py-1.5 bg-bg-alt rounded-md text-sm font-bold text-text border border-border">{student.groupId}</span>
													{/if}
												{:else}
													<span class="text-text-light">-</span>
												{/if}
											</td>
										{/if}
										<td class="px-6 py-4 border-b border-border align-middle text-center">
											{#if student.photo}
												<a href="/{data.year}/students/{student.id}" class="inline-block no-underline">
													<img
														src={`/images/students/${student.photo}`}
														alt="{student.firstName} {student.lastName}"
														class="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-md transition-transform duration-200 hover:scale-125 hover:z-10"
														onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
													/>
												</a>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
						</section>
					{/if}
				{:else}
					<div class="text-center py-16 px-8 bg-bg-alt rounded-lg">
						<div class="text-5xl mb-4">📋</div>
						<p class="text-lg text-text mb-2">Participant information for IOEA {data.year} will be available soon.</p>
						<p class="text-sm text-text-light m-0">Check back closer to the session date.</p>
					</div>
				{/if}
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


