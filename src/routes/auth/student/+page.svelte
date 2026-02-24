<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	interface Profile {
		firstName: string;
		lastName: string;
		email: string;
		university: string;
		photo: string | null;
	}

	interface Paper {
		title: string;
		summary: string;
		hasFile: boolean;
	}

	interface Travel {
		arrivalDate: string;
		arrivalTransport: string;
		arrivalLocation: string;
		arrivalFlight: string;
		arrivalTransfer: number;
		departureDate: string;
		departureTransport: string;
		departureLocation: string;
		departureFlight: string;
		departureTransfer: number;
	}

	interface Props {
		data: {
			year: number;
			hasSubmission: boolean;
			profile: Profile;
			paper: Paper | null;
			travel: Travel | null;
			transportOptions: string[];
			locationOptions: Record<number, string>;
			arrivalTransferOptions: Record<number, string>;
			departureTransferOptions: Record<number, string>;
		};
		form?: { success?: boolean; message?: string; error?: string; action?: string };
	}

	let { data, form }: Props = $props();

	// Form loading states
	let loadingProfile = $state(false);
	let loadingPaper = $state(false);
	let loadingTravel = $state(false);

	// Photo crop state
	let cropperLoaded = $state(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let cropperInstance: any = null;
	let cropImgEl: HTMLImageElement | null = $state(null);
	let showCropModal = $state(false);
	let selectedImageUrl = $state('');
	let croppedBlob: Blob | null = null;
	let croppedPreviewUrl = $state('');
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
		script.onload = () => {
			cropperLoaded = true;
		};
		document.head.appendChild(script);

		return () => {
			cropperInstance?.destroy();
		};
	});

	$effect(() => {
		if (showCropModal && cropImgEl && cropperLoaded && selectedImageUrl) {
			// Tiny delay to ensure the img src has rendered
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
	<title>Student Area | IOEA {data.year}</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<div>
			<h1>Student Area — IOEA {data.year}</h1>
			<p class="subtitle">Please complete all sections before the deadline.</p>
		</div>
	</header>

	{#if !data.hasSubmission}
		<div class="notice-card">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="8" x2="12" y2="12"></line>
				<line x1="12" y1="16" x2="12.01" y2="16"></line>
			</svg>
			<div>
				<strong>No accepted submission found for {data.year}</strong>
				<p>If you believe this is an error, please contact the coordinator.</p>
			</div>
		</div>
	{/if}

	<!-- ── PROFILE ────────────────────────────────────────── -->
	<section class="section-card">
		<h2 class="section-title">Profile</h2>

		{#if form?.action === 'updateProfile'}
			<div class="alert {form.success ? 'alert-success' : 'alert-error'}">
				{form.success ? form.message : form.error}
			</div>
		{/if}

		<form
			method="POST"
			action="?/updateProfile"
			enctype="multipart/form-data"
			use:enhance={({ formData }) => {
				if (croppedBlob) {
					formData.append('photo', croppedBlob, 'photo.jpg');
				}
				loadingProfile = true;
				return async ({ update }) => {
					await update();
					loadingProfile = false;
				};
			}}
		>
			<div class="profile-layout">
				<!-- Avatar column -->
				<div class="avatar-col">
					<div class="avatar-wrap">
						{#if photoUrl}
							<img src={photoUrl} alt="Profile" class="avatar-img" />
						{:else}
							<div class="avatar-placeholder">{initials}</div>
						{/if}
					</div>
					<button
						type="button"
						class="btn btn-secondary btn-sm"
						onclick={() => photoFileInput?.click()}
					>
						{data.profile.photo || croppedPreviewUrl ? 'Change photo' : 'Add photo'}
					</button>
					<input
						bind:this={photoFileInput}
						type="file"
						accept="image/jpeg,image/png,image/webp"
						class="hidden-input"
						onchange={onPhotoSelected}
					/>
					<p class="photo-hint">JPEG / PNG / WebP · resized to 600 px</p>
				</div>

				<!-- Fields column -->
				<div class="fields-col">
					<div class="form-row">
						<div class="form-group">
							<label for="firstName" class="form-label">First name</label>
							<input
								type="text"
								id="firstName"
								name="firstName"
								class="form-input"
								value={data.profile.firstName}
								required
							/>
						</div>
						<div class="form-group">
							<label for="lastName" class="form-label">Last name</label>
							<input
								type="text"
								id="lastName"
								name="lastName"
								class="form-input"
								value={data.profile.lastName}
								required
							/>
						</div>
					</div>

					<div class="form-group">
						<label for="profileEmail" class="form-label">Email</label>
						<input type="text" id="profileEmail" class="form-input input-readonly" value={data.profile.email} readonly />
					</div>

					<div class="form-group">
						<label for="university" class="form-label">University / Institution</label>
						<input
							type="text"
							id="university"
							name="university"
							class="form-input"
							value={data.profile.university}
						/>
					</div>
				</div>
			</div>

			<button type="submit" class="btn btn-primary" disabled={loadingProfile}>
				{loadingProfile ? 'Saving…' : 'Save profile'}
			</button>
		</form>
	</section>

	<!-- ── PAPER ─────────────────────────────────────────── -->
	{#if data.paper !== null}
		<section class="section-card">
			<h2 class="section-title">Paper</h2>
			<p class="section-desc">Title and abstract will appear in the program booklet.</p>

			{#if form?.action === 'updatePaper'}
				<div class="alert {form.success ? 'alert-success' : 'alert-error'}">
					{form.success ? form.message : form.error}
				</div>
			{/if}

			<form
				method="POST"
				action="?/updatePaper"
				enctype="multipart/form-data"
				use:enhance={() => {
					loadingPaper = true;
					return async ({ update }) => {
						await update();
						loadingPaper = false;
					};
				}}
			>
				<div class="form-group">
					<label for="title" class="form-label">Paper title</label>
					<input type="text" id="title" name="title" class="form-input" value={data.paper.title} />
				</div>
				<div class="form-group">
					<label for="summary" class="form-label">Abstract</label>
					<textarea id="summary" name="summary" class="form-input" rows="6"
						>{data.paper.summary}</textarea
					>
				</div>
				<div class="form-group">
					<label class="form-label">Paper PDF</label>
					{#if data.paper.hasFile}
						<div class="paper-current">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
								<polyline points="14 2 14 8 20 8"></polyline>
							</svg>
							<a href="/auth/student/paper" target="_blank" class="paper-download-link">
								Download your current paper
							</a>
						</div>
					{/if}
					<label for="paperFile" class="upload-label">
						{data.paper.hasFile ? 'Upload a new version' : 'Upload your paper'}
					</label>
					<input type="file" id="paperFile" name="paperFile" class="form-input" accept=".pdf" />
					<p class="photo-hint">PDF only · max 5 MB{data.paper.hasFile ? ' · replaces the current file' : ''}</p>
				</div>
				<button type="submit" class="btn btn-primary" disabled={loadingPaper}>
					{loadingPaper ? 'Saving…' : 'Save paper'}
				</button>
			</form>
		</section>
	{/if}

	<!-- ── TRAVEL ─────────────────────────────────────────── -->
	<section class="section-card">
		<h2 class="section-title">Travel Information</h2>
		<p class="section-desc">Arrival and departure details for transfer organisation.</p>

		{#if form?.action === 'updateTravel'}
			<div class="alert {form.success ? 'alert-success' : 'alert-error'}">
				{form.success ? form.message : form.error}
			</div>
		{/if}

		<form
			method="POST"
			action="?/updateTravel"
			use:enhance={() => {
				loadingTravel = true;
				return async ({ update }) => {
					await update();
					loadingTravel = false;
				};
			}}
		>
			<div class="travel-grid">
				<fieldset class="travel-section">
					<legend>Arrival</legend>
					<div class="form-group">
						<label for="arrivalDate" class="form-label">Arrival date</label>
						<input type="date" id="arrivalDate" name="arrivalDate" class="form-input" value={data.travel?.arrivalDate ?? ''} />
					</div>
					<div class="form-row">
						<div class="form-group">
							<label for="arrivalTransport" class="form-label">Transport</label>
							<select id="arrivalTransport" name="arrivalTransport" class="form-input">
								{#each data.transportOptions as opt}
									<option value={opt} selected={data.travel?.arrivalTransport === opt}>{opt || '—'}</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="arrivalLocation" class="form-label">Port / Airport</label>
							<select id="arrivalLocation" name="arrivalLocation" class="form-input">
								<option value="">—</option>
								{#each Object.entries(data.locationOptions) as [k, v]}
									<option value={k} selected={data.travel?.arrivalLocation === k}>{v}</option>
								{/each}
							</select>
						</div>
					</div>
					<div class="form-group">
						<label for="arrivalFlight" class="form-label">Flight / Boat number</label>
						<input type="text" id="arrivalFlight" name="arrivalFlight" class="form-input" placeholder="e.g. AF1234" value={data.travel?.arrivalFlight ?? ''} />
					</div>
					<div class="form-group">
						<label for="arrivalTransfer" class="form-label">Transfer to Cargèse</label>
						<select id="arrivalTransfer" name="arrivalTransfer" class="form-input">
							<option value="">—</option>
							{#each Object.entries(data.arrivalTransferOptions) as [k, v]}
								<option value={k} selected={data.travel?.arrivalTransfer === parseInt(k)}>{v}</option>
							{/each}
						</select>
					</div>
				</fieldset>

				<fieldset class="travel-section">
					<legend>Departure</legend>
					<div class="form-group">
						<label for="departureDate" class="form-label">Departure date</label>
						<input type="date" id="departureDate" name="departureDate" class="form-input" value={data.travel?.departureDate ?? ''} />
					</div>
					<div class="form-row">
						<div class="form-group">
							<label for="departureTransport" class="form-label">Transport</label>
							<select id="departureTransport" name="departureTransport" class="form-input">
								{#each data.transportOptions as opt}
									<option value={opt} selected={data.travel?.departureTransport === opt}>{opt || '—'}</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="departureLocation" class="form-label">Port / Airport</label>
							<select id="departureLocation" name="departureLocation" class="form-input">
								<option value="">—</option>
								{#each Object.entries(data.locationOptions) as [k, v]}
									<option value={k} selected={data.travel?.departureLocation === k}>{v}</option>
								{/each}
							</select>
						</div>
					</div>
					<div class="form-group">
						<label for="departureFlight" class="form-label">Flight / Boat number</label>
						<input type="text" id="departureFlight" name="departureFlight" class="form-input" placeholder="e.g. AF1234" value={data.travel?.departureFlight ?? ''} />
					</div>
					<div class="form-group">
						<label for="departureTransfer" class="form-label">Transfer from Cargèse</label>
						<select id="departureTransfer" name="departureTransfer" class="form-input">
							<option value="">—</option>
							{#each Object.entries(data.departureTransferOptions) as [k, v]}
								<option value={k} selected={data.travel?.departureTransfer === parseInt(k)}>{v}</option>
							{/each}
						</select>
					</div>
				</fieldset>
			</div>

			<button type="submit" class="btn btn-primary" disabled={loadingTravel}>
				{loadingTravel ? 'Saving…' : 'Save travel info'}
			</button>
		</form>
	</section>
</div>

<!-- ── CROP MODAL ──────────────────────────────────────── -->
{#if showCropModal}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="modal-backdrop" onclick={closeCropModal}></div>
	<div class="modal" role="dialog" aria-modal="true" aria-label="Crop photo">
		<div class="modal-header">
			<h3>Crop your photo</h3>
			<button type="button" class="modal-close" onclick={closeCropModal} aria-label="Close">✕</button>
		</div>
		<div class="crop-container">
			<img
				bind:this={cropImgEl}
				src={selectedImageUrl}
				alt="Photo to crop"
				class="crop-source"
			/>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary" onclick={closeCropModal}>Cancel</button>
			<button type="button" class="btn btn-primary" onclick={applyCrop}>
				Apply crop
			</button>
		</div>
	</div>
{/if}

<style>
	.subtitle {
		font-size: 0.9rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0.25rem 0 0;
	}

	.notice-card {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		background: #fefce8;
		border: 1px solid #fde047;
		border-radius: 0.5rem;
		color: #854d0e;
		margin-bottom: 1.5rem;
	}

	.notice-card p { margin: 0.25rem 0 0; font-size: 0.9rem; }

	.section-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 2rem;
		margin-bottom: 1.5rem;
	}

	.section-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--color-primary);
		margin: 0 0 0.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid var(--color-border);
	}

	.section-desc {
		font-size: 0.875rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0 0 1.5rem;
	}

	/* Profile layout */
	.profile-layout {
		display: flex;
		gap: 2.5rem;
		align-items: flex-start;
		margin-bottom: 1.5rem;
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

	.hidden-input {
		display: none;
	}

	.photo-hint {
		font-size: 0.75rem;
		color: var(--color-text-muted, #9ca3af);
		text-align: center;
		margin: 0;
	}

	.fields-col {
		flex: 1;
	}

	.input-readonly {
		background: var(--color-bg-alt, #f9fafb);
		color: var(--color-text-muted, #6b7280);
		cursor: not-allowed;
	}

	/* Paper */
	.paper-current {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1rem;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
		color: #166534;
	}

	.paper-download-link {
		font-weight: 600;
		color: #166534;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.paper-download-link:hover {
		color: #14532d;
	}

	.upload-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text, #374151);
		margin-bottom: 0.4rem;
	}

	.file-badge {
		display: inline-block;
		margin-left: 0.5rem;
		padding: 0.1rem 0.5rem;
		background: #dcfce7;
		color: #166534;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	textarea.form-input {
		resize: vertical;
		min-height: 120px;
	}

	/* Forms */
	.form-group { margin-bottom: 1.25rem; }

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	/* Travel */
	.travel-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-bottom: 1.5rem;
	}

	fieldset.travel-section {
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1.25rem;
	}

	fieldset.travel-section legend {
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--color-primary);
		padding: 0 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

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

	@media (max-width: 768px) {
		.profile-layout { flex-direction: column; align-items: stretch; }
		.avatar-col { width: 100%; flex-direction: row; gap: 1rem; align-items: center; }
		.travel-grid, .form-row { grid-template-columns: 1fr; }
	}

	.btn-sm {
		padding: 0.35rem 0.8rem;
		font-size: 0.8rem;
	}
</style>
