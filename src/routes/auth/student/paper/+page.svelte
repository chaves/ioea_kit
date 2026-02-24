<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let loading = $state(false);
	let loadingValidate = $state(false);

	const canValidate = $derived(!!(data.paper.title && data.paper.hasFile));
</script>

<svelte:head>
	<title>Paper | Student Area | IOEA {data.year}</title>
</svelte:head>

<div class="admin-page">
	<header class="page-top">
		<div class="page-top-left">
			<a href="/auth/student" class="back-link">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
				Overview
			</a>
			<h1>Paper / Project</h1>
		</div>
		{#if data.validated}
			<span class="badge-validated">
				<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
				Validated
			</span>
		{:else}
			<span class="badge-pending">Pending validation</span>
		{/if}
	</header>

	{#if form?.success && form.action !== 'validate'}
		<div class="alert alert-success">{form.message}</div>
	{:else if form?.error && form.action !== 'validate'}
		<div class="alert alert-error">{form.error}</div>
	{/if}

	{#if data.validated}
		<div class="info-bar">
			Your paper is validated. Saving changes will reset the validation and require you to re-validate.
		</div>
	{/if}

	<div class="form-card">
		<form
			method="POST"
			enctype="multipart/form-data"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => { await update(); loading = false; };
			}}
		>
			<div class="form-group">
				<label for="title" class="form-label">Paper title</label>
				<input type="text" id="title" name="title" class="form-input" value={data.paper.title} />
			</div>

			<div class="form-group">
				<label for="summary" class="form-label">Abstract</label>
				<textarea id="summary" name="summary" class="form-input" rows="7">{data.paper.summary}</textarea>
			</div>

			<div class="form-group">
				<p class="form-label">Paper or project file</p>

				{#if data.paper.hasFile}
					<div class="file-current">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
							<polyline points="14 2 14 8 20 8"></polyline>
						</svg>
						<a href="/auth/student/paper/file" target="_blank" class="file-link">Download your current file</a>
					</div>
					<p class="upload-sub">Upload a new version to replace it</p>
				{:else}
					<p class="upload-sub">No file uploaded yet</p>
				{/if}

				<input type="file" id="paperFile" name="paperFile" class="form-input file-input" accept=".pdf" />
				<p class="hint">PDF only · max 5 MB</p>
			</div>

			<button type="submit" class="btn btn-primary" disabled={loading}>
				{loading ? 'Saving…' : 'Save'}
			</button>
		</form>
	</div>

	<!-- Validate -->
	{#if !data.validated || form?.action === 'validate'}
		<div class="validate-box">
			{#if form?.action === 'validate' && form.success}
				<div class="alert alert-success">{form.message}</div>
			{:else if form?.action === 'validate' && form.error}
				<div class="alert alert-error">{form.error}</div>
			{/if}
			<div class="validate-row">
				<div>
					<strong>Validate your paper</strong>
					<p>Confirm that the title, abstract and file are final.</p>
					{#if !data.paper.hasFile}
						<p class="missing">You must upload a file before validating.</p>
					{/if}
				</div>
				<form method="POST" action="?/validate" use:enhance={() => {
					loadingValidate = true;
					return async ({ update }) => { await update(); loadingValidate = false; };
				}}>
					<button
						type="submit"
						class="btn btn-validate"
						disabled={!canValidate || loadingValidate}
						title={!canValidate ? 'Add a title and upload a file first' : ''}
					>
						{loadingValidate ? '…' : 'Validate paper'}
					</button>
				</form>
			</div>
		</div>
	{:else}
		<div class="validated-box">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
			Paper validated. Edit above to make changes — you will need to re-validate.
		</div>
	{/if}
</div>

<style>
	.admin-page {
		padding: 2rem 2.5rem;
		max-width: 800px;
	}

	.page-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
		gap: 1rem;
	}

	.page-top-left {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.8rem;
		color: var(--color-text-muted, #6b7280);
		text-decoration: none;
	}

	.back-link:hover { color: var(--color-primary); }

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
	}

	.badge-validated {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.3rem 0.8rem;
		background: #dcfce7;
		color: #166534;
		border-radius: 9999px;
		font-size: 0.8rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.badge-pending {
		display: inline-flex;
		align-items: center;
		padding: 0.3rem 0.8rem;
		background: #f3f4f6;
		color: #6b7280;
		border-radius: 9999px;
		font-size: 0.8rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.info-bar {
		padding: 0.75rem 1rem;
		background: #fefce8;
		border: 1px solid #fde047;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		color: #854d0e;
		margin-bottom: 1.25rem;
	}

	.form-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 2rem;
	}

	.form-group { margin-bottom: 1.5rem; }

	textarea.form-input {
		resize: vertical;
		min-height: 140px;
	}

	.file-current {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1rem;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 0.375rem;
		margin-bottom: 0.75rem;
		color: #166534;
	}

	.file-link {
		font-weight: 600;
		color: #166534;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.file-link:hover { color: #14532d; }

	.upload-sub {
		font-size: 0.85rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0 0 0.5rem;
	}

	.file-input { margin-top: 0.25rem; }

	.hint {
		font-size: 0.75rem;
		color: var(--color-text-muted, #9ca3af);
		margin: 0.35rem 0 0;
	}

	/* Validate section */
	.validate-box {
		margin-top: 1.5rem;
		padding: 1.5rem;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
	}

	.validate-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
	}

	.validate-row strong { font-size: 1rem; }
	.validate-row p { margin: 0.2rem 0 0; font-size: 0.85rem; color: var(--color-text-muted, #6b7280); }
	.validate-row p.missing { color: #dc2626; font-weight: 600; }

	.btn-validate {
		background: var(--color-primary);
		color: white;
		border: none;
		cursor: pointer;
		white-space: nowrap;
	}

	.btn-validate:hover:not(:disabled) { background: var(--color-primary-dark, #4a3860); }
	.btn-validate:disabled { opacity: 0.45; cursor: not-allowed; }

	.validated-box {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1.5rem;
		padding: 1rem 1.5rem;
		background: #f0fdf4;
		border: 1px solid #86efac;
		border-radius: 0.5rem;
		color: #166534;
		font-size: 0.9rem;
	}

	@media (max-width: 640px) {
		.admin-page { padding: 1.25rem; }
		.validate-row { flex-direction: column; align-items: flex-start; }
	}
</style>
