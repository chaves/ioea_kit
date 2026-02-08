<script lang="ts">
	import { enhance } from '$app/forms';

	interface User {
		id: number;
		email: string;
		name: string;
		active: boolean | null;
		must_change_password: boolean | null;
		created_at: Date | string | null;
		roleNames: string[];
	}

	interface Role {
		id: number;
		name: string;
	}

	interface Props {
		data: {
			users: User[];
			roles: Role[];
		};
		form?: {
			error?: string;
			success?: boolean;
			message?: string;
			action?: string;
		};
	}

	let { data, form }: Props = $props();
	let editingUser = $state<User | null>(null);
	let showCreateForm = $state(false);

	const stats = $derived({
		total: data.users.length,
		active: data.users.filter((u) => u.active !== false).length,
		inactive: data.users.filter((u) => u.active === false).length,
	});

	const roleCounts = $derived(() => {
		const counts: Record<string, number> = {};
		for (const user of data.users) {
			for (const role of user.roleNames) {
				counts[role] = (counts[role] || 0) + 1;
			}
		}
		return counts;
	});

	function toggleCreateForm() {
		showCreateForm = !showCreateForm;
	}

	function startEdit(user: User) {
		editingUser = { ...user, roleNames: [...user.roleNames] };
	}

	function cancelEdit() {
		editingUser = null;
	}
</script>

