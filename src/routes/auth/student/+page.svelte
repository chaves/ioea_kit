<script lang="ts">
	import { enhance } from '$app/forms';
	import { config } from '$lib/config';

	interface Submission {
		firstName: string;
		lastName: string;
		email: string;
		university: string;
		title: string;
		summary: string;
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
			submission: Submission | null;
			travel: Travel | null;
			transportOptions: string[];
			locationOptions: Record<number, string>;
			arrivalTransferOptions: Record<number, string>;
			departureTransferOptions: Record<number, string>;
		};
		form?: {
			success?: boolean;
			message?: string;
			error?: string;
			action?: string;
		};
	}

	let { data, form }: Props = $props();
	let loadingPaper = $state(false);
	let loadingTravel = $state(false);
</script>

<svelte:head>
	<title>Student Area | IOEA {data.year}</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<div>
			<h1>Student Area — IOEA {data.year}</h1>
			<p class="subtitle">Please complete all sections below before the deadline.</p>
		</div>
	</header>

	{#if !data.submission}
		<div class="notice-card">
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="8" x2="12" y2="12"></line>
				<line x1="12" y1="16" x2="12.01" y2="16"></line>
			</svg>
			<div>
				<strong>No accepted submission found</strong>
				<p>Your student area will be available once your application has been accepted. If you believe this is an error, please contact us.</p>
			</div>
		</div>
	{:else}
		<!-- Profile (read-only) -->
		<section class="section-card">
			<h2 class="section-title">Your Profile</h2>
			<div class="profile-grid">
				<div class="profile-avatar">
					{data.submission.firstName[0]}{data.submission.lastName[0]}
				</div>
				<div class="profile-info">
					<p class="profile-name">{data.submission.firstName} {data.submission.lastName}</p>
					<p class="profile-detail">{data.submission.email}</p>
					{#if data.submission.university}
						<p class="profile-detail">{data.submission.university}</p>
					{/if}
				</div>
			</div>
		</section>

		<!-- Paper Information -->
		<section class="section-card">
			<h2 class="section-title">Paper Information</h2>
			<p class="section-desc">Your paper title and abstract will be used in the program booklet. Please keep them up to date.</p>

			{#if form?.action === 'updatePaper'}
				{#if form.success}
					<div class="alert alert-success">{form.message}</div>
				{:else if form.error}
					<div class="alert alert-error">{form.error}</div>
				{/if}
			{/if}

			<form
				method="POST"
				action="?/updatePaper"
				use:enhance={() => {
					loadingPaper = true;
					return async ({ update }) => {
						await update();
						loadingPaper = false;
					};
				}}
			>
				<div class="form-group">
					<label for="title" class="form-label">Paper Title</label>
					<input
						type="text"
						id="title"
						name="title"
						class="form-input"
						value={data.submission.title}
						placeholder="Enter your paper title"
					/>
				</div>
				<div class="form-group">
					<label for="summary" class="form-label">Abstract</label>
					<textarea
						id="summary"
						name="summary"
						class="form-input"
						rows="6"
						placeholder="Enter your paper abstract"
					>{data.submission.summary}</textarea>
				</div>
				<button type="submit" class="btn btn-primary" disabled={loadingPaper}>
					{loadingPaper ? 'Saving…' : 'Save Paper'}
				</button>
			</form>
		</section>

		<!-- Travel Information -->
		<section class="section-card">
			<h2 class="section-title">Travel Information</h2>
			<p class="section-desc">Please provide your arrival and departure details so we can organize transfers.</p>

			{#if form?.action === 'updateTravel'}
				{#if form.success}
					<div class="alert alert-success">{form.message}</div>
				{:else if form.error}
					<div class="alert alert-error">{form.error}</div>
				{/if}
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
					<!-- Arrival -->
					<fieldset class="travel-section">
						<legend>Arrival</legend>

						<div class="form-group">
							<label for="arrivalDate" class="form-label">Arrival Date</label>
							<input
								type="date"
								id="arrivalDate"
								name="arrivalDate"
								class="form-input"
								value={data.travel?.arrivalDate ?? ''}
							/>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="arrivalTransport" class="form-label">Transport</label>
								<select id="arrivalTransport" name="arrivalTransport" class="form-input">
									{#each data.transportOptions as opt}
										<option value={opt} selected={data.travel?.arrivalTransport === opt}>
											{opt || '—'}
										</option>
									{/each}
								</select>
							</div>
							<div class="form-group">
								<label for="arrivalLocation" class="form-label">Port / Airport</label>
								<select id="arrivalLocation" name="arrivalLocation" class="form-input">
									<option value="">—</option>
									{#each Object.entries(data.locationOptions) as [key, val]}
										<option value={key} selected={data.travel?.arrivalLocation === key}>
											{val}
										</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="form-group">
							<label for="arrivalFlight" class="form-label">Flight / Boat Number</label>
							<input
								type="text"
								id="arrivalFlight"
								name="arrivalFlight"
								class="form-input"
								placeholder="e.g. AF1234"
								value={data.travel?.arrivalFlight ?? ''}
							/>
						</div>

						<div class="form-group">
							<label for="arrivalTransfer" class="form-label">Transfer to Cargèse</label>
							<select id="arrivalTransfer" name="arrivalTransfer" class="form-input">
								<option value="">—</option>
								{#each Object.entries(data.arrivalTransferOptions) as [key, val]}
									<option value={key} selected={data.travel?.arrivalTransfer === parseInt(key)}>
										{val}
									</option>
								{/each}
							</select>
						</div>
					</fieldset>

					<!-- Departure -->
					<fieldset class="travel-section">
						<legend>Departure</legend>

						<div class="form-group">
							<label for="departureDate" class="form-label">Departure Date</label>
							<input
								type="date"
								id="departureDate"
								name="departureDate"
								class="form-input"
								value={data.travel?.departureDate ?? ''}
							/>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="departureTransport" class="form-label">Transport</label>
								<select id="departureTransport" name="departureTransport" class="form-input">
									{#each data.transportOptions as opt}
										<option value={opt} selected={data.travel?.departureTransport === opt}>
											{opt || '—'}
										</option>
									{/each}
								</select>
							</div>
							<div class="form-group">
								<label for="departureLocation" class="form-label">Port / Airport</label>
								<select id="departureLocation" name="departureLocation" class="form-input">
									<option value="">—</option>
									{#each Object.entries(data.locationOptions) as [key, val]}
										<option value={key} selected={data.travel?.departureLocation === key}>
											{val}
										</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="form-group">
							<label for="departureFlight" class="form-label">Flight / Boat Number</label>
							<input
								type="text"
								id="departureFlight"
								name="departureFlight"
								class="form-input"
								placeholder="e.g. AF1234"
								value={data.travel?.departureFlight ?? ''}
							/>
						</div>

						<div class="form-group">
							<label for="departureTransfer" class="form-label">Transfer from Cargèse</label>
							<select id="departureTransfer" name="departureTransfer" class="form-input">
								<option value="">—</option>
								{#each Object.entries(data.departureTransferOptions) as [key, val]}
									<option value={key} selected={data.travel?.departureTransfer === parseInt(key)}>
										{val}
									</option>
								{/each}
							</select>
						</div>
					</fieldset>
				</div>

				<button type="submit" class="btn btn-primary" disabled={loadingTravel}>
					{loadingTravel ? 'Saving…' : 'Save Travel Info'}
				</button>
			</form>
		</section>
	{/if}
</div>

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
		padding: 1.5rem;
		background: #fefce8;
		border: 1px solid #fde047;
		border-radius: 0.5rem;
		color: #854d0e;
	}

	.notice-card p {
		margin: 0.25rem 0 0;
		font-size: 0.9rem;
	}

	.section-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 2rem;
		margin-bottom: 1.5rem;
	}

	.section-title {
		font-size: 1.15rem;
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

	/* Profile */
	.profile-grid {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}

	.profile-avatar {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: var(--color-primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.4rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.profile-name {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
	}

	.profile-detail {
		font-size: 0.9rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0 0 0.15rem;
	}

	/* Forms */
	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	textarea.form-input {
		resize: vertical;
		min-height: 120px;
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
		font-size: 0.95rem;
		color: var(--color-primary);
		padding: 0 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	@media (max-width: 768px) {
		.travel-grid {
			grid-template-columns: 1fr;
		}

		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
