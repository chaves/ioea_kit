<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import CropModal from '$lib/components/CropModal.svelte';

	interface Author {
		id: number;
		prenom: string;
		nom: string;
		instit: string;
		home: string;
		photo: string;
		email: string;
	}

	interface Props {
		data: { authors: Author[] };
		form?: { error?: string; success?: boolean; message?: string; action?: string };
	}

	let { data, form }: Props = $props();

	let showCreateForm = $state(false);
	let editingId = $state<number | null>(null);
	let editingData = $state<Author | null>(null);
	let uploading = $state<Record<number, boolean>>({});
	let uploadError = $state<Record<number, string>>({});

	// Crop modal state
	let cropSrc = $state<string | null>(null);
	let cropAuthor = $state<Author | null>(null);

	function startEdit(a: Author) {
		editingId = a.id;
		editingData = { ...a };
	}

	function cancelEdit() {
		editingId = null;
		editingData = null;
	}

	function handlePhotoSelect(author: Author, input: HTMLInputElement) {
		const file = input.files?.[0];
		if (!file) return;
		input.value = '';

		// Show crop modal instead of uploading directly
		const reader = new FileReader();
		reader.onload = (e) => {
			cropSrc = e.target?.result as string;
			cropAuthor = author;
		};
		reader.readAsDataURL(file);
	}

	async function uploadCroppedBlob(author: Author, blob: Blob) {
		cropSrc = null;
		cropAuthor = null;

		uploading = { ...uploading, [author.id]: true };
		uploadError = { ...uploadError, [author.id]: '' };

		try {
			const fd = new FormData();
			fd.append('file', blob, `${author.nom}.jpg`);
			fd.append('lastName', author.nom);
			fd.append('firstName', author.prenom);

			const res = await fetch('/auth/manager/authors/upload', { method: 'POST', body: fd });
			if (!res.ok) {
				uploadError = { ...uploadError, [author.id]: await res.text() || 'Upload failed' };
				return;
			}

			const { filename } = await res.json();

			const lienFd = new FormData();
			lienFd.append('id', String(author.id));
			lienFd.append('photo', filename);
			await fetch('?/updatePhoto', { method: 'POST', body: lienFd });

			await invalidateAll();
		} catch {
			uploadError = { ...uploadError, [author.id]: 'Upload failed' };
		} finally {
			uploading = { ...uploading, [author.id]: false };
		}
	}

	const sortedAuthors = $derived([...data.authors].sort((a, b) =>
		a.nom.localeCompare(b.nom) || a.prenom.localeCompare(b.prenom)
	));
</script>

