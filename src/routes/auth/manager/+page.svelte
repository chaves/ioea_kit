<script lang="ts">
	import { goto } from '$app/navigation';

	interface Props {
		data: {
			proposals: Array<{
				id: number;
				firstName: string;
				lastName: string;
				email: string;
				nationality: string | null;
				country: string | null;
				university: string | null;
				status: number | null;
				age: number | null;
				gender: string | null;
				reviewerGroup: number | null;
				cv: string | null;
				paper: string | null;
				totalNotes: number;
				avgNote: number | null;
			}>;
			stats: {
				total: number;
				accepted: number;
				rejected: number;
				notRated: number;
				female: number;
				male: number;
			};
			filter: string;
		};
	}

	let { data }: Props = $props();

	function setFilter(filter: string) {
		goto(`/auth/manager?filter=${filter}`);
	}

	function getStatusLabel(status: number | null): string {
		const labels: Record<number, string> = {
			1: 'PhD Student',
			2: 'Post-doc',
			3: 'Academic',
			4: 'Other'
		};
		return status ? labels[status] ?? 'Unknown' : '-';
	}

	function formatNote(note: number | null): string {
		if (note === null) return '-';
		return note.toFixed(2);
	}
</script>

<svelte:head>
	<title>Applications Manager | IOEA Admin</title>
</svelte:head>

<div class="admin-page">
	<header class="page-header">
		<h1>Applications Manager</h1>
	</header>

	<!-- Stats -->
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-value">{data.stats.total}</span>
			<span class="stat-label">Total Applications</span>
		</div>
		<div class="stat-card stat-success">
			<span class="stat-value">{data.stats.accepted}</span>
			<span class="stat-label">Accepted</span>
		</div>
		<div class="stat-card stat-danger">
			<span class="stat-value">{data.stats.rejected}</span>
			<span class="stat-label">Rejected</span>
		</div>
		<div class="stat-card stat-warning">
			<span class="stat-value">{data.stats.notRated}</span>
			<span class="stat-label">Not Rated</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.stats.female} / {data.stats.male}</span>
			<span class="stat-label">F / M</span>
		</div>
	</div>

	<!-- Filters -->
	<div class="filters">
		<button class="filter-btn" class:active={data.filter === 'all'} onclick={() => setFilter('all')}>
			All ({data.stats.total})
		</button>
		<button class="filter-btn" class:active={data.filter === 'accepted'} onclick={() => setFilter('accepted')}>
			Accepted ({data.stats.accepted})
		</button>
		<button class="filter-btn" class:active={data.filter === 'rejected'} onclick={() => setFilter('rejected')}>
			Rejected ({data.stats.rejected})
		</button>
		<button class="filter-btn" class:active={data.filter === 'not_rated'} onclick={() => setFilter('not_rated')}>
			Not Rated ({data.stats.notRated})
		</button>
	</div>

	<!-- Table -->
	<div class="table-container">
		<table class="data-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Nationality</th>
					<th>University</th>
					<th>Status</th>
					<th>Age</th>
					<th>Group</th>
					<th>Notes</th>
					<th>Avg</th>
					<th>Files</th>
				</tr>
			</thead>
			<tbody>
				{#each data.proposals as proposal}
					<tr>
						<td>
							<a href="/auth/manager/{proposal.id}">
								{proposal.lastName}, {proposal.firstName}
							</a>
						</td>
						<td>{proposal.email}</td>
						<td>{proposal.nationality ?? '-'}</td>
						<td class="university-cell">{proposal.university ?? '-'}</td>
						<td>{getStatusLabel(proposal.status)}</td>
						<td>{proposal.age ?? '-'}</td>
						<td>{proposal.reviewerGroup ?? '-'}</td>
						<td>{proposal.totalNotes}</td>
						<td class="note-cell" class:pass={proposal.avgNote !== null && proposal.avgNote >= 3} class:fail={proposal.avgNote !== null && proposal.avgNote < 3}>
							{formatNote(proposal.avgNote)}
						</td>
						<td>
							{#if proposal.cv}
								<a href="/uploads/call/{proposal.cv}" target="_blank" title="CV">📄</a>
							{/if}
							{#if proposal.paper}
								<a href="/uploads/call/{proposal.paper}" target="_blank" title="Paper">📝</a>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.admin-page {
		padding: 2rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		margin: 0;
		font-size: 1.75rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		text-align: center;
	}

	.stat-value {
		display: block;
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-primary);
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--color-text-light);
	}

	.stat-success .stat-value {
		color: var(--color-accent);
	}

	.stat-danger .stat-value {
		color: #e53e3e;
	}

	.stat-warning .stat-value {
		color: var(--color-secondary);
	}

	.filters {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.filter-btn {
		padding: 0.5rem 1rem;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-btn:hover {
		border-color: var(--color-primary);
	}

	.filter-btn.active {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.table-container {
		background: white;
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid var(--color-border);
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table th,
	.data-table td {
		padding: 0.75rem 1rem;
		text-align: left;
		border-bottom: 1px solid var(--color-border);
	}

	.data-table th {
		background: var(--color-bg-alt);
		font-weight: 600;
		font-size: 0.85rem;
		color: var(--color-text-light);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.data-table td a {
		color: var(--color-primary);
		font-weight: 500;
	}

	.university-cell {
		max-width: 200px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.note-cell {
		font-weight: 600;
	}

	.note-cell.pass {
		color: var(--color-accent);
	}

	.note-cell.fail {
		color: #e53e3e;
	}

	@media (max-width: 1200px) {
		.stats-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 767px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.table-container {
			overflow-x: auto;
		}
	}
</style>

