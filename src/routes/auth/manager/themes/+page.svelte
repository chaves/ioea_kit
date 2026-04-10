<script lang="ts">
	import { enhance } from '$app/forms';

	interface Theme {
		id: number;
		theme: string;
		lecwp: string;
		date_new: Date | string;
		presentationCount: number;
	}

	interface Props {
		data: { themes: Theme[] };
		form?: { error?: string; success?: boolean; message?: string; action?: string };
	}

	let { data, form }: Props = $props();

	let showCreateForm = $state(false);
	let editingId = $state<number | null>(null);
	let editingData = $state<Theme | null>(null);

	function year(t: Theme): number {
		return new Date(t.date_new).getFullYear();
	}

	function toDateInput(d: Date | string): string {
		return new Date(d).toISOString().slice(0, 10);
	}

	function formatDate(d: Date | string): string {
		return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
	}

	function startEdit(t: Theme) {
		editingId = t.id;
		editingData = { ...t };
	}

	function cancelEdit() {
		editingId = null;
		editingData = null;
	}
</script>

<svelte:head>
	<title>Themes | IOEA Admin</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<h1>Themes</h1>
		<button type="button" class="btn btn-primary" onclick={() => (showCreateForm = !showCreateForm)}>
			{showCreateForm ? 'Cancel' : '+ New Theme'}
		</button>
	</header>

	{#if form?.message}
		<div class="alert {form.success ? 'alert-success' : 'alert-error'}">{form.message}</div>
	{/if}
	{#if form?.error && !form?.message}
		<div class="alert alert-error">{form.error}</div>
	{/if}

	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-value">{data.themes.length}</span>
			<span class="stat-label">Themes</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.themes.reduce((s, t) => s + t.presentationCount, 0)}</span>
			<span class="stat-label">Presentations</span>
		</div>
	</div>

	{#if showCreateForm}
		<div class="form-card">
			<h2>New Theme</h2>
			<form method="POST" action="?/create" use:enhance={() => {
				return async ({ update }) => {
					await update();
					if (form?.success && form?.action === 'create') showCreateForm = false;
				};
			}}>
				<div class="form-group">
					<label for="c-theme" class="form-label">Theme name *</label>
					<input id="c-theme" type="text" name="theme" class="form-input" required />
				</div>
				<div class="form-row">
					<div class="form-group">
						<label for="c-date" class="form-label">Date (year) *</label>
						<input id="c-date" type="date" name="date_new" class="form-input" required />
					</div>
					<div class="form-group">
						<label for="c-lecwp" class="form-label">Type</label>
						<select id="c-lecwp" name="lecwp" class="form-input">
							<option value="lectures">lectures</option>
							<option value="wp">wp</option>
						</select>
					</div>
				</div>
				<button type="submit" class="btn btn-primary">Create</button>
			</form>
		</div>
	{/if}

	<div class="table-container">
		<table class="data-table">
			<thead>
				<tr>
					<th>Year</th>
					<th>Date</th>
					<th>Theme</th>
					<th>Type</th>
					<th>Presentations</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.themes as t}
					{#if editingId === t.id && editingData}
						<tr class="editing-row">
							<td colspan="6">
								<form method="POST" action="?/update" use:enhance={() => {
									return async ({ update }) => {
										await update();
										if (form?.success && form?.action === 'update') cancelEdit();
									};
								}}>
									<input type="hidden" name="id" value={t.id} />
									<div class="edit-form">
										<div class="form-group">
											<label for={`e-theme-${t.id}`} class="form-label">Theme name *</label>
											<input id={`e-theme-${t.id}`} type="text" name="theme" class="form-input" value={editingData.theme} required />
										</div>
										<div class="form-row">
											<div class="form-group">
												<label for={`e-date-${t.id}`} class="form-label">Date</label>
												<input id={`e-date-${t.id}`} type="date" name="date_new" class="form-input" value={toDateInput(editingData.date_new)} />
											</div>
											<div class="form-group">
												<label for={`e-lecwp-${t.id}`} class="form-label">Type</label>
												<select id={`e-lecwp-${t.id}`} name="lecwp" class="form-input">
													<option value="lectures" selected={editingData.lecwp === 'lectures'}>lectures</option>
													<option value="wp" selected={editingData.lecwp === 'wp'}>wp</option>
												</select>
											</div>
										</div>
										<div class="edit-actions">
											<button type="submit" class="btn btn-primary btn-sm">Save</button>
											<button type="button" class="btn btn-secondary btn-sm" onclick={cancelEdit}>Cancel</button>
										</div>
									</div>
								</form>
							</td>
						</tr>
					{:else}
						<tr>
							<td class="year-badge-cell">
								<span class="year-badge">{year(t)}</span>
							</td>
							<td class="text-sm text-muted">{formatDate(t.date_new)}</td>
							<td class="font-medium">{t.theme}</td>
							<td><span class="type-badge type-{t.lecwp}">{t.lecwp}</span></td>
							<td>{t.presentationCount}</td>
							<td>
								<div class="action-buttons">
									<button type="button" class="btn btn-secondary btn-sm" onclick={() => startEdit(t)}>Edit</button>
									<form method="POST" action="?/delete" use:enhance={() => {
										return async ({ update }) => {
											if (confirm(`Delete theme "${t.theme}"?`)) await update();
										};
									}} class="inline-form">
										<input type="hidden" name="id" value={t.id} />
										<button type="submit" class="btn btn-danger btn-sm" disabled={t.presentationCount > 0} title={t.presentationCount > 0 ? `${t.presentationCount} presentation(s) use this theme` : ''}>
											Delete
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.admin-page { padding: 2rem; }

	.auth-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}
	.auth-header h1 { margin: 0; font-size: 1.75rem; }

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}
	.stat-card {
		background: white;
		padding: 1.25rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		text-align: center;
	}
	.stat-value { display: block; font-size: 1.75rem; font-weight: 700; color: var(--color-primary); }
	.stat-label { font-size: 0.85rem; color: var(--color-text-light); }

	.form-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}
	.form-card h2 { margin: 0 0 1.5rem; font-size: 1.25rem; }
	.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.form-group { margin-bottom: 1rem; }

	.table-container {
		background: white;
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid var(--color-border);
	}
	.data-table { width: 100%; border-collapse: collapse; }
	.data-table th, .data-table td {
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

	.font-medium { font-weight: 500; }
	.text-sm { font-size: 0.875rem; }
	.text-muted { color: var(--color-text-light); }

	.year-badge-cell { width: 80px; }
	.year-badge {
		display: inline-block;
		background: var(--color-primary);
		color: white;
		padding: 0.2rem 0.6rem;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.type-badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}
	.type-lectures { background: #dbeafe; color: #1e40af; }
	.type-wp { background: #fef3c7; color: #92400e; }

	.action-buttons { display: flex; gap: 0.5rem; align-items: center; }
	.inline-form { display: inline; }
	.btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
	.btn-secondary {
		background: var(--color-bg-alt);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
	}
	.btn-secondary:hover { background: var(--color-border); }
	.btn-danger {
		background: #fee2e2;
		color: #991b1b;
		border: 1px solid #fca5a5;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
	}
	.btn-danger:hover { background: #fecaca; }
	.btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

	.editing-row { background: #f8fafc; }
	.editing-row td { padding: 1.5rem; }
	.edit-form { display: flex; flex-direction: column; gap: 0.25rem; }
	.edit-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }

	.alert { padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem; }
	.alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
	.alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }

	@media (max-width: 767px) {
		.form-row { grid-template-columns: 1fr; }
		.table-container { overflow-x: auto; }
	}
</style>
