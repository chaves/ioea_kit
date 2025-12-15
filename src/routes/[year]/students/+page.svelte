<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

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

<svelte:head>
	<title>Participants - IOEA {data.year}</title>
	<meta name="description" content="Meet the participants and seminar chairs of IOEA {data.year}." />
</svelte:head>

<PageHeader title="Participants - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">

				{#if data.students.length > 0 || data.chairs.length > 0}
					<!-- Filter buttons -->
					{#if data.showGroups && data.groups.length > 0}
						<div class="filters">
							<button
								type="button"
								class="filter-btn"
								class:active={viewMode === 'all'}
								onclick={() => setViewMode('all')}
							>
								All ({data.students.length})
							</button>
							{#each data.groups as group}
								{@const count = data.students.filter((s) => s.groupId === group).length}
								{#if count > 0}
									<button
										type="button"
										class="filter-btn"
										class:active={viewMode === group}
										onclick={() => setViewMode(group)}
									>
										Group {group} ({count})
									</button>
								{/if}
							{/each}
						</div>
					{/if}

					<!-- Seminar Chairs Section -->
					{#if data.showGroups && filteredChairs.length > 0}
						<section class="chairs-section">
							<h2>Seminar Chairs</h2>
							<div class="chairs-grid">
								{#each filteredChairs as chair}
									<div class="chair-card">
										<div class="chair-photo">
											{#if chair.photo}
												<img
													src={`/images/semchairs/${chair.photo}`}
													alt="{chair.firstName} {chair.lastName}"
													onerror={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder-person.jpg'; }}
												/>
											{:else}
												<div class="photo-placeholder">
													{chair.firstName[0]}{chair.lastName[0]}
												</div>
											{/if}
										</div>
										<div class="chair-info">
											{#if chair.website}
												<a href={chair.website} target="_blank" rel="noopener">
													{chair.firstName} {chair.lastName}
												</a>
											{:else}
												<span class="name">{chair.firstName} {chair.lastName}</span>
											{/if}
											{#if chair.institution}
												<span class="institution">{chair.institution}</span>
											{/if}
											{#if chair.groupId}
												<span class="group-badge">Group {chair.groupId}</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</section>
					{/if}

					<!-- Students Table -->
					{#if filteredStudents.length > 0}
						<section class="students-section">
							<h2>Participants</h2>
							<div class="students-table-wrapper">
								<table class="students-table">
									<thead>
										<tr>
											<th>Full Name</th>
											<th>Affiliation / University</th>
											<th>Paper or Project</th>
											{#if data.showGroups && data.groups.length > 0}
												<th class="group-col">Group</th>
											{/if}
											<th class="photo-col">Photo</th>
										</tr>
									</thead>
									<tbody>
										{#each filteredStudents as student}
											<tr>
												<td class="name-cell">
													<a href="/{data.year}/students/{student.id}">
														{student.lastName}, {student.firstName}
													</a>
												</td>
												<td class="university-cell">
													{student.university ?? '-'}
												</td>
												<td class="paper-cell">
													{#if student.paperTitle}
														<span class="paper-title" title={student.paperTitle}>
															{student.paperTitle}
														</span>
													{:else}
														<span class="no-paper">Details not uploaded</span>
													{/if}
												</td>
												{#if data.showGroups && data.groups.length > 0}
													<td class="group-cell">
														{#if student.groupId}
															{#if viewMode === 'all'}
																<button
																	type="button"
																	class="group-link"
																	onclick={() => setViewMode(student.groupId as number)}
																>
																	{student.groupId}
																</button>
															{:else}
																<span class="group-number">{student.groupId}</span>
															{/if}
														{:else}
															-
														{/if}
													</td>
												{/if}
												<td class="photo-cell">
													{#if student.photo}
														<a href="/{data.year}/students/{student.id}" class="photo-link">
															<img
																src={`/images/students/${student.photo}`}
																alt="{student.firstName} {student.lastName}"
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
					<div class="no-data">
						<div class="no-data-icon">📋</div>
						<p>Participant information for IOEA {data.year} will be available soon.</p>
						<p class="subtext">Check back closer to the session date.</p>
					</div>
				{/if}
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

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.filter-btn {
		padding: 0.5rem 1rem;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-btn:hover {
		border-color: var(--color-primary);
		background: var(--color-bg-alt);
	}

	.filter-btn.active {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	/* Chairs Section */
	.chairs-section {
		margin-bottom: 3rem;
	}

	.chairs-section h2 {
		color: var(--color-primary);
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.chairs-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.chair-card {
		background: white;
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid var(--color-border);
		transition: box-shadow 0.2s ease;
	}

	.chair-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.chair-photo {
		aspect-ratio: 1;
		overflow: hidden;
		background: var(--color-bg-alt);
	}

	.chair-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.photo-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-primary);
		color: white;
		font-size: 2rem;
		font-weight: 600;
	}

	.chair-info {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.chair-info a {
		color: var(--color-primary);
		font-weight: 600;
		text-decoration: none;
	}

	.chair-info a:hover {
		color: var(--color-secondary);
	}

	.chair-info .name {
		font-weight: 600;
		color: var(--color-primary);
	}

	.chair-info .institution {
		font-size: 0.85rem;
		color: var(--color-text-light);
	}

	.chair-info .group-badge {
		display: inline-block;
		width: fit-content;
		margin-top: 0.25rem;
		padding: 0.2rem 0.5rem;
		background: var(--color-secondary);
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 0.25rem;
	}

	/* Students Section */
	.students-section h2 {
		color: var(--color-primary);
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.students-table-wrapper {
		background: white;
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid var(--color-border);
		overflow-x: auto;
	}

	.students-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.students-table th {
		background: var(--color-primary);
		color: white;
		padding: 0.875rem 1rem;
		text-align: left;
		font-weight: 600;
		white-space: nowrap;
	}

	.students-table td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--color-border);
		vertical-align: middle;
	}

	.students-table tbody tr:hover {
		background: var(--color-bg-alt);
	}

	.students-table tbody tr:last-child td {
		border-bottom: none;
	}

	.name-cell a {
		color: var(--color-primary);
		font-weight: 500;
		text-decoration: none;
	}

	.name-cell a:hover {
		color: var(--color-secondary);
		text-decoration: underline;
	}

	.university-cell {
		color: var(--color-text-light);
	}

	.paper-cell {
		max-width: 300px;
	}

	.paper-title {
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.no-paper {
		color: #dc3545;
		font-size: 0.85rem;
	}

	.group-col {
		width: 80px;
		text-align: center;
	}

	.group-cell {
		text-align: center;
	}

	.group-link {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: var(--color-bg-alt);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--color-primary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.group-link:hover {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.group-number {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--color-text);
	}

	.photo-col {
		width: 80px;
		text-align: center;
	}

	.photo-cell {
		text-align: center;
	}

	.photo-link img {
		width: 60px;
		height: 60px;
		object-fit: cover;
		border-radius: 0.375rem;
		transition: transform 0.2s ease;
	}

	.photo-link:hover img {
		transform: scale(1.1);
	}

	/* No Data */
	.no-data {
		text-align: center;
		padding: 4rem 2rem;
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
	}

	.no-data-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.no-data p {
		font-size: 1.1rem;
		color: var(--color-text);
		margin-bottom: 0.5rem;
	}

	.no-data .subtext {
		font-size: 0.9rem;
		color: var(--color-text-light);
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

	@media (max-width: 767px) {
		.chairs-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.paper-cell {
			max-width: 150px;
		}

		.students-table {
			font-size: 0.85rem;
		}

		.students-table th,
		.students-table td {
			padding: 0.5rem;
		}
	}
</style>

