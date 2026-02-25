<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	let loading = $state(false);

	// Photo crop state — declared before canValidate so croppedPreviewUrl is in scope
	let cropperLoaded = $state(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let cropperInstance: any = null;
	let cropImgEl: HTMLImageElement | null = $state(null);
	let showCropModal = $state(false);
	let selectedImageUrl = $state('');
	let croppedBlob: Blob | null = null;
	let croppedPreviewUrl = $state('');

	const canValidate = $derived(!!(data.profile.photo || croppedPreviewUrl));
	let photoFileInput: HTMLInputElement | null = null;

	const photoUrl = $derived(
		croppedPreviewUrl
			? croppedPreviewUrl
			: data.profile.photo
				? `/student-photos/${data.profile.photo}?t=${Date.now()}`
				: null
	);

	const initials = $derived(
		`${data.profile.firstName[0] ?? ''}${data.profile.lastName[0] ?? ''}`.toUpperCase()
	);

	onMount(() => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css';
		document.head.appendChild(link);

		const script = document.createElement('script');
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js';
		script.onload = () => { cropperLoaded = true; };
		document.head.appendChild(script);

		return () => { cropperInstance?.destroy(); };
	});

	$effect(() => {
		if (showCropModal && cropImgEl && cropperLoaded && selectedImageUrl) {
			setTimeout(() => {
				cropperInstance?.destroy();
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				cropperInstance = new (window as any).Cropper(cropImgEl, {
					aspectRatio: 1,
					viewMode: 1,
					autoCropArea: 0.85,
					dragMode: 'move',
				});
			}, 50);
		}
	});

	function onPhotoSelected(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl);
		selectedImageUrl = URL.createObjectURL(file);
		showCropModal = true;
	}

	function applyCrop() {
		if (!cropperInstance) return;
		cropperInstance.getCroppedCanvas({ width: 600, height: 600 }).toBlob(
			(blob: Blob | null) => {
				if (!blob) return;
				croppedBlob = blob;
				if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
				croppedPreviewUrl = URL.createObjectURL(blob);
				closeCropModal();
			},
			'image/jpeg',
			0.9
		);
	}

	function closeCropModal() {
		showCropModal = false;
		cropperInstance?.destroy();
		cropperInstance = null;
		if (photoFileInput) photoFileInput.value = '';
	}
</script>

<svelte:head>
	<title>Profile | Student Area | IOEA {data.year}</title>
</svelte:head>

