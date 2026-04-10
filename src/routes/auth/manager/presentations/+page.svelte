<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { marked } from 'marked';

	interface Presentation {
		id: number;
		id_auteur: number;
		titre: string;
		resume: string;
		lien: string;
		id_themes: number;
		rang: number;
	}

	interface Author {
		id: number;
		prenom: string;
		nom: string;
		instit: string;
	}

	interface Theme {
		id: number;
		theme: string;
		date_new: Date | string;
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
			action?: string;
		};
	}

	let { data, form }: Props = $props();

	let showCreateForm = $state(false);
	let editingId = $state<number | null>(null);
	let editingData = $state<Presentation | null>(null);
	let previewCreate = $state(false);
	let createResume = $state('');
	let previewEdit = $state(false);

	// Upload state per presentation id
	let uploading = $state<Record<number, boolean>>({});
	let uploadError = $state<Record<number, string>>({});

	function authorLabel(a: Author) {
		return `${a.prenom} ${a.nom}${a.instit ? ` — ${a.instit}` : ''}`;
	}

	function authorName(id: number) {
		const a = data.authors.find((a) => a.id === id);
		return a ? `${a.prenom} ${a.nom}` : '—';
	}

	function startEdit(p: Presentation) {
		editingId = p.id;
		editingData = { ...p };
	}

	function cancelEdit() {
		editingId = null;
		editingData = null;
	}

	function themeYear(t: Theme | undefined): number {
		if (!t?.date_new) return 0;
		return new Date(t.date_new).getFullYear();
	}

	function lienType(lien: string): 'managed' | 'external' | 'legacy' | 'empty' {
		if (!lien) return 'empty';
		if (lien.startsWith('/slides/')) return 'managed';
		if (lien.includes('http')) return 'external';
		return 'legacy';
	}

	function resolvedLien(p: Presentation): string {
		// Same logic as public site for legacy files (bare filename → /pdf/textes_{year}/filename)
		if (!p.lien) return '';
		if (p.lien.startsWith('/') || p.lien.includes('http')) return p.lien;
		const themeById = new Map(data.themes.map((t) => [t.id, t]));
		const year = themeYear(themeById.get(p.id_themes));
		return `/pdf/textes_${year}/${p.lien}`;
	}

	async function handleFileSelect(p: Presentation, input: HTMLInputElement) {
		const file = input.files?.[0];
		if (!file) return;

		const themeById = new Map(data.themes.map((t) => [t.id, t]));
		const year = themeYear(themeById.get(p.id_themes)) || new Date().getFullYear();
		const author = data.authors.find((a) => a.id === p.id_auteur);

		uploading = { ...uploading, [p.id]: true };
		uploadError = { ...uploadError, [p.id]: '' };

		try {
			const fd = new FormData();
			fd.append('file', file);
			fd.append('year', String(year));
			if (author) {
				fd.append('lastName', author.nom);
				fd.append('firstName', author.prenom);
			}

			const res = await fetch('/auth/manager/presentations/upload', { method: 'POST', body: fd });
			if (!res.ok) {
				const msg = await res.text();
				uploadError = { ...uploadError, [p.id]: msg || 'Upload failed' };
				return;
			}

			const { path } = await res.json();

			// Persist new lien via form action
			const lienFd = new FormData();
			lienFd.append('id', String(p.id));
			lienFd.append('lien', path);
			await fetch('?/updateLien', { method: 'POST', body: lienFd });

			await invalidateAll();
		} catch {
			uploadError = { ...uploadError, [p.id]: 'Upload failed' };
		} finally {
			uploading = { ...uploading, [p.id]: false };
			input.value = '';
		}
	}

	// Group by year → theme, most recent year first
	const byYear = $derived(() => {
		const themeById = new Map(data.themes.map((t) => [t.id, t]));
		const yearMap = new Map<number, Map<number, { theme: Theme | undefined; items: Presentation[] }>>();

		for (const p of data.presentations) {
			const t = themeById.get(p.id_themes);
			const year = themeYear(t);
			if (!yearMap.has(year)) yearMap.set(year, new Map());
			const themeMap = yearMap.get(year)!;
			if (!themeMap.has(p.id_themes)) themeMap.set(p.id_themes, { theme: t, items: [] });
			themeMap.get(p.id_themes)!.items.push(p);
		}

		return [...yearMap.entries()]
			.sort(([a], [b]) => b - a)
			.map(([year, themeMap]) => ({
				year,
				themes: [...themeMap.values()].sort((a, b) => (a.theme?.id ?? 0) - (b.theme?.id ?? 0)),
			}));
	});
