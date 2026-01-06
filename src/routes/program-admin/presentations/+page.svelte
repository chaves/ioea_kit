<script lang="ts">
	import { enhance } from '$app/forms';

	interface Presentation {
		id: number;
		id_auteur: number;
		titre: string;
		resume: string;
		lien: string;
		id_themes: number;
		rang: number;
		theme: string | null;
		lecwp: string | null;
		date_new: Date | null;
		prenom: string | null;
		nom: string | null;
	}

	interface Author {
		id: number;
		prenom: string;
		nom: string;
	}

	interface Theme {
		id: number;
		theme: string;
		lecwp: string;
		date_new: Date;
	}

	interface Props {
		data: {
			presentations: Presentation[];
			authors: Author[];
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
	let editingPresentation = $state<Presentation | null>(null);
	let deleteConfirm = $state<number | null>(null);

	function formatDisplayDate(date: Date | null): string {
		if (!date) return '—';
		const d = new Date(date);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}
</script>

<svelte:head>
	<title>Manage Presentations | Program Admin</title>
</svelte:head>

<div class="p-8">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-3xl font-bold mb-2">Presentations</h1>
			<p class="text-text-light">Manage lecture and workshop presentations</p>
		</div>
		<button
			onclick={() => {
				showCreateForm = !showCreateForm;
				editingPresentation = null;
			}}
			class="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
		>
			{showCreateForm ? 'Cancel' : '+ Add Presentation'}
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

	{#if showCreateForm || editingPresentation}
		<div class="bg-white rounded-lg border border-border p-6 shadow-sm mb-6">
			<h2 class="text-xl font-bold mb-4">{editingPresentation ? 'Edit Presentation' : 'Create New Presentation'}</h2>
			<form
				method="POST"
				action="?/{editingPresentation ? 'update' : 'create'}"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							showCreateForm = false;
							editingPresentation = null;
						}
					};
				}}
			>
				{#if editingPresentation}
					<input type="hidden" name="id" value={editingPresentation.id} />
				{/if}

				<div class="mb-4">
					<label for="titre" class="block text-sm font-semibold mb-2">Title *</label>
					<input
						type="text"
						id="titre"
						name="titre"
						value={editingPresentation?.titre || ''}
						required
						placeholder="Presentation title"
						class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label for="id_auteur" class="block text-sm font-semibold mb-2">Author *</label>
						<select
							id="id_auteur"
							name="id_auteur"
							value={editingPresentation?.id_auteur || ''}
							required
							class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="">Select an author...</option>
							{#each data.authors as author}
								<option value={author.id}>{author.prenom} {author.nom}</option>
							{/each}
						</select>
						<p class="text-sm text-text-light mt-1">
							<a href="/program-admin/authors" class="text-primary hover:underline">Manage authors</a>
						</p>
					</div>

					<div>
						<label for="id_themes" class="block text-sm font-semibold mb-2">Theme *</label>
						<select
							id="id_themes"
							name="id_themes"
							value={editingPresentation?.id_themes || ''}
							required
							class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="">Select a theme...</option>
							{#each data.themes as theme}
								<option value={theme.id}>
									{theme.theme} ({theme.lecwp === 'lectures' ? 'Lecture' : 'Workshop'})
								</option>
							{/each}
						</select>
						<p class="text-sm text-text-light mt-1">
							<a href="/program-admin/themes" class="text-primary hover:underline">Manage themes</a>
						</p>
					</div>
				</div>

				<div class="mb-4">
					<label for="resume" class="block text-sm font-semibold mb-2">Abstract / Resume</label>
					<textarea
						id="resume"
						name="resume"
						value={editingPresentation?.resume || ''}
						rows="6"
						placeholder="Presentation abstract or summary..."
						class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
					></textarea>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					<div>
						<label for="lien" class="block text-sm font-semibold mb-2">Link / PDF Filename</label>
						<input
							type="text"
							id="lien"
							name="lien"
							value={editingPresentation?.lien || ''}
							placeholder="presentation.pdf or https://..."
							class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="rang" class="block text-sm font-semibold mb-2">Order / Rank</label>
						<input
							type="number"
							id="rang"
							name="rang"
							value={editingPresentation?.rang || 1}
							min="1"
							class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						/>
						<p class="text-sm text-text-light mt-1">Display order within theme</p>
					</div>
				</div>

				<div class="flex gap-3">
					<button
						type="submit"
						class="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
					>
						{editingPresentation ? 'Update Presentation' : 'Create Presentation'}
					</button>
					<button
						type="button"
						onclick={() => {
							showCreateForm = false;
							editingPresentation = null;
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
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-bg border-b border-border">
					<tr>
						<th class="text-left px-6 py-4 font-semibold text-sm">Title</th>
						<th class="text-left px-6 py-4 font-semibold text-sm">Author</th>
						<th class="text-left px-6 py-4 font-semibold text-sm">Theme</th>
						<th class="text-left px-6 py-4 font-semibold text-sm">Type</th>
						<th class="text-left px-6 py-4 font-semibold text-sm">Date</th>
						<th class="text-center px-6 py-4 font-semibold text-sm">Rank</th>
						<th class="text-right px-6 py-4 font-semibold text-sm">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if data.presentations.length === 0}
						<tr>
							<td colspan="7" class="text-center px-6 py-8 text-text-light">
								No presentations found. Add your first presentation to get started.
							</td>
						</tr>
					{:else}
						{#each data.presentations as presentation}
							<tr class="border-b border-border hover:bg-bg transition-colors duration-150">
								<td class="px-6 py-4">
									<div class="font-semibold">{presentation.titre}</div>
									{#if presentation.lien}
										<div class="text-sm text-text-light mt-1">{presentation.lien}</div>
									{/if}
								</td>
								<td class="px-6 py-4 text-text-light">
									{presentation.prenom || ''} {presentation.nom || '—'}
								</td>
								<td class="px-6 py-4 text-text-light text-sm">{presentation.theme || '—'}</td>
								<td class="px-6 py-4">
									{#if presentation.lecwp}
										<span class="inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase {presentation.lecwp === 'lectures' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">
											{presentation.lecwp === 'lectures' ? 'Lecture' : 'Workshop'}
										</span>
									{:else}
										<span class="text-text-light">—</span>
									{/if}
								</td>
								<td class="px-6 py-4 text-text-light text-sm">
									{formatDisplayDate(presentation.date_new)}
								</td>
								<td class="px-6 py-4 text-center text-text-light">{presentation.rang}</td>
								<td class="px-6 py-4">
									<div class="flex items-center justify-end gap-2">
										<button
											onclick={() => {
												editingPresentation = presentation;
												showCreateForm = false;
											}}
											class="text-primary hover:text-primary-dark font-semibold px-3 py-1.5 rounded hover:bg-primary/10 transition-colors duration-150"
										>
											Edit
										</button>
										{#if deleteConfirm === presentation.id}
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
												<input type="hidden" name="id" value={presentation.id} />
												<button
													type="submit"
													class="text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded hover:bg-red-50 transition-colors duration-150"
												>
													Confirm
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
												onclick={() => deleteConfirm = presentation.id}
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
</div>
