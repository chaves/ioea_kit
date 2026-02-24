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
			validatedSections: string[];
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
	let loadingValidate = $state('');

	// Optimistic validation state — synced from server on each load
	let validatedSections = $state<string[]>([...data.validatedSections]);

	$effect(() => {
		validatedSections = [...data.validatedSections];
	});

	// Update optimistically on form results
	$effect(() => {
		if (form?.success) {
			if (form.action === 'validateProfile') validatedSections = [...validatedSections, 'profile'].filter((v, i, a) => a.indexOf(v) === i);
			if (form.action === 'validatePaper') validatedSections = [...validatedSections, 'paper'].filter((v, i, a) => a.indexOf(v) === i);
			if (form.action === 'validateTravel') validatedSections = [...validatedSections, 'travel'].filter((v, i, a) => a.indexOf(v) === i);
			if (form.action === 'updateProfile') validatedSections = validatedSections.filter(s => s !== 'profile');
			if (form.action === 'updatePaper') validatedSections = validatedSections.filter(s => s !== 'paper');
			if (form.action === 'updateTravel') validatedSections = validatedSections.filter(s => s !== 'travel');
		}
	});

	// Photo crop state — declared early so canValidateProfile can reference croppedPreviewUrl
	let cropperLoaded = $state(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let cropperInstance: any = null;
	let cropImgEl: HTMLImageElement | null = $state(null);
	let showCropModal = $state(false);
	let selectedImageUrl = $state('');
	let croppedBlob: Blob | null = null;
	let croppedPreviewUrl = $state('');

	const profileValidated = $derived(validatedSections.includes('profile'));
	const paperValidated = $derived(validatedSections.includes('paper'));
	const travelValidated = $derived(validatedSections.includes('travel'));

	// Profile is only validatable if a photo exists or was just cropped
	const canValidateProfile = $derived(
		!!(data.profile.photo || croppedPreviewUrl)
	);

	// Paper is validatable if title is set and a file exists
	const canValidatePaper = $derived(
		!!(data.paper && data.paper.title && data.paper.hasFile)
	);

	// Travel is validatable if at least an arrival date is set
	const canValidateTravel = $derived(
		!!(data.travel && data.travel.arrivalDate)
	);

	const allValidated = $derived(
		profileValidated && (data.paper === null || paperValidated) && travelValidated
	);
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
			<p class="subtitle">Complete all sections and validate each one before the deadline.</p>
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

	<!-- ── DASHBOARD ───────────────────────────────────────── -->
	<div class="dashboard">
		{#if allValidated}
			<div class="dashboard-complete">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
					<polyline points="22 4 12 14.01 9 11.01"></polyline>
				</svg>
				All sections validated — thank you!
			</div>
		{/if}

		<!-- Profile card -->
		<div class="dash-card {profileValidated ? 'validated' : ''}">
			<div class="dash-card-icon">
				{#if photoUrl}
					<img src={photoUrl} alt="" class="dash-avatar" />
				{:else}
					<div class="dash-avatar-placeholder">{initials}</div>
				{/if}
			</div>
			<div class="dash-card-body">
				<div class="dash-card-title">
					Profile
					{#if profileValidated}
						<span class="badge-validated">
							<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
							Validated
						</span>
					{:else}
						<span class="badge-pending">Pending</span>
					{/if}
				</div>
				<p class="dash-card-desc">
					{data.profile.firstName} {data.profile.lastName}
					{#if data.profile.university} · {data.profile.university}{/if}
					{#if !data.profile.photo && !croppedPreviewUrl}
						<span class="hint-missing"> · Photo required</span>
					{/if}
				</p>
			</div>
			<div class="dash-card-actions">
				<a href="#profile" class="btn btn-secondary btn-sm">Edit</a>
				{#if !profileValidated}
					<form method="POST" action="?/validateProfile" use:enhance={() => {
						loadingValidate = 'profile';
						return async ({ update }) => { await update(); loadingValidate = ''; };
					}}>
						<button
							type="submit"
							class="btn btn-validate btn-sm"
							disabled={!canValidateProfile || loadingValidate === 'profile'}
							title={!canValidateProfile ? 'Upload a photo first' : ''}
						>
							{loadingValidate === 'profile' ? '…' : 'Validate'}
						</button>
					</form>
				{/if}
			</div>
		</div>

		<!-- Paper card -->
		{#if data.paper !== null}
			<div class="dash-card {paperValidated ? 'validated' : ''}">
				<div class="dash-card-icon">
					<div class="dash-icon-wrap {paperValidated ? 'icon-green' : 'icon-gray'}">
						<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
							<polyline points="14 2 14 8 20 8"></polyline>
						</svg>
					</div>
				</div>
				<div class="dash-card-body">
					<div class="dash-card-title">
						Paper / Project
						{#if paperValidated}
							<span class="badge-validated">
								<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
								Validated
							</span>
						{:else}
							<span class="badge-pending">Pending</span>
						{/if}
					</div>
					<p class="dash-card-desc">
						{#if data.paper.title}
							{data.paper.title}
						{:else}
							<span class="hint-missing">No title yet</span>
						{/if}
						{#if !data.paper.hasFile}
							<span class="hint-missing"> · No file uploaded</span>
						{/if}
					</p>
				</div>
				<div class="dash-card-actions">
					<a href="#paper" class="btn btn-secondary btn-sm">Edit</a>
					{#if !paperValidated}
						<form method="POST" action="?/validatePaper" use:enhance={() => {
							loadingValidate = 'paper';
							return async ({ update }) => { await update(); loadingValidate = ''; };
						}}>
							<button
								type="submit"
								class="btn btn-validate btn-sm"
								disabled={!canValidatePaper || loadingValidate === 'paper'}
								title={!canValidatePaper ? 'Add a title and upload a file first' : ''}
							>
								{loadingValidate === 'paper' ? '…' : 'Validate'}
							</button>
						</form>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Travel card -->
		<div class="dash-card {travelValidated ? 'validated' : ''}">
			<div class="dash-card-icon">
				<div class="dash-icon-wrap {travelValidated ? 'icon-green' : 'icon-gray'}">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16v.92"></path>
					</svg>
				</div>
			</div>
			<div class="dash-card-body">
				<div class="dash-card-title">
					Travel
					{#if travelValidated}
						<span class="badge-validated">
							<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
							Validated
						</span>
					{:else}
						<span class="badge-pending">Pending</span>
					{/if}
				</div>
				<p class="dash-card-desc">
					{#if data.travel?.arrivalDate}
						Arrival {data.travel.arrivalDate}
						{#if data.travel.departureDate} · Departure {data.travel.departureDate}{/if}
					{:else}
						<span class="hint-missing">No travel info yet</span>
					{/if}
				</p>
			</div>
			<div class="dash-card-actions">
				<a href="#travel" class="btn btn-secondary btn-sm">Edit</a>
				{#if !travelValidated}
					<form method="POST" action="?/validateTravel" use:enhance={() => {
						loadingValidate = 'travel';
						return async ({ update }) => { await update(); loadingValidate = ''; };
					}}>
						<button
							type="submit"
							class="btn btn-validate btn-sm"
							disabled={!canValidateTravel || loadingValidate === 'travel'}
							title={!canValidateTravel ? 'Fill in your arrival date first' : ''}
						>
							{loadingValidate === 'travel' ? '…' : 'Validate'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>

	<!-- ── PROFILE ────────────────────────────────────────── -->
	<section id="profile" class="section-card">
		<h2 class="section-title">Profile</h2>
		<p class="section-desc">Your photo is required to validate this section.</p>

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
					{#if !data.profile.photo && !croppedPreviewUrl}
						<p class="photo-required">Photo required to validate</p>
					{/if}
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
		<section id="paper" class="section-card">
			<h2 class="section-title">Paper / Project</h2>
			<p class="section-desc">Title and abstract will appear in the program booklet. Upload your PDF to validate.</p>

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
					<label class="form-label">Paper or project file</label>
					{#if data.paper.hasFile}
						<div class="paper-current">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
								<polyline points="14 2 14 8 20 8"></polyline>
							</svg>
							<a href="/auth/student/paper" target="_blank" class="paper-download-link">
								Download your current file
							</a>
						</div>
					{/if}
					<label for="paperFile" class="upload-label">
						{data.paper.hasFile ? 'Upload a new version' : 'Upload your file'}
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
	<section id="travel" class="section-card">
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

	/* ── Dashboard ── */
	.dashboard {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.dashboard-complete {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1.25rem;
		background: #f0fdf4;
		border: 1px solid #86efac;
		border-radius: 0.5rem;
		color: #166534;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.dash-card {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.1rem 1.5rem;
		background: white;
		border: 2px solid var(--color-border);
		border-radius: 0.5rem;
		transition: border-color 0.2s;
	}

	.dash-card.validated {
		border-color: #86efac;
		background: #f0fdf4;
	}

	.dash-card-icon {
		flex-shrink: 0;
	}

	.dash-avatar {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--color-border);
	}

	.dash-avatar-placeholder {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--color-primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.3rem;
		font-weight: 700;
	}

	.dash-icon-wrap {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-green { background: #dcfce7; color: #166534; }
	.icon-gray { background: #f3f4f6; color: #6b7280; }

	.dash-card-body {
		flex: 1;
		min-width: 0;
	}

	.dash-card-title {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-text, #111827);
		margin-bottom: 0.2rem;
	}

	.dash-card-desc {
		font-size: 0.875rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.dash-card-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.badge-validated {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.15rem 0.6rem;
		background: #dcfce7;
		color: #166534;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 700;
	}

	.badge-pending {
		display: inline-flex;
		align-items: center;
		padding: 0.15rem 0.6rem;
		background: #f3f4f6;
		color: #6b7280;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.hint-missing {
		color: #dc2626;
		font-style: italic;
	}

	.btn-validate {
		background: var(--color-primary);
		color: white;
		border: none;
		cursor: pointer;
	}

	.btn-validate:hover:not(:disabled) {
		background: var(--color-primary-dark, #4a3860);
	}

	.btn-validate:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	/* ── Section cards ── */
	.section-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 2rem;
		margin-bottom: 1.5rem;
		scroll-margin-top: 1.5rem;
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

	.photo-required {
		font-size: 0.75rem;
		color: #dc2626;
		text-align: center;
		margin: 0;
		font-weight: 600;
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
		.dash-card { flex-wrap: wrap; }
		.dash-card-actions { width: 100%; justify-content: flex-end; }
		.profile-layout { flex-direction: column; align-items: stretch; }
		.avatar-col { width: 100%; flex-direction: row; gap: 1rem; align-items: center; }
		.travel-grid, .form-row { grid-template-columns: 1fr; }
	}

	.btn-sm {
		padding: 0.35rem 0.8rem;
		font-size: 0.8rem;
	}
</style>