<svelte:head>
	<title>Authors | IOEA Admin</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<h1>Authors</h1>
		<button type="button" class="btn btn-primary" onclick={() => (showCreateForm = !showCreateForm)}>
			{showCreateForm ? 'Cancel' : '+ New Author'}
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
			<span class="stat-value">{data.authors.length}</span>
			<span class="stat-label">Total Authors</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.authors.filter((a) => a.photo).length}</span>
			<span class="stat-label">With Photo</span>
		</div>
	</div>

	{#if showCreateForm}
		<div class="form-card">
			<h2>New Author</h2>
			<form method="POST" action="?/create" use:enhance={() => {
				return async ({ update }) => {
					await update();
					if (form?.success && form?.action === 'create') showCreateForm = false;
				};
			}}>
				<div class="form-row">
					<div class="form-group">
						<label for="c-prenom" class="form-label">First name</label>
						<input id="c-prenom" type="text" name="prenom" class="form-input" />
					</div>
					<div class="form-group">
						<label for="c-nom" class="form-label">Last name *</label>
						<input id="c-nom" type="text" name="nom" class="form-input" required />
					</div>
				</div>
				<div class="form-row">
					<div class="form-group">
						<label for="c-instit" class="form-label">Institution</label>
						<input id="c-instit" type="text" name="instit" class="form-input" />
					</div>
					<div class="form-group">
						<label for="c-email" class="form-label">Email</label>
						<input id="c-email" type="email" name="email" class="form-input" />
					</div>
				</div>
				<div class="form-group">
					<label for="c-home" class="form-label">Website</label>
					<input id="c-home" type="text" name="home" class="form-input" placeholder="https://..." />
				</div>
				<button type="submit" class="btn btn-primary">Create</button>
			</form>
		</div>
	{/if}

	<div class="table-container">
		<table class="data-table">
			<thead>
				<tr>
					<th>Photo</th>
					<th>Name</th>
					<th>Institution</th>
					<th>Email</th>
					<th>Website</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedAuthors as author}
					{#if editingId === author.id && editingData}
						<tr class="editing-row">
							<td colspan="6">
								<form method="POST" action="?/update" use:enhance={() => {
									return async ({ update }) => {
										await update();
										if (form?.success && form?.action === 'update') cancelEdit();
									};
								}}>
									<input type="hidden" name="id" value={author.id} />
									<input type="hidden" name="photo" value={editingData.photo} />
									<div class="edit-form">
										<div class="form-row">
											<div class="form-group">
												<label for={`e-prenom-${author.id}`} class="form-label">First name</label>
												<input id={`e-prenom-${author.id}`} type="text" name="prenom" class="form-input" value={editingData.prenom} />
											</div>
											<div class="form-group">
												<label for={`e-nom-${author.id}`} class="form-label">Last name *</label>
												<input id={`e-nom-${author.id}`} type="text" name="nom" class="form-input" value={editingData.nom} required />
											</div>
										</div>
										<div class="form-row">
											<div class="form-group">
												<label for={`e-instit-${author.id}`} class="form-label">Institution</label>
												<input id={`e-instit-${author.id}`} type="text" name="instit" class="form-input" value={editingData.instit} />
											</div>
											<div class="form-group">
												<label for={`e-email-${author.id}`} class="form-label">Email</label>
												<input id={`e-email-${author.id}`} type="email" name="email" class="form-input" value={editingData.email} />
											</div>
										</div>
										<div class="form-group">
											<label for={`e-home-${author.id}`} class="form-label">Website</label>
											<input id={`e-home-${author.id}`} type="text" name="home" class="form-input" value={editingData.home} />
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
							<td class="photo-cell">
								<div class="photo-wrapper">
									{#if author.photo}
										<img
											src={`/images/lec/${author.photo}`}
											alt={`${author.prenom} ${author.nom}`}
											class="author-photo"
											onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
										/>
									{:else}
										<div class="photo-placeholder">?</div>
									{/if}
								</div>
								{#if uploadError[author.id]}
									<span class="upload-error">{uploadError[author.id]}</span>
								{/if}
								<label class="btn btn-upload btn-sm" class:loading={uploading[author.id]}>
									{uploading[author.id] ? 'Uploading…' : author.photo ? 'Replace' : 'Upload'}
									<input
										type="file"
										accept=".jpg,.jpeg,.png,.webp"
										class="hidden-input"
										disabled={uploading[author.id]}
										onchange={(e) => handlePhotoSelect(author, e.currentTarget as HTMLInputElement)}
									/>
								</label>
							</td>
							<td>
								<span class="font-medium">{author.nom}</span>
								{#if author.prenom}<span class="text-muted">, {author.prenom}</span>{/if}
							</td>
							<td class="text-sm">{author.instit || '—'}</td>
							<td class="text-sm">{author.email || '—'}</td>
							<td>
								{#if author.home}
									<a href={author.home} target="_blank" rel="noopener noreferrer" class="link-sm">Link</a>
								{:else}
									<span class="text-muted">—</span>
								{/if}
							</td>
							<td>
								<div class="action-buttons">
									<button type="button" class="btn btn-secondary btn-sm" onclick={() => startEdit(author)}>Edit</button>
									<form method="POST" action="?/delete" use:enhance={() => {
										return async ({ update }) => {
											if (confirm(`Delete "${author.prenom} ${author.nom}"?`)) await update();
										};
									}} class="inline-form">
										<input type="hidden" name="id" value={author.id} />
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

{#if cropSrc && cropAuthor}
	{@const author = cropAuthor}
	<CropModal
		src={cropSrc}
		onConfirm={(blob) => uploadCroppedBlob(author, blob)}
		onCancel={() => { cropSrc = null; cropAuthor = null; }}
	/>
{/if}

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

	.photo-cell { min-width: 120px; }
	.photo-wrapper { margin-bottom: 0.4rem; }
	.author-photo {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--color-border);
		display: block;
	}
	.photo-placeholder {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--color-bg-alt);
		border: 2px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		color: var(--color-text-light);
	}

	.font-medium { font-weight: 500; }
	.text-muted { color: var(--color-text-light); font-size: 0.9rem; }
	.text-sm { font-size: 0.9rem; }
	.link-sm { font-size: 0.85rem; color: var(--color-primary); }

	.btn-upload {
		display: inline-block;
		background: var(--color-bg-alt);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 0.75rem;
		padding: 0.2rem 0.5rem;
	}
	.btn-upload:hover { background: var(--color-border); }
	.btn-upload.loading { opacity: 0.6; cursor: not-allowed; }
	.hidden-input { display: none; }
	.upload-error { display: block; font-size: 0.7rem; color: #991b1b; margin-bottom: 0.2rem; }

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