<div class="admin-page">
	<header class="page-top">
		<div class="page-top-left">
			<a href="/auth/student" class="back-link">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
				Overview
			</a>
			<h1>Profile</h1>
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

	{#if form?.error}
		<div class="alert alert-error">{form.error}</div>
	{/if}

	<div class="form-card">
		<form
			method="POST"
			enctype="multipart/form-data"
			use:enhance={({ formData }) => {
				if (croppedBlob) formData.append('photo', croppedBlob, 'photo.jpg');
				loading = true;
				return async ({ update }) => { await update(); loading = false; };
			}}
		>
			<div class="profile-layout">
				<div class="avatar-col">
					<div class="avatar-wrap">
						{#if photoUrl}
							<img src={photoUrl} alt="Profile" class="avatar-img" />
						{:else}
							<div class="avatar-placeholder">{initials}</div>
						{/if}
					</div>
					<button type="button" class="btn btn-secondary btn-sm" onclick={() => photoFileInput?.click()}>
						{data.profile.photo || croppedPreviewUrl ? 'Change photo' : 'Add photo'}
					</button>
					<input
						bind:this={photoFileInput}
						type="file"
						accept="image/jpeg,image/png,image/webp"
						class="sr-only"
						onchange={onPhotoSelected}
					/>
					<p class="hint">JPEG / PNG / WebP · max 600 px</p>
					{#if !canValidate}
						<p class="hint required">Photo required</p>
					{/if}
				</div>

				<div class="fields-col">
					<div class="form-row">
						<div class="form-group">
							<label for="firstName" class="form-label">First name</label>
							<input type="text" id="firstName" name="firstName" class="form-input" value={data.profile.firstName} required />
						</div>
						<div class="form-group">
							<label for="lastName" class="form-label">Last name</label>
							<input type="text" id="lastName" name="lastName" class="form-input" value={data.profile.lastName} required />
						</div>
					</div>
					<div class="form-group">
						<label for="profileEmail" class="form-label">Email</label>
						<input type="text" id="profileEmail" class="form-input readonly" value={data.profile.email} readonly />
					</div>
					<div class="form-group">
						<label for="university" class="form-label">University / Institution</label>
						<input type="text" id="university" name="university" class="form-input" value={data.profile.university} />
					</div>
				</div>
			</div>

			<div class="form-footer">
				<button type="submit" class="btn btn-validate" disabled={!canValidate || loading}>
					{loading ? 'Saving…' : 'Validate profile'}
				</button>
				{#if !canValidate}
					<span class="footer-hint">Upload a photo first</span>
				{/if}
			</div>
		</form>
	</div>
</div>

{#if showCropModal}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="modal-backdrop" onclick={closeCropModal}></div>
	<div class="modal" role="dialog" aria-modal="true" aria-label="Crop photo">
		<div class="modal-header">
			<h3>Crop your photo</h3>
			<button type="button" class="modal-close" onclick={closeCropModal} aria-label="Close">✕</button>
		</div>
		<div class="crop-container">
			<img bind:this={cropImgEl} src={selectedImageUrl} alt="to crop" class="crop-source" />
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary" onclick={closeCropModal}>Cancel</button>
			<button type="button" class="btn btn-primary" onclick={applyCrop}>Apply crop</button>
		</div>
	</div>
{/if}

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

	.form-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 2rem;
	}

	.profile-layout {
		display: flex;
		gap: 2.5rem;
		align-items: flex-start;
		margin-bottom: 1.75rem;
	}

	.avatar-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
		width: 140px;
	}

	.avatar-wrap {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid var(--color-border);
	}

	.avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-placeholder {
		width: 100%;
		height: 100%;
		background: var(--color-primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: 700;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0,0,0,0);
	}

	.hint {
		font-size: 0.75rem;
		color: var(--color-text-muted, #9ca3af);
		text-align: center;
		margin: 0;
	}

	.hint.required { color: #dc2626; font-weight: 600; }

	.fields-col { flex: 1; }

	.form-group { margin-bottom: 1.25rem; }

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.readonly {
		background: var(--color-bg-alt, #f9fafb);
		color: var(--color-text-muted, #6b7280);
		cursor: not-allowed;
	}

	.btn-sm { padding: 0.35rem 0.8rem; font-size: 0.8rem; }

	.form-footer {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--color-border);
	}

	.footer-hint {
		font-size: 0.8rem;
		color: #dc2626;
	}

	.btn-validate {
		background: var(--color-primary);
		color: white;
		border: none;
		cursor: pointer;
		padding: 0.6rem 1.5rem;
		border-radius: 0.375rem;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.btn-validate:hover:not(:disabled) { background: var(--color-primary-dark, #4a3860); }
	.btn-validate:disabled { opacity: 0.45; cursor: not-allowed; }

	/* Crop modal */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.6);
		z-index: 100;
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 101;
		background: white;
		border-radius: 0.75rem;
		width: min(700px, 95vw);
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 60px rgba(0,0,0,0.3);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.modal-header h3 { margin: 0; font-size: 1.1rem; }

	.modal-close {
		background: none;
		border: none;
		font-size: 1.1rem;
		cursor: pointer;
		color: var(--color-text-muted, #6b7280);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.modal-close:hover { background: var(--color-bg-alt, #f3f4f6); }

	.crop-container {
		flex: 1;
		overflow: hidden;
		max-height: 500px;
		background: #111;
	}

	.crop-source {
		display: block;
		max-width: 100%;
		max-height: 500px;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	@media (max-width: 640px) {
		.admin-page { padding: 1.25rem; }
		.profile-layout { flex-direction: column; align-items: stretch; }
		.avatar-col { width: 100%; flex-direction: row; gap: 1rem; align-items: center; }
		.form-row { grid-template-columns: 1fr; }
		.form-footer { flex-direction: column; align-items: flex-start; }
	}
</style>
