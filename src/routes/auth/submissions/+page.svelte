<script lang="ts">
	import { goto } from '$app/navigation';

	interface Submission {
		id: string;
		callYear: number;
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
		decision: 'pending' | 'accepted' | 'waitlisted' | 'rejected';
	}

	interface Props {
		data: {
			submissions: Submission[];
				stats: {
					total: number;
					pending: number;
					accepted: number;
					waitlisted: number;
					rejected: number;
				};
				filter: string;
				isSuperAdmin: boolean;
			};
		}

	let { data }: Props = $props();

	let expandedIds: Set<string> = $state(new Set());

	function toggleSummary(id: string) {
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
			<div class="stat-card stat-pending">
				<span class="stat-value">{data.stats.pending}</span>
				<span class="stat-label">Pending</span>
			</div>
			<div class="stat-card stat-success">
				<span class="stat-value">{data.stats.accepted}</span>
				<span class="stat-label">Accepted</span>
			</div>
			<div class="stat-card stat-waitlisted">
				<span class="stat-value">{data.stats.waitlisted}</span>
				<span class="stat-label">In waiting list</span>
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
			<button class="filter-btn" class:active={data.filter === 'pending'} onclick={() => setFilter('pending')}>
				Pending ({data.stats.pending})
			</button>
			<button class="filter-btn" class:active={data.filter === 'accepted'} onclick={() => setFilter('accepted')}>
				Accepted ({data.stats.accepted})
			</button>
			<button class="filter-btn" class:active={data.filter === 'waitlisted'} onclick={() => setFilter('waitlisted')}>
				In waiting list ({data.stats.waitlisted})
			</button>
			<button class="filter-btn" class:active={data.filter === 'rejected'} onclick={() => setFilter('rejected')}>
				Rejected ({data.stats.rejected})
			</button>
		</div>

	<!-- Submission Cards -->
		<div class="cards-container">
			{#each data.submissions as sub (sub.id)}
				<div
					class="submission-card"
					class:card-pending={sub.decision === 'pending'}
					class:card-accepted={sub.decision === 'accepted'}
					class:card-waitlisted={sub.decision === 'waitlisted'}
					class:card-rejected={sub.decision === 'rejected'}
				>
				{#if sub.avgNote !== null}
					<div class="score-badge" class:score-high={sub.avgNote >= 3} class:score-low={sub.avgNote < 3}>
						{sub.avgNote.toFixed(1)}
					</div>
				{/if}

				<!-- Line 1: Name - PhD Student - Gender/Age - Nationality - status badge at end -->
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
							{#if sub.decision === 'accepted'}
								<span class="status-pill status-accepted"><span class="status-dot dot-green"></span>Accepted</span>
							{:else if sub.decision === 'waitlisted'}
								<span class="status-pill status-waitlisted"><span class="status-dot dot-waitlisted"></span>In waiting list</span>
							{:else if sub.decision === 'rejected'}
								<span class="status-pill status-rejected"><span class="status-dot dot-red"></span>Rejected</span>
							{:else}
								<span class="status-pill status-pending"><span class="status-dot dot-pending"></span>Pending</span>
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
							<a href="/uploads/call/{sub.callYear}/{sub.cv}" target="_blank" class="doc-btn">CV</a>
						{/if}
						{#if sub.paper}
							<a href="/uploads/call/{sub.callYear}/{sub.paper}" target="_blank" class="doc-btn">Paper</a>
						{/if}
						<button class="doc-btn" onclick={() => toggleSummary(sub.id)}>
							{expandedIds.has(sub.id) ? '- Summary' : '+ Summary'}
						</button>
						</div>
						<div class="card-decision">
							<form method="POST" action="?/accept">
								<input type="hidden" name="submission_id" value={sub.id} />
								<button type="submit" class="decision-btn btn-accept" disabled={sub.decision === 'accepted'}>
									Accept
								</button>
							</form>
							<form method="POST" action="?/reject">
								<input type="hidden" name="submission_id" value={sub.id} />
								<button type="submit" class="decision-btn btn-reject" disabled={sub.decision === 'rejected'}>
									Reject
								</button>
							</form>
							<form method="POST" action="?/waitlist">
								<input type="hidden" name="submission_id" value={sub.id} />
								<button type="submit" class="decision-btn btn-waitlist" disabled={sub.decision === 'waitlisted'}>
									In waiting list
								</button>
							</form>
								{#if data.isSuperAdmin}
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
		font-weight: 700;
		color: var(--color-text);
		letter-spacing: -0.02em;
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
		font-size: 0.9rem;
		color: var(--color-text-light);
	}

	.stat-success .stat-value {
		color: var(--color-accent-green);
	}

	.stat-pending .stat-value {
		color: #111827;
	}

	.stat-danger .stat-value {
		color: #e53e3e;
	}

	.stat-waitlisted .stat-value {
		color: #d97706;
	}

	.filters {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.filter-btn {
		padding: 0.55rem 1.1rem;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.95rem;
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
		gap: 1.25rem;
	}

	.submission-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.5rem 1.75rem;
		position: relative;
		transition: border-color 0.2s ease;
	}

	.submission-card.card-accepted {
		border-left: 4px solid var(--color-accent-green);
	}

	.submission-card.card-rejected {
		border-left: 4px solid #e53e3e;
	}

	.submission-card.card-pending {
		border-left: 4px solid #111827;
	}

	.submission-card.card-waitlisted {
		border-left: 4px solid #d97706;
	}

	.score-badge {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.95rem;
		color: white;
	}

	.score-high {
		background: var(--color-accent-green);
	}

	.score-low {
		background: #e53e3e;
	}

	.card-line {
		margin-bottom: 0.5rem;
		font-size: 1rem;
		line-height: 1.55;
		color: var(--color-text);
		padding-right: 52px;
	}

	.card-line-main {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0 0.4rem;
		font-size: 1.05rem;
		line-height: 1.5;
	}

	.card-line-main strong {
		color: var(--color-primary);
		font-weight: 600;
	}

	.sep {
		margin: 0 0.4rem;
		color: var(--color-text-light);
	}

	.text-muted {
		color: var(--color-text-light);
	}

	.affiliation-label {
		font-weight: 600;
		margin-right: 0.35rem;
		color: var(--color-text);
	}

	.card-title {
		font-size: 1.05rem;
		font-weight: 600;
		margin-top: 0.6rem;
		margin-bottom: 0.85rem;
		line-height: 1.5;
		color: var(--color-text);
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
		padding: 0.4rem 0.85rem;
		background: var(--color-bg-alt, #f7f7f7);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.9rem;
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
		padding: 0.45rem 1rem;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.9rem;
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

	.btn-waitlist {
		background: #d97706;
		color: white;
	}

	.decision-btn:disabled {
		opacity: 0.55;
		cursor: default;
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

	.status-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.7rem;
		border-radius: 9999px;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		border: 1px solid transparent;
	}

	.status-dot {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		display: inline-block;
	}

	.dot-green {
		background: var(--color-accent-green);
	}

	.dot-red {
		background: #e53e3e;
	}

	.dot-pending {
		background: #ffffff;
		border: 1.5px solid #64748b;
	}

	.dot-waitlisted {
		background: #d97706;
	}

	.status-accepted {
		background: #e7f7ee;
		border-color: #b8e7cb;
		color: #166534;
	}

	.status-rejected {
		background: #fee9e9;
		border-color: #f9c2c2;
		color: #9f1239;
	}

	.status-pending {
		background: #f8fafc;
		border-color: #d5dbe4;
		color: #1f2937;
	}

	.status-waitlisted {
		background: #fff5e8;
		border-color: #ffd9a8;
		color: #92400e;
	}

	.card-summary {
		margin-top: 1.25rem;
		padding: 1.25rem;
		background: var(--color-bg-alt, #f9f9f9);
		border-radius: 0.375rem;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--color-text);
	}

	.card-summary p {
		margin: 0 0 0.65rem;
	}

	.card-summary p:last-child {
		margin-bottom: 0;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: var(--color-text-light);
		font-size: 1.05rem;
		line-height: 1.5;
	}

	@media (max-width: 767px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
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
