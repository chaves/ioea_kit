<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let loading = $state(false);
	let loadingValidate = $state(false);

	const canValidate = $derived(!!(data.travel && data.travel.arrivalDate));
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

	{#if form?.success && form.action !== 'validate'}
		<div class="alert alert-success">{form.message}</div>
	{:else if form?.error && form.action !== 'validate'}
		<div class="alert alert-error">{form.error}</div>
	{/if}

	{#if data.validated}
		<div class="info-bar">
			Your travel info is validated. Saving changes will reset the validation and require you to re-validate.
		</div>
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

			<button type="submit" class="btn btn-primary" disabled={loading}>
				{loading ? 'Saving…' : 'Save travel info'}
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
					<strong>Validate your travel information</strong>
					<p>Confirm that your arrival and departure details are complete and correct.</p>
					{#if !canValidate}
						<p class="missing">Fill in your arrival date first.</p>
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
						title={!canValidate ? 'Fill in your arrival date first' : ''}
					>
						{loadingValidate ? '…' : 'Validate travel'}
					</button>
				</form>
			</div>
		</div>
	{:else}
		<div class="validated-box">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
			Travel information validated. Edit above to make changes — you will need to re-validate.
		</div>
	{/if}
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

	@media (max-width: 768px) {
		.admin-page { padding: 1.25rem; }
		.travel-grid, .form-row { grid-template-columns: 1fr; }
		.validate-row { flex-direction: column; align-items: flex-start; }
	}
</style>
