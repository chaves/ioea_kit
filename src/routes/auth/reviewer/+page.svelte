<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	interface Props {
		data: {
			proposals: Array<{
				id: number;
				firstName: string;
				lastName: string;
				email: string;
				nationality: string | null;
				university: string | null;
				phdTitle: string | null;
				phdSummary: string | null;
				cv: string | null;
				paper: string | null;
				myNote: number | null;
				isRated: boolean;
			}>;
			stats: {
				total: number;
				rated: number;
				notRated: number;
			};
			filter: string;
		};
	}

	let { data }: Props = $props();
	let expandedId = $state<number | null>(null);

	function setFilter(filter: string) {
		goto(`/auth/reviewer?filter=${filter}`);
	}

	function toggleExpand(id: number) {
		expandedId = expandedId === id ? null : id;
	}

	function handleKeyDown(event: KeyboardEvent, id: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleExpand(id);
		}
	}
</script>

<svelte:head>
	<title>Review Applications | IOEA Admin</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<h1>Review Applications</h1>
		<p class="subtitle">Rate applications from 1 (reject) to 5 (strongly accept)</p>
	</header>

	<!-- Stats -->
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-value">{data.stats.total}</span>
			<span class="stat-label">Assigned to You</span>
		</div>
		<div class="stat-card stat-success">
			<span class="stat-value">{data.stats.rated}</span>
			<span class="stat-label">Rated</span>
		</div>
		<div class="stat-card stat-warning">
			<span class="stat-value">{data.stats.notRated}</span>
			<span class="stat-label">Pending</span>
		</div>
	</div>

	<!-- Filters -->
	<div class="filters">
		<button class="filter-btn" class:active={data.filter === 'all'} onclick={() => setFilter('all')}>
			All ({data.stats.total})
		</button>
		<button class="filter-btn" class:active={data.filter === 'rated'} onclick={() => setFilter('rated')}>
			Rated ({data.stats.rated})
		</button>
		<button class="filter-btn" class:active={data.filter === 'not_rated'} onclick={() => setFilter('not_rated')}>
			Pending ({data.stats.notRated})
		</button>
	</div>

	<!-- Proposals -->
	<div class="proposals-list">
		{#each data.proposals as proposal}
			<div class="proposal-card" class:rated={proposal.isRated}>
				<div
					class="proposal-header"
					role="button"
					tabindex="0"
					onclick={() => toggleExpand(proposal.id)}
					onkeydown={(e) => handleKeyDown(e, proposal.id)}
				>
					<div class="proposal-info">
						<h3>{proposal.lastName}, {proposal.firstName}</h3>
						<p class="proposal-meta">
							{proposal.university ?? 'Unknown university'} • {proposal.nationality ?? 'Unknown nationality'}
						</p>
					</div>
					<div class="proposal-status">
						{#if proposal.myNote}
							<span class="note-badge">Your rating: {proposal.myNote}/5</span>
						{:else}
							<span class="pending-badge">Not rated</span>
						{/if}
						<button class="expand-btn">
							{expandedId === proposal.id ? '▲' : '▼'}
						</button>
					</div>
				</div>

				{#if expandedId === proposal.id}
					<div class="proposal-details">
						<div class="detail-section">
							<h4>PhD Title</h4>
							<p>{proposal.phdTitle ?? 'Not provided'}</p>
						</div>

						<div class="detail-section">
							<h4>Research Summary</h4>
							<p class="summary">{proposal.phdSummary ?? 'Not provided'}</p>
						</div>

						<div class="detail-section">
							<h4>Documents</h4>
							<div class="documents">
								{#if proposal.cv}
									<a href="/uploads/call/{proposal.cv}" target="_blank" class="doc-link">
										📄 View CV
									</a>
								{/if}
								{#if proposal.paper}
									<a href="/uploads/call/{proposal.paper}" target="_blank" class="doc-link">
										📝 View Paper
									</a>
								{/if}
							</div>
						</div>

						<div class="rating-section">
							<h4>Your Rating</h4>
							<form
								method="POST"
								action="?/rate"
								use:enhance={() => {
									return async ({ update }) => {
										await update();
									};
								}}
								class="rating-form"
							>
								<input type="hidden" name="proposal_id" value={proposal.id} />
								<div class="rating-buttons">
									{#each [1, 2, 3, 4, 5] as score}
										<button
											type="submit"
											name="note"
											value={score}
											class="rating-btn"
											class:active={proposal.myNote === score}
										>
											{score}
										</button>
									{/each}
								</div>
								<div class="rating-labels">
									<span>Reject</span>
									<span>Strong Accept</span>
								</div>
							</form>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.admin-page {
		padding: 2rem;
	}

	.auth-header {
		margin-bottom: 2rem;
	}

	.auth-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 1.75rem;
	}

	.subtitle {
		color: var(--color-text-light);
		margin: 0;
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
		color: var(--color-accent);
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
	}

	.filter-btn.active {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.proposals-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.proposal-card {
		background: white;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		overflow: hidden;
	}

	.proposal-card.rated {
		border-left: 4px solid var(--color-accent);
	}

	.proposal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		cursor: pointer;
	}

	.proposal-header:hover {
		background: var(--color-bg-alt);
	}

	.proposal-info h3 {
		margin: 0 0 0.25rem 0;
		font-size: 1.1rem;
	}

	.proposal-meta {
		margin: 0;
		font-size: 0.9rem;
		color: var(--color-text-light);
	}

	.proposal-status {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.note-badge {
		padding: 0.25rem 0.75rem;
		background: var(--color-accent);
		color: white;
		border-radius: 1rem;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.pending-badge {
		padding: 0.25rem 0.75rem;
		background: var(--color-secondary);
		color: white;
		border-radius: 1rem;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.expand-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.8rem;
		color: var(--color-text-light);
	}

	.proposal-details {
		padding: 1.5rem;
		border-top: 1px solid var(--color-border);
		background: var(--color-bg-alt);
	}

	.detail-section {
		margin-bottom: 1.5rem;
	}

	.detail-section h4 {
		font-size: 0.9rem;
		color: var(--color-text-light);
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.detail-section p {
		margin: 0;
		line-height: 1.6;
	}

	.summary {
		max-height: 200px;
		overflow-y: auto;
		white-space: pre-wrap;
	}

	.documents {
		display: flex;
		gap: 1rem;
	}

	.doc-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		color: var(--color-primary);
		font-weight: 500;
	}

	.doc-link:hover {
		background: var(--color-primary);
		color: white;
	}

	.rating-section {
		background: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
	}

	.rating-section h4 {
		margin-bottom: 1rem;
	}

	.rating-buttons {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.rating-btn {
		flex: 1;
		padding: 1rem;
		font-size: 1.25rem;
		font-weight: 600;
		background: var(--color-bg-alt);
		border: 2px solid var(--color-border);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.rating-btn:hover {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.rating-btn.active {
		background: var(--color-accent);
		color: white;
		border-color: var(--color-accent);
	}

	.rating-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		color: var(--color-text-light);
	}

	@media (max-width: 767px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

		.proposal-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}
</style>

