<script lang="ts">
	import { goto } from '$app/navigation';

	interface Submission {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		nationality: string | null;
		country: string | null;
		university: string | null;
		department: string | null;
		status: number | null;
		age: number | null;
		gender: string | null;
		title: string;
		summary: string;
		cv: string | null;
		paper: string | null;
		phdAdvisorName: string | null;
		phdAdvisorEmail: string | null;
		avgNote: number | null;
		accepted: boolean;
	}

	interface Props {
		data: {
			submissions: Submission[];
			stats: {
				total: number;
				accepted: number;
				rejected: number;
			};
			filter: string;
			isAdmin: boolean;
		};
	}

	let { data }: Props = $props();

	let expandedIds: Set<number> = $state(new Set());

	function toggleSummary(id: number) {
		const next = new Set(expandedIds);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		expandedIds = next;
	}

	function setFilter(filter: string) {
		goto(`/auth/submissions?filter=${filter}`);
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

	function getGenderLabel(gender: string | null): string {
		if (!gender) return '';
		if (gender.toLowerCase() === 'f') return 'F';
		if (gender.toLowerCase() === 'm') return 'M';
		return gender;
	}
</script>

<svelte:head>
	<title>Submissions | IOEA Program</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<h1>Submissions <span class="heading-count">({data.stats.total})</span></h1>
		<a href="/auth/submissions/export" class="export-btn">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="7 10 12 15 17 10"></polyline>
				<line x1="12" y1="15" x2="12" y2="3"></line>
			</svg>
			Export Excel
		</a>
	</header>

	<!-- Stats -->
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-value">{data.stats.total}</span>
			<span class="stat-label">Total</span>
		</div>
		<div class="stat-card stat-success">
			<span class="stat-value">{data.stats.accepted}</span>
			<span class="stat-label">Accepted</span>
		</div>
		<div class="stat-card stat-danger">
			<span class="stat-value">{data.stats.rejected}</span>
			<span class="stat-label">Rejected</span>
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
	</div>

	<!-- Submission Cards -->
	<div class="cards-container">
		{#each data.submissions as sub (sub.id)}
			<div class="submission-card" class:card-accepted={sub.accepted}>
				<!-- Score badge -->
				{#if sub.avgNote !== null}
					<div class="score-badge" class:score-high={sub.avgNote >= 3} class:score-low={sub.avgNote < 3}>
						{sub.avgNote.toFixed(1)}
					</div>
				{/if}

				<!-- Line 1: Name - Status - Gender/Age - Nationality -->
				<div class="card-line card-line-main">
					<strong>{sub.lastName}, {sub.firstName}</strong>
					<span class="sep">-</span>
					<span>{getStatusLabel(sub.status)}</span>
					{#if sub.gender || sub.age}
						<span class="sep">-</span>
						<span class="text-muted">({getGenderLabel(sub.gender)}{sub.gender && sub.age ? ', ' : ''}{sub.age ?? ''})</span>
					{/if}
					{#if sub.nationality}
						<span class="sep">-</span>
						<span class="text-muted">{sub.nationality}</span>
					{/if}
				</div>

				<!-- Line 2: Affiliation -->
				{#if sub.university || sub.department || sub.country}
					<div class="card-line text-muted">
						<span class="affiliation-label">Affiliation:</span>
						{sub.university ?? ''}{sub.department ? `, ${sub.department}` : ''}{sub.country ? ` - ${sub.country}` : ''}
					</div>
				{/if}

				<!-- PhD advisor (only for PhD students) -->
			{#if sub.status === 1 && (sub.phdAdvisorName || sub.phdAdvisorEmail)}
				<div class="card-line text-muted">
					<span class="affiliation-label">PhD Advisor:</span>
					{sub.phdAdvisorName ?? ''}{sub.phdAdvisorEmail ? ` (${sub.phdAdvisorEmail})` : ''}
				</div>
			{/if}

			<!-- Line 3: Research title -->
				<div class="card-line card-title">
					{sub.title}
				</div>

				<!-- Buttons row -->
				<div class="card-actions">
					<div class="card-links">
						{#if sub.cv}
							<a href="/uploads/call/{sub.cv}" target="_blank" class="doc-btn">CV</a>
						{/if}
						{#if sub.paper}
							<a href="/uploads/call/{sub.paper}" target="_blank" class="doc-btn">Paper</a>
						{/if}
						<button class="doc-btn" onclick={() => toggleSummary(sub.id)}>
							{expandedIds.has(sub.id) ? '- Summary' : '+ Summary'}
						</button>
					</div>
					<div class="card-decision">
						{#if sub.accepted}
							<span class="status-badge badge-accepted">Accepted</span>
							<form method="POST" action="?/accept">
								<input type="hidden" name="submission_id" value={sub.id} />
								<input type="hidden" name="accepted" value="false" />
								<button type="submit" class="decision-btn btn-reject">Reject</button>
							</form>
						{:else}
							<span class="status-badge badge-rejected">Rejected</span>
							<form method="POST" action="?/accept">
								<input type="hidden" name="submission_id" value={sub.id} />
								<input type="hidden" name="accepted" value="true" />
								<button type="submit" class="decision-btn btn-accept">Accept</button>
							</form>
						{/if}
						{#if data.isAdmin}
							<form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm(`Delete submission by ${sub.lastName}, ${sub.firstName}?`)) e.preventDefault(); }}>
								<input type="hidden" name="submission_id" value={sub.id} />
								<button type="submit" class="decision-btn btn-delete">Delete</button>
							</form>
						{/if}
					</div>
				</div>

				<!-- Collapsible summary -->
				{#if expandedIds.has(sub.id)}
					<div class="card-summary">
						{#each sub.summary.split('\n') as line}
							{#if line.trim()}
								<p>{line}</p>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{/each}

		{#if data.submissions.length === 0}
			<div class="empty-state">No submissions found for this filter.</div>
		{/if}
	</div>
</div>

<style>
	.admin-page {
		padding: 2rem;
	}

	.auth-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.export-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--color-accent-green);
		color: white;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.15s ease;
	}

	.export-btn:hover {
		opacity: 0.85;
	}

	.heading-count {
		font-weight: 400;
		color: var(--color-text-light);
		font-size: 1.25rem;
	}

	.auth-header h1 {
		margin: 0;
		font-size: 1.75rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
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
		color: var(--color-accent-green);
	}

	.stat-danger .stat-value {
		color: #e53e3e;
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

	.cards-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.submission-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.25rem 1.5rem;
		position: relative;
		transition: border-color 0.2s ease;
	}

	.submission-card.card-accepted {
		border-left: 4px solid var(--color-accent-green);
	}

	.score-badge {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.9rem;
		color: white;
	}

	.score-high {
		background: var(--color-accent-green);
	}

	.score-low {
		background: #e53e3e;
	}

	.card-line {
		margin-bottom: 0.35rem;
		font-size: 0.92rem;
		padding-right: 60px;
	}

	.card-line-main {
		font-size: 1rem;
	}

	.card-line-main strong {
		color: var(--color-primary);
	}

	.sep {
		margin: 0 0.35rem;
		color: var(--color-text-light);
	}

	.text-muted {
		color: var(--color-text-light);
	}

	.affiliation-label {
		font-weight: 600;
		margin-right: 0.25rem;
	}

	.card-title {
		font-weight: 600;
		margin-top: 0.5rem;
		margin-bottom: 0.75rem;
		line-height: 1.4;
	}

	.card-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.card-links {
		display: flex;
		gap: 0.5rem;
	}

	.doc-btn {
		padding: 0.35rem 0.75rem;
		background: var(--color-bg-alt, #f7f7f7);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--color-primary);
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.doc-btn:hover {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.card-decision {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.decision-btn {
		padding: 0.4rem 1rem;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 600;
		transition: opacity 0.15s ease;
	}

	.decision-btn:hover {
		opacity: 0.85;
	}

	.btn-accept {
		background: var(--color-accent-green);
		color: white;
	}

	.btn-reject {
		background: #e53e3e;
		color: white;
	}

	.btn-delete {
		background: transparent;
		color: #e53e3e;
		border: 1px solid #e53e3e;
	}

	.btn-delete:hover {
		background: #e53e3e;
		color: white;
	}

	.status-badge {
		padding: 0.3rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.badge-accepted {
		background: var(--color-accent-green);
		color: white;
	}

	.badge-rejected {
		background: #e53e3e;
		color: white;
	}

	.card-summary {
		margin-top: 1rem;
		padding: 1rem;
		background: var(--color-bg-alt, #f9f9f9);
		border-radius: 0.375rem;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--color-text);
	}

	.card-summary p {
		margin: 0 0 0.5rem;
	}

	.card-summary p:last-child {
		margin-bottom: 0;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: var(--color-text-light);
		font-size: 1rem;
	}

	@media (max-width: 767px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

		.card-actions {
			flex-direction: column;
			align-items: flex-start;
		}

		.score-badge {
			position: static;
			margin-bottom: 0.5rem;
		}

		.card-line {
			padding-right: 0;
		}
	}
</style>
