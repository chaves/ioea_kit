<script lang="ts">
	let { data } = $props();

	const pct = (n: number) => data.stats.total > 0 ? Math.round((n / data.stats.total) * 100) : 0;
</script>

<svelte:head>
	<title>Students Validation | IOEA {data.year}</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<div>
			<h1>Students Validation</h1>
			<p class="subtitle">IOEA {data.year} — accepted students · {data.stats.total} total</p>
		</div>
	</header>

	<!-- Stats -->
	<div class="stats-row">
		<div class="stat-card">
			<div class="stat-value all-done">{data.stats.allValidated}</div>
			<div class="stat-label">All sections validated</div>
			<div class="stat-pct">{pct(data.stats.allValidated)}%</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{data.stats.profileCount}</div>
			<div class="stat-label">Profile</div>
			<div class="stat-pct">{pct(data.stats.profileCount)}%</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{data.stats.paperCount}</div>
			<div class="stat-label">Paper</div>
			<div class="stat-pct">{pct(data.stats.paperCount)}%</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{data.stats.travelCount}</div>
			<div class="stat-label">Travel</div>
			<div class="stat-pct">{pct(data.stats.travelCount)}%</div>
		</div>
	</div>

	<!-- Table -->
	<table class="data-table">
		<thead>
			<tr>
				<th>Name</th>
				<th>Email</th>
				<th>University</th>
				<th class="col-check">Profile</th>
				<th class="col-check">Paper</th>
				<th class="col-check">Travel</th>
				<th class="col-check">All done</th>
			</tr>
		</thead>
		<tbody>
			{#each data.students as s}
				<tr class="{s.allValidated ? 'row-done' : ''}">
					<td class="td-name">{s.lastName}, {s.firstName}</td>
					<td class="td-email">{s.email}</td>
					<td>{s.university}</td>
					<td class="col-check">
						{#if s.profileValidated}
							<span class="badge-ok">✓</span>
						{:else}
							<span class="badge-no">—</span>
						{/if}
					</td>
					<td class="col-check">
						{#if s.paperValidated}
							<span class="badge-ok">✓</span>
						{:else}
							<span class="badge-no">—</span>
						{/if}
					</td>
					<td class="col-check">
						{#if s.travelValidated}
							<span class="badge-ok">✓</span>
						{:else}
							<span class="badge-no">—</span>
						{/if}
					</td>
					<td class="col-check">
						{#if s.allValidated}
							<span class="badge-all">✓</span>
						{:else}
							<span class="badge-no">—</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.subtitle {
		font-size: 0.875rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0.25rem 0 0;
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.25rem 1.5rem;
		text-align: center;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-primary);
		line-height: 1;
	}

	.stat-value.all-done { color: #16a34a; }

	.stat-label {
		font-size: 0.8rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0.4rem 0 0.2rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-weight: 600;
	}

	.stat-pct {
		font-size: 0.85rem;
		color: var(--color-text-muted, #9ca3af);
	}

	.col-check {
		text-align: center;
		width: 90px;
	}

	.td-name { font-weight: 600; white-space: nowrap; }
	.td-email { font-size: 0.85rem; color: var(--color-text-muted, #6b7280); }

	.row-done { background: #f0fdf4; }

	.badge-ok {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: #dcfce7;
		color: #16a34a;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.badge-all {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: #16a34a;
		color: white;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.badge-no {
		display: inline-block;
		color: #d1d5db;
		font-size: 1rem;
	}

	@media (max-width: 900px) {
		.stats-row { grid-template-columns: repeat(2, 1fr); }
		.td-email { display: none; }
	}
</style>