<svelte:head>
	<title>User Management | IOEA Admin</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<h1>User Management</h1>
		<button type="button" class="btn btn-primary" onclick={toggleCreateForm}>
			{showCreateForm ? 'Cancel' : '+ New User'}
		</button>
	</header>

	{#if form?.message}
		<div class="alert {form.success ? 'alert-success' : 'alert-error'}">
			{form.message}
		</div>
	{/if}
	{#if form?.error && !form?.message}
		<div class="alert alert-error">
			{form.error}
		</div>
	{/if}

	<!-- Stats -->
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-value">{stats.total}</span>
			<span class="stat-label">Total Users</span>
		</div>
		<div class="stat-card stat-success">
			<span class="stat-value">{stats.active}</span>
			<span class="stat-label">Active</span>
		</div>
		<div class="stat-card stat-danger">
			<span class="stat-value">{stats.inactive}</span>
			<span class="stat-label">Inactive</span>
		</div>
		{#each Object.entries(roleCounts()) as [role, count]}
			<div class="stat-card">
				<span class="stat-value">{count}</span>
				<span class="stat-label capitalize">{role}</span>
			</div>
		{/each}
	</div>

	<!-- Create User Form -->
	{#if showCreateForm}
		<div class="form-card">
			<h2>Create New User</h2>
			<form method="POST" action="?/create" use:enhance={() => {
				return async ({ update }) => {
					await update();
					if (form?.success && form?.action === 'create') {
						showCreateForm = false;
					}
				};
			}}>
				<div class="form-row">
					<div class="form-group">
						<label for="create-name" class="form-label">Name</label>
						<input type="text" id="create-name" name="name" class="form-input" required />
					</div>
					<div class="form-group">
						<label for="create-email" class="form-label">Email</label>
						<input type="email" id="create-email" name="email" class="form-input" required />
					</div>
				</div>

				<div class="form-group">
					<label class="form-label">Roles</label>
					<div class="checkbox-group">
						{#each data.roles as role}
							<label class="checkbox-label">
								<input type="checkbox" name="roles" value={role.name} />
								<span class="capitalize">{role.name}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="form-group">
					<label class="checkbox-label">
						<input type="checkbox" name="sendEmail" checked />
						<span>Send welcome email with credentials</span>
					</label>
				</div>

				<button type="submit" class="btn btn-primary">Create User</button>
			</form>
		</div>
	{/if}

	<!-- Users Table -->
	<div class="table-container">
		<table class="data-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Roles</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user}
					{#if editingUser?.id === user.id}
						<!-- Edit mode -->
						<tr class="editing-row">
							<td colspan="5">
								<form method="POST" action="?/update" use:enhance={() => {
									return async ({ update }) => {
										await update();
										if (form?.success && form?.action === 'update') {
											editingUser = null;
										}
									};
								}}>
									<input type="hidden" name="userId" value={user.id} />
									<div class="edit-form">
										<div class="form-row">
											<div class="form-group">
												<label class="form-label">Name</label>
												<input type="text" name="name" class="form-input" value={editingUser.name} required />
											</div>
											<div class="form-group">
												<label class="form-label">Email</label>
												<input type="email" name="email" class="form-input" value={editingUser.email} required />
											</div>
										</div>
										<div class="form-row">
											<div class="form-group">
												<label class="form-label">Roles</label>
												<div class="checkbox-group">
													{#each data.roles as role}
														<label class="checkbox-label">
															<input type="checkbox" name="roles" value={role.name} checked={editingUser.roleNames.includes(role.name)} />
															<span class="capitalize">{role.name}</span>
														</label>
													{/each}
												</div>
											</div>
											<div class="form-group">
												<label class="checkbox-label">
													<input type="checkbox" name="active" checked={editingUser.active !== false} />
													<span>Active</span>
												</label>
											</div>
										</div>
										<div class="edit-actions">
											<button type="submit" class="btn btn-primary btn-sm">Save</button>
											<button type="button" class="btn btn-secondary btn-sm" onclick={() => cancelEdit()}>Cancel</button>
										</div>
									</div>
								</form>
							</td>
						</tr>
					{:else}
						<!-- View mode -->
						<tr>
							<td class="font-medium">{user.name}</td>
							<td>{user.email}</td>
							<td>
								<div class="role-badges">
									{#each user.roleNames as role}
										<span class="badge badge-{role}">{role}</span>
									{/each}
								</div>
							</td>
							<td>
								{#if user.active !== false}
									<span class="status-badge status-active">Active</span>
								{:else}
									<span class="status-badge status-inactive">Inactive</span>
								{/if}
							</td>
							<td>
								<div class="action-buttons">
									<button type="button" class="btn btn-secondary btn-sm" onclick={() => startEdit(user)}>Edit</button>
									<form method="POST" action="?/resetPassword" use:enhance class="inline-form">
										<input type="hidden" name="userId" value={user.id} />
										<button type="submit" class="btn btn-warning btn-sm">Reset Password</button>
									</form>
									<form method="POST" action="?/delete" use:enhance={() => {
										return async ({ update }) => {
											if (confirm(`Delete user "${user.name}"?`)) {
												await update();
											}
										};
									}} class="inline-form">
										<input type="hidden" name="userId" value={user.id} />
										<button type="submit" class="btn btn-danger btn-sm">Delete</button>
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
	.admin-page {
		padding: 2rem;
	}

	.auth-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.auth-header h1 {
		margin: 0;
		font-size: 1.75rem;
	}

	/* Stats */
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

	.stat-value {
		display: block;
		font-size: 1.75rem;
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

	/* Form card */
	.form-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.form-card h2 {
		margin: 0 0 1.5rem;
		font-size: 1.25rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.checkbox-group {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.capitalize {
		text-transform: capitalize;
	}

	/* Table */
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

	.font-medium {
		font-weight: 500;
	}

	/* Badges */
	.role-badges {
		display: flex;
		gap: 0.35rem;
		flex-wrap: wrap;
	}

	.badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: capitalize;
	}

	.badge-admin {
		background: #ede9fe;
		color: #5b21b6;
	}

	.badge-reviewer {
		background: #dbeafe;
		color: #1e40af;
	}

	.badge-student {
		background: #d1fae5;
		color: #065f46;
	}

	.badge-program-admin {
		background: #fef3c7;
		color: #92400e;
	}

	.status-badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.status-active {
		background: #d1fae5;
		color: #065f46;
	}

	.status-inactive {
		background: #fee2e2;
		color: #991b1b;
	}

	/* Action buttons */
	.action-buttons {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.inline-form {
		display: inline;
	}

	.btn-sm {
		padding: 0.35rem 0.75rem;
		font-size: 0.8rem;
	}

	.btn-secondary {
		background: var(--color-bg-alt);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-secondary:hover {
		background: var(--color-border);
	}

	.btn-warning {
		background: #fef3c7;
		color: #92400e;
		border: 1px solid #fcd34d;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-warning:hover {
		background: #fde68a;
	}

	.btn-danger {
		background: #fee2e2;
		color: #991b1b;
		border: 1px solid #fca5a5;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-danger:hover {
		background: #fecaca;
	}

	/* Edit form in table */
	.editing-row {
		background: #f8fafc;
	}

	.editing-row td {
		padding: 1.5rem;
	}

	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.edit-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	/* Alerts */
	.alert {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}

	.alert-success {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #166534;
	}

	.alert-error {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #991b1b;
	}

	@media (max-width: 767px) {
		.form-row {
			grid-template-columns: 1fr;
		}

		.table-container {
			overflow-x: auto;
		}

		.action-buttons {
			flex-direction: column;
		}
	}
</style>
