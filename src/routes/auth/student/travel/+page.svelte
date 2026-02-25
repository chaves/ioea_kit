<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let loading = $state(false);

	let arrivalDate = $state(data.travel?.arrivalDate ?? '');
	const canValidate = $derived(!!arrivalDate);
</script>

<svelte:head>
	<title>Travel | Student Area | IOEA {data.year}</title>
</svelte:head>

<div class="admin-page">
	<header class="page-top">
		<div class="page-top-left">
			<a href="/auth/student" class="back-link">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
				Overview
			</a>
			<h1>Travel Information</h1>
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
			use:enhance={() => {
				loading = true;
				return async ({ update }) => { await update(); loading = false; };
			}}
		>
			<div class="travel-grid">
				<fieldset class="travel-section">
					<legend>Arrival</legend>
					<div class="form-group">
						<label for="arrivalDate" class="form-label">Arrival date <span class="required-star">*</span></label>
						<input
							type="date"
							id="arrivalDate"
							name="arrivalDate"
							class="form-input"
							bind:value={arrivalDate}
							required
						/>
					</div>
					<div class="form-row">
						<div class="form-group">
							<label for="arrivalTransport" class="form-label">Transport</label>
							<select id="arrivalTransport" name="arrivalTransport" class="form-input" required>
								<option value="">—</option>
								{#each data.transportOptions.filter(o => o) as opt}
									<option value={opt} selected={data.travel?.arrivalTransport === opt}>{opt}</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="arrivalLocation" class="form-label">Port / Airport</label>
							<select id="arrivalLocation" name="arrivalLocation" class="form-input" required>
								<option value="">—</option>
								{#each Object.entries(data.locationOptions) as [k, v]}
									<option value={k} selected={data.travel?.arrivalLocation === k}>{v}</option>
								{/each}
							</select>
						</div>
					</div>
					<div class="form-group">
						<label for="arrivalFlight" class="form-label">Flight / Boat number</label>
						<input type="text" id="arrivalFlight" name="arrivalFlight" class="form-input" placeholder="e.g. AF1234" value={data.travel?.arrivalFlight ?? ''} required />
					</div>
					<div class="form-group">
						<label for="arrivalTransfer" class="form-label">Transfer to Cargèse</label>
						<select id="arrivalTransfer" name="arrivalTransfer" class="form-input" required>
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
						<input type="date" id="departureDate" name="departureDate" class="form-input" value={data.travel?.departureDate ?? ''} required />
					</div>
					<div class="form-row">
						<div class="form-group">
							<label for="departureTransport" class="form-label">Transport</label>
							<select id="departureTransport" name="departureTransport" class="form-input" required>
								<option value="">—</option>
								{#each data.transportOptions.filter(o => o) as opt}
									<option value={opt} selected={data.travel?.departureTransport === opt}>{opt}</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="departureLocation" class="form-label">Port / Airport</label>
							<select id="departureLocation" name="departureLocation" class="form-input" required>
								<option value="">—</option>
								{#each Object.entries(data.locationOptions) as [k, v]}
									<option value={k} selected={data.travel?.departureLocation === k}>{v}</option>
								{/each}
							</select>
						</div>
					</div>
					<div class="form-group">
						<label for="departureFlight" class="form-label">Flight / Boat number</label>
						<input type="text" id="departureFlight" name="departureFlight" class="form-input" placeholder="e.g. AF1234" value={data.travel?.departureFlight ?? ''} required />
					</div>
					<div class="form-group">
						<label for="departureTransfer" class="form-label">Transfer from Cargèse</label>
						<select id="departureTransfer" name="departureTransfer" class="form-input" required>
							<option value="">—</option>
							{#each Object.entries(data.departureTransferOptions) as [k, v]}
								<option value={k} selected={data.travel?.departureTransfer === parseInt(k)}>{v}</option>
							{/each}
						</select>
					</div>
				</fieldset>
			</div>

			<div class="form-footer">
				<button type="submit" class="btn btn-validate" disabled={!canValidate || loading}>
					{loading ? 'Saving…' : 'Validate travel'}
				</button>
				{#if !canValidate}
					<span class="footer-hint">Fill in your arrival date first</span>
				{/if}
			</div>
		</form>
	</div>
</div>

<style>
	.admin-page {
		padding: 2rem 2.5rem;
		max-width: 900px;
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

	.form-group { margin-bottom: 1.25rem; }

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.required-star { color: #dc2626; }

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
		white-space: nowrap;
		padding: 0.6rem 1.5rem;
		border-radius: 0.375rem;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.btn-validate:hover:not(:disabled) { background: var(--color-primary-dark, #4a3860); }
	.btn-validate:disabled { opacity: 0.45; cursor: not-allowed; }

	@media (max-width: 768px) {
		.admin-page { padding: 1.25rem; }
		.travel-grid, .form-row { grid-template-columns: 1fr; }
		.form-footer { flex-direction: column; align-items: flex-start; }
	}
</style>