</script>

<svelte:head>
	<title>Presentations | IOEA Admin</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<h1>Presentations</h1>
		<button type="button" class="btn btn-primary" onclick={() => (showCreateForm = !showCreateForm)}>
			{showCreateForm ? 'Cancel' : '+ New Presentation'}
		</button>
	</header>

	{#if form?.message}
		<div class="alert {form.success ? 'alert-success' : 'alert-error'}">
			{form.message}
		</div>
	{/if}
	{#if form?.error && !form?.message}
		<div class="alert alert-error">{form.error}</div>
	{/if}

	<!-- Stats -->
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-value">{data.presentations.length}</span>
			<span class="stat-label">Total</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.themes.length}</span>
			<span class="stat-label">Themes</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.authors.length}</span>
			<span class="stat-label">Authors</span>
		</div>
	</div>

	<!-- Create form -->
	{#if showCreateForm}
		<div class="form-card">
			<h2>New Presentation</h2>
			<form
				method="POST"
				action="?/create"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						if (form?.success && form?.action === 'create') showCreateForm = false;
					};
				}}
			>
				<div class="form-row">
					<div class="form-group">
						<label for="c-titre" class="form-label">Title *</label>
						<input id="c-titre" type="text" name="titre" class="form-input" required />
					</div>
					<div class="form-group">
						<label for="c-lien" class="form-label">Link (URL)</label>
						<input id="c-lien" type="text" name="lien" class="form-input" placeholder="https://..." />
					</div>
				</div>

				<div class="form-row">
					<div class="form-group">
						<label for="c-auteur" class="form-label">Author</label>
						<select id="c-auteur" name="id_auteur" class="form-input">
							<option value="0">— No author —</option>
							{#each data.authors as a}
								<option value={a.id}>{authorLabel(a)}</option>
							{/each}
						</select>
					</div>
					<div class="form-group">
						<label for="c-theme" class="form-label">Theme</label>
						<select id="c-theme" name="id_themes" class="form-input">
							<option value="0">— No theme —</option>
							{#each data.themes as t}
								<option value={t.id}>{t.theme}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="form-group">
					<label for="c-rang" class="form-label">Order (rang)</label>
					<input id="c-rang" type="number" name="rang" class="form-input form-input-sm" value="1" min="1" />
				</div>

				<div class="form-group">
					<div class="md-label-row">
						<label for="c-resume" class="form-label">Abstract</label>
						<button type="button" class="md-toggle" onclick={() => (previewCreate = !previewCreate)}>
							{previewCreate ? 'Edit' : 'Preview'}
						</button>
					</div>
					{#if previewCreate}
						<div class="md-preview">{@html marked.parse(createResume)}</div>
					{:else}
						<textarea id="c-resume" name="resume" class="form-input" rows="5"
							bind:value={createResume}></textarea>
					{/if}
					{#if previewCreate}
						<!-- Keep the value in a hidden field when previewing -->
						<input type="hidden" name="resume" value={createResume} />
					{/if}
				</div>

				<button type="submit" class="btn btn-primary">Create</button>
			</form>
		</div>
	{/if}

	<!-- Presentations grouped by theme -->
	{#if data.presentations.length === 0}
		<p class="empty-state">No presentations yet.</p>
	{:else}
		{#each byYear() as { year, themes }}
			<section class="year-section">
				<h2 class="year-heading">{year > 0 ? year : 'Unknown year'}</h2>

				{#each themes as group}
					<div class="theme-block">
						<h3 class="theme-heading">{group.theme?.theme ?? `Theme #${group.theme?.id}`}</h3>

				<div class="table-container">
					<table class="data-table">
						<thead>
							<tr>
								<th>#</th>
								<th>Title</th>
								<th>Author</th>
								<th>Rang</th>
								<th>Link</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each group.items as p}
								{@const type = lienType(p.lien)}
								{@const href = resolvedLien(p)}
								{#if editingId === p.id && editingData}
									<tr class="editing-row">
										<td colspan="6">
											<form
												method="POST"
												action="?/update"
												use:enhance={() => {
													return async ({ update }) => {
														await update();
														if (form?.success && form?.action === 'update') cancelEdit();
													};
												}}
											>
												<input type="hidden" name="id" value={p.id} />
												<div class="edit-form">
													<div class="form-row">
														<div class="form-group">
															<label for={`e-titre-${p.id}`} class="form-label">Title *</label>
															<input
																id={`e-titre-${p.id}`}
																type="text"
																name="titre"
																class="form-input"
																value={editingData.titre}
																required
															/>
														</div>
														<div class="form-group">
															<label for={`e-lien-${p.id}`} class="form-label">Link</label>
															<input
																id={`e-lien-${p.id}`}
																type="text"
																name="lien"
																class="form-input"
																value={editingData.lien}
															/>
														</div>
													</div>

													<div class="form-row">
														<div class="form-group">
															<label for={`e-auteur-${p.id}`} class="form-label">Author</label>
															<select id={`e-auteur-${p.id}`} name="id_auteur" class="form-input">
																<option value="0">— No author —</option>
																{#each data.authors as a}
																	<option value={a.id} selected={a.id === editingData.id_auteur}
																		>{authorLabel(a)}</option
																	>
																{/each}
															</select>
														</div>
														<div class="form-group">
															<label for={`e-theme-${p.id}`} class="form-label">Theme</label>
															<select id={`e-theme-${p.id}`} name="id_themes" class="form-input">
																<option value="0">— No theme —</option>
																{#each data.themes as t}
																	<option value={t.id} selected={t.id === editingData.id_themes}
																		>{t.theme}</option
																	>
																{/each}
															</select>
														</div>
													</div>

													<div class="form-group">
														<label for={`e-rang-${p.id}`} class="form-label">Order (rang)</label>
														<input
															id={`e-rang-${p.id}`}
															type="number"
															name="rang"
															class="form-input form-input-sm"
															value={editingData.rang}
															min="1"
														/>
													</div>

													<div class="form-group">
														<div class="md-label-row">
															<label for={`e-resume-${p.id}`} class="form-label">Abstract</label>
															<button type="button" class="md-toggle" onclick={() => (previewEdit = !previewEdit)}>
																{previewEdit ? 'Edit' : 'Preview'}
															</button>
														</div>
														{#if previewEdit}
															<div class="md-preview">{@html marked.parse(editingData.resume)}</div>
															<input type="hidden" name="resume" value={editingData.resume} />
														{:else}
															<textarea
																id={`e-resume-${p.id}`}
																name="resume"
																class="form-input"
																rows="5"
																bind:value={editingData.resume}
															></textarea>
														{/if}
													</div>

													<div class="edit-actions">
														<button type="submit" class="btn btn-primary btn-sm">Save</button>
														<button
															type="button"
															class="btn btn-secondary btn-sm"
															onclick={cancelEdit}>Cancel</button
														>
													</div>
												</div>
											</form>
										</td>
									</tr>
								{:else}
									<tr>
										<td class="text-muted">{p.id}</td>
										<td class="font-medium">{p.titre}</td>
										<td>{authorName(p.id_auteur)}</td>
										<td>{p.rang}</td>
										<td class="file-cell">
											{#if type === 'managed'}
												<span class="file-badge badge-managed">Managed</span>
												<a href={href} target="_blank" rel="noopener noreferrer" class="link-sm">View</a>
											{:else if type === 'external'}
												<span class="file-badge badge-external">External URL</span>
												<a href={href} target="_blank" rel="noopener noreferrer" class="link-sm">View</a>
											{:else if type === 'legacy'}
												<span class="file-badge badge-legacy">Legacy</span>
												<a href={href} target="_blank" rel="noopener noreferrer" class="link-sm">View</a>
											{:else}
												<span class="text-muted">No file</span>
											{/if}

											{#if uploadError[p.id]}
												<span class="upload-error">{uploadError[p.id]}</span>
											{/if}

											<!-- Hidden file input -->
											<label class="btn btn-upload btn-sm" class:loading={uploading[p.id]}>
												{#if uploading[p.id]}
													Uploading…
												{:else if type === 'managed' || type === 'legacy' || type === 'external'}
													Replace
												{:else}
													Upload
												{/if}
												<input
													type="file"
													accept=".pdf,.ppt,.pptx"
													class="hidden-input"
													disabled={uploading[p.id]}
													onchange={(e) => handleFileSelect(p, e.currentTarget as HTMLInputElement)}
												/>
											</label>

											{#if type === 'managed'}
												<form
													method="POST"
													action="?/deleteFile"
													use:enhance={() => {
														return async ({ update }) => {
															if (confirm('Remove this file?')) await update();
														};
													}}
													class="inline-form"
												>
													<input type="hidden" name="id" value={p.id} />
													<input type="hidden" name="lien" value={p.lien} />
													<button type="submit" class="btn btn-danger btn-sm">Remove</button>
												</form>
											{/if}
										</td>
										<td>
											<div class="action-buttons">
												<button
													type="button"
													class="btn btn-secondary btn-sm"
													onclick={() => startEdit(p)}>Edit</button
												>
												<form
													method="POST"
													action="?/delete"
													use:enhance={() => {
														return async ({ update }) => {
															if (confirm(`Delete "${p.titre}"?`)) await update();
														};
													}}
													class="inline-form"
												>
													<input type="hidden" name="id" value={p.id} />
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
				{/each}
			</section>
		{/each}
	{/if}
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

	.form-input-sm {
		max-width: 120px;
	}

	.year-section {
		margin-bottom: 3rem;
	}

	.year-heading {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-primary);
		margin: 0 0 1.25rem;
		padding-bottom: 0.5rem;
		border-bottom: 3px solid var(--color-primary);
	}

	.theme-block {
		margin-bottom: 1.75rem;
	}

	.theme-heading {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-light);
		margin: 0 0 0.5rem;
		padding-left: 0.75rem;
		border-left: 3px solid var(--color-border);
	}

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

	.text-muted {
		color: var(--color-text-light);
		font-size: 0.9rem;
	}

	.link-sm {
		font-size: 0.85rem;
		color: var(--color-primary);
		display: block;
		margin-bottom: 0.25rem;
	}

	.file-cell {
		min-width: 160px;
	}

	.file-badge {
		display: inline-block;
		padding: 0.15rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.badge-managed {
		background: #d1fae5;
		color: #065f46;
	}

	.badge-external {
		background: #dbeafe;
		color: #1e40af;
	}

	.badge-legacy {
		background: #fef3c7;
		color: #92400e;
	}

	.btn-upload {
		display: inline-block;
		background: var(--color-bg-alt);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
		margin-top: 0.25rem;
		margin-right: 0.25rem;
	}

	.btn-upload:hover {
		background: var(--color-border);
	}

	.btn-upload.loading {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.hidden-input {
		display: none;
	}

	.upload-error {
		display: block;
		font-size: 0.75rem;
		color: #991b1b;
		margin-top: 0.2rem;
	}

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

	.editing-row {
		background: #f8fafc;
	}

	.editing-row td {
		padding: 1.5rem;
	}

	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.edit-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.md-label-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.25rem;
	}

	.md-toggle {
		font-size: 0.75rem;
		padding: 0.15rem 0.6rem;
		background: var(--color-bg-alt);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		cursor: pointer;
		color: var(--color-primary);
		transition: all 0.2s;
	}

	.md-toggle:hover { background: var(--color-border); }

	.md-preview {
		min-height: 120px;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background: var(--color-bg-alt);
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.md-preview :global(p) { margin: 0 0 0.75rem; }
	.md-preview :global(p:last-child) { margin-bottom: 0; }
	.md-preview :global(strong) { font-weight: 600; }
	.md-preview :global(em) { font-style: italic; }
	.md-preview :global(ul), .md-preview :global(ol) { padding-left: 1.5rem; margin: 0 0 0.75rem; }
	.md-preview :global(li) { margin-bottom: 0.25rem; }
	.md-preview :global(a) { color: var(--color-primary); }

	.empty-state {
		color: var(--color-text-light);
		font-style: italic;
	}

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
