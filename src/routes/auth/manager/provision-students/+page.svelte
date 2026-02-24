<script lang="ts">
	import { enhance } from '$app/forms';

	interface Student {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		university: string;
		hasAccount: boolean;
	}

	interface Props {
		data: {
			students: Student[];
			year: number;
			stats: { total: number; provisioned: number; pending: number };
		};
		form?: { success?: boolean; message?: string; error?: string };
	}

	let { data, form }: Props = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Provision Student Accounts | IOEA Admin</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<div>
			<h1>Provision Student Accounts</h1>
			<p class="subtitle">IOEA {data.year} — accepted submissions only</p>
		</div>
	</header>

	{#if form?.message}
		<div class="alert {form.success ? 'alert-success' : 'alert-error'}">
			{form.message}
		</div>
	{/if}
	{#if form?.error}
		<div class="alert alert-error">{form.error}</div>
	{/if}

	<div class="stats-row">
		<div class="stat-card">
			<div class="stat-value">{data.stats.total}</div>
			<div class="stat-label">Accepted students</div>
		</div>
		<div class="stat-card">
			<div class="stat-value provisioned">{data.stats.provisioned}</div>
			<div class="stat-label">Accounts created</div>
		</div>
		<div class="stat-card">
			<div class="stat-value pending">{data.stats.pending}</div>
			<div class="stat-label">Pending accounts</div>
		</div>
	</div>

	{#if data.students.length === 0}
		<p class="empty-state">No accepted submissions found for {data.year}.</p>
	{:else}
		{#if data.stats.pending > 0}
			<div class="bulk-action">
				<form
					method="POST"
					action="?/provisionAll"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<button type="submit" class="btn btn-primary" disabled={loading}>
						{loading
							? 'Creating accounts…'
							: `Create all ${data.stats.pending} pending account${data.stats.pending !== 1 ? 's' : ''}`}
					</button>
				</form>
				<p class="hint">
					Creates student accounts with random temporary passwords and sends welcome emails.
					Students must change their password on first login.
				</p>
			</div>
		{:else}
			<div class="all-done">
				All {data.stats.total} accepted students have been provisioned.
			</div>
		{/if}

		<table class="data-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>University</th>
					<th>Status</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each data.students as student}
					<tr class={student.hasAccount ? '' : 'row-pending'}>
						<td>{student.lastName}, {student.firstName}</td>
						<td>{student.email}</td>
						<td>{student.university}</td>
						<td>
							{#if student.hasAccount}
								<span class="badge badge-success">Created</span>
							{:else}
								<span class="badge badge-pending">Pending</span>
							{/if}
						</td>
						<td>
							{#if !student.hasAccount}
								<form method="POST" action="?/provision" use:enhance>
									<input type="hidden" name="submission_id" value={student.id} />
									<button type="submit" class="btn btn-sm btn-secondary">Create account</button>
								</form>
							{:else}
								<span class="text-muted">—</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.subtitle {
		font-size: 0.9rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0.25rem 0 0;
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-value.provisioned {
		color: #16a34a;
	}

	.stat-value.pending {
		color: #d97706;
	}

	.bulk-action {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1.25rem 1.5rem;
		background: #fffbeb;
		border: 1px solid #fcd34d;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.hint {
		font-size: 0.875rem;
		color: #92400e;
		margin: 0;
		max-width: 40rem;
	}

	.all-done {
		padding: 1rem 1.5rem;
		background: #f0fdf4;
		color: #166534;
		border-radius: 0.5rem;
		border: 1px solid #bbf7d0;
		margin-bottom: 1.5rem;
		font-weight: 500;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: var(--color-text-muted, #6b7280);
	}

	.row-pending {
		background: #fffdf0;
	}

	.badge {
		display: inline-block;
		padding: 0.2rem 0.65rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.badge-success {
		background: #dcfce7;
		color: #166534;
	}

	.badge-pending {
		background: #fef9c3;
		color: #854d0e;
	}

	.text-muted {
		color: var(--color-text-muted, #9ca3af);
	}

	.btn-sm {
		padding: 0.3rem 0.75rem;
		font-size: 0.8rem;
	}
</style>
