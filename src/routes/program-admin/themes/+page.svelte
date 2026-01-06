<script lang="ts">
	import { enhance } from '$app/forms';

	interface Theme {
		id: number;
		theme: string;
		lecwp: string;
		date_new: Date;
	}

	interface Props {
		data: {
			themes: Theme[];
		};
		form?: {
			error?: string;
			success?: boolean;
			message?: string;
		};
	}

	let { data, form }: Props = $props();
	let showCreateForm = $state(false);
	let editingTheme = $state<Theme | null>(null);
	let deleteConfirm = $state<number | null>(null);

	function formatDate(date: Date): string {
		const d = new Date(date);
		return d.toISOString().split('T')[0];
	}

	function formatDisplayDate(date: Date): string {
		const d = new Date(date);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}
</script>

<svelte:head>
	<title>Manage Themes | Program Admin</title>
</svelte:head>

<div class="p-8">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-3xl font-bold mb-2">Themes</h1>
			<p class="text-text-light">Manage lecture and workshop themes</p>
		</div>
		<button
			onclick={() => {
				showCreateForm = !showCreateForm;
				editingTheme = null;
			}}
			class="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
		>
			{showCreateForm ? 'Cancel' : '+ Add Theme'}
		</button>
	</div>

	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
			{form.error}
		</div>
	{/if}

	{#if form?.success && form?.message}
		<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
			{form.message}
		</div>
	{/if}

	{#if showCreateForm || editingTheme}
		<div class="bg-white rounded-lg border border-border p-6 shadow-sm mb-6">
			<h2 class="text-xl font-bold mb-4">{editingTheme ? 'Edit Theme' : 'Create New Theme'}</h2>
			<form
				method="POST"
				action="?/{editingTheme ? 'update' : 'create'}"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							showCreateForm = false;
							editingTheme = null;
						}
					};
				}}
			>
				{#if editingTheme}
					<input type="hidden" name="id" value={editingTheme.id} />
				{/if}

				<div class="mb-4">
					<label for="theme" class="block text-sm font-semibold mb-2">Theme Name *</label>
					<input
						type="text"
						id="theme"
						name="theme"
						value={editingTheme?.theme || ''}
						required
						placeholder="e.g., Ocean Dynamics and Climate Change"
						class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					<div>
						<label for="lecwp" class="block text-sm font-semibold mb-2">Type *</label>
						<select
							id="lecwp"
							name="lecwp"
							value={editingTheme?.lecwp || 'lectures'}
							required
							class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="lectures">Lecture</option>
							<option value="workshops">Workshop</option>
						</select>
					</div>

					<div>
						<label for="date_new" class="block text-sm font-semibold mb-2">Date *</label>
						<input
							type="date"
							id="date_new"
							name="date_new"
							value={editingTheme ? formatDate(editingTheme.date_new) : ''}
							required
							class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>

				<div class="flex gap-3">
					<button
						type="submit"
						class="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
					>
						{editingTheme ? 'Update Theme' : 'Create Theme'}
					</button>
					<button
						type="button"
						onclick={() => {
							showCreateForm = false;
							editingTheme = null;
						}}
						class="bg-border text-text px-6 py-2.5 rounded-lg font-semibold hover:bg-border/80 transition-colors duration-200"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
		<table class="w-full">
			<thead class="bg-bg border-b border-border">
				<tr>
					<th class="text-left px-6 py-4 font-semibold text-sm">Theme</th>
					<th class="text-left px-6 py-4 font-semibold text-sm">Type</th>
					<th class="text-left px-6 py-4 font-semibold text-sm">Date</th>
					<th class="text-right px-6 py-4 font-semibold text-sm">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.themes.length === 0}
					<tr>
						<td colspan="4" class="text-center px-6 py-8 text-text-light">
							No themes found. Add your first theme to get started.
						</td>
					</tr>
				{:else}
					{#each data.themes as theme}
						<tr class="border-b border-border hover:bg-bg transition-colors duration-150">
							<td class="px-6 py-4">
								<div class="font-semibold">{theme.theme}</div>
							</td>
							<td class="px-6 py-4">
								<span class="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase {theme.lecwp === 'lectures' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">
									{theme.lecwp === 'lectures' ? 'Lecture' : 'Workshop'}
								</span>
							</td>
							<td class="px-6 py-4 text-text-light">{formatDisplayDate(theme.date_new)}</td>
							<td class="px-6 py-4">
								<div class="flex items-center justify-end gap-2">
									<button
										onclick={() => {
											editingTheme = theme;
											showCreateForm = false;
										}}
										class="text-primary hover:text-primary-dark font-semibold px-3 py-1.5 rounded hover:bg-primary/10 transition-colors duration-150"
									>
										Edit
									</button>
									{#if deleteConfirm === theme.id}
										<form
											method="POST"
											action="?/delete"
											use:enhance={() => {
												return async ({ result, update }) => {
													await update();
													deleteConfirm = null;
												};
											}}
											class="inline"
										>
											<input type="hidden" name="id" value={theme.id} />
											<button
												type="submit"
												class="text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded hover:bg-red-50 transition-colors duration-150"
											>
												Confirm Delete
											</button>
										</form>
										<button
											onclick={() => deleteConfirm = null}
											class="text-text-light hover:text-text font-semibold px-3 py-1.5 rounded hover:bg-bg transition-colors duration-150"
										>
											Cancel
										</button>
									{:else}
										<button
											onclick={() => deleteConfirm = theme.id}
											class="text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded hover:bg-red-50 transition-colors duration-150"
										>
											Delete
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
