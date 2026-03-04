<script lang="ts">
	import * as XLSX from 'xlsx';

	let { data } = $props();

	const pct = (n: number) => data.stats.total > 0 ? Math.round((n / data.stats.total) * 100) : 0;

	function exportExcel() {
		const rows = data.students.map((s) => ({
			'Last Name': s.lastName,
			'First Name': s.firstName,
			Email: s.email,
			University: s.university,
			Profile: s.profileValidated ? 'Yes' : 'No',
			Paper: s.paperValidated ? 'Yes' : 'No',
			Travel: s.travelValidated ? 'Yes' : 'No',
			'All Validated': s.allValidated ? 'Yes' : 'No',
		}));
		const ws = XLSX.utils.json_to_sheet(rows);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Students');
		XLSX.writeFile(wb, `IOEA${data.year}_students_validation.xlsx`);
	}
</script>

<svelte:head>
	<title>Students Validation | IOEA {data.year}</title>
</svelte:head>

<div class="page">
	<header class="sv-header">
		<div>
			<h1>Students Validation</h1>
			<p class="subtitle">IOEA {data.year} — {data.stats.total} accepted students</p>
		</div>
		<button class="btn-export" onclick={exportExcel}>Export Excel</button>
	</header>

	<!-- Stats -->
	<div class="stats-row">
		<div class="stat-card stat-card--green">
			<div class="stat-value">{data.stats.allValidated}</div>
			<div class="stat-label">All sections validated</div>
			<div class="stat-bar">
				<div class="stat-bar-fill stat-bar-fill--green" style="width: {pct(data.stats.allValidated)}%"></div>
			</div>
			<div class="stat-pct">{pct(data.stats.allValidated)}%</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{data.stats.profileCount}</div>
			<div class="stat-label">Profile</div>
			<div class="stat-bar">
				<div class="stat-bar-fill" style="width: {pct(data.stats.profileCount)}%"></div>
			</div>
			<div class="stat-pct">{pct(data.stats.profileCount)}%</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{data.stats.paperCount}</div>
			<div class="stat-label">Paper</div>
			<div class="stat-bar">
				<div class="stat-bar-fill" style="width: {pct(data.stats.paperCount)}%"></div>
			</div>
			<div class="stat-pct">{pct(data.stats.paperCount)}%</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{data.stats.travelCount}</div>
			<div class="stat-label">Travel</div>
			<div class="stat-bar">
				<div class="stat-bar-fill" style="width: {pct(data.stats.travelCount)}%"></div>
			</div>
			<div class="stat-pct">{pct(data.stats.travelCount)}%</div>
		</div>
	</div>

	<!-- Table -->
	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th class="th-left">Name</th>
					<th class="th-left th-email">Email</th>
					<th class="th-left">University</th>
					<th class="th-check">Profile</th>
					<th class="th-check">Paper</th>
					<th class="th-check">Travel</th>
					<th class="th-check">All done</th>
				</tr>
			</thead>
			<tbody>
				{#each data.students as s}
					<tr class="{s.allValidated ? 'row-done' : ''}">
						<td class="td-name">{s.lastName}, {s.firstName}</td>
						<td class="td-email">{s.email}</td>
						<td class="td-university">{s.university}</td>
						<td class="td-check">
							{#if s.profileValidated}
								<span class="badge-ok">✓</span>
							{:else}
								<span class="badge-no">—</span>
							{/if}
						</td>
						<td class="td-check">
							{#if s.paperValidated}
								<span class="badge-ok">✓</span>
							{:else}
								<span class="badge-no">—</span>
							{/if}
						</td>
						<td class="td-check">
							{#if s.travelValidated}
								<span class="badge-ok">✓</span>
							{:else}
								<span class="badge-no">—</span>
							{/if}
						</td>
						<td class="td-check">
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
</div>

<style>
	.page {
		padding: 2rem 2.5rem;
		max-width: 1100px;
	}

	.sv-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.btn-export {
		flex-shrink: 0;
		padding: 0.5rem 1rem;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.btn-export:hover { opacity: 0.85; }

	.sv-header h1 {
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--color-primary);
		margin: 0 0 0.25rem;
	}

	.subtitle {
		font-size: 0.875rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0;
	}

	/* Stats */
	.stats-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.625rem;
		padding: 1.25rem 1.5rem;
		text-align: center;
	}

	.stat-card--green { border-color: #86efac; background: #f0fdf4; }

	.stat-value {
		font-size: 2.25rem;
		font-weight: 700;
		color: var(--color-primary);
		line-height: 1;
		margin-bottom: 0.4rem;
	}

	.stat-card--green .stat-value { color: #16a34a; }

	.stat-label {
		font-size: 0.75rem;
		color: var(--color-text-muted, #6b7280);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.stat-bar {
		height: 6px;
		background: #e5e7eb;
		border-radius: 9999px;
		overflow: hidden;
		margin-bottom: 0.4rem;
	}

	.stat-bar-fill {
		height: 100%;
		background: var(--color-primary);
		border-radius: 9999px;
		transition: width 0.4s ease;
	}

	.stat-bar-fill--green { background: #16a34a; }

	.stat-pct {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-muted, #9ca3af);
	}

	/* Table */
	.table-wrap {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.625rem;
		overflow: hidden;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	thead tr {
		background: var(--color-primary);
	}

	th {
		color: white;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 0.875rem 1rem;
		white-space: nowrap;
	}

	.th-left { text-align: left; }
	.th-check { text-align: center; width: 80px; }
	.th-email { width: 220px; }

	tbody tr {
		border-bottom: 1px solid var(--color-border);
		transition: background 0.1s;
	}

	tbody tr:last-child { border-bottom: none; }
	tbody tr:hover { background: #faf9fb; }
	tbody tr.row-done { background: #f0fdf4; }
	tbody tr.row-done:hover { background: #dcfce7; }

	td {
		padding: 0.75rem 1rem;
		vertical-align: middle;
	}

	.td-name {
		font-weight: 600;
		color: var(--color-text, #111827);
		white-space: nowrap;
	}

	.td-email {
		color: var(--color-text-muted, #6b7280);
		font-size: 0.8rem;
	}

	.td-university {
		color: var(--color-text, #374151);
	}

	.td-check { text-align: center; }

	.badge-ok {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #dcfce7;
		color: #16a34a;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.badge-all {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #16a34a;
		color: white;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.badge-no {
		color: #d1d5db;
		font-size: 1rem;
		line-height: 1;
	}

	@media (max-width: 900px) {
		.page { padding: 1.25rem; }
		.stats-row { grid-template-columns: repeat(2, 1fr); }
		.th-email, .td-email { display: none; }
	}
</style>
