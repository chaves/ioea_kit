<script lang="ts">
	import { enhance } from '$app/forms';
	import { config } from '$lib/config';

	interface Props {
		data: {
			travel: {
				arrivalDate: string | null;
				departureDate: string | null;
				arrivalTransport: string | null;
				arrivalLocation: number | null;
				arrivalFlight: string | null;
				arrivalTransfer: number | null;
				departureTransport: string | null;
				departureLocation: number | null;
				departureFlight: string | null;
				departureTransfer: number | null;
			} | null;
		};
		form?: {
			success?: boolean;
			error?: string;
		};
	}

	let { data, form }: Props = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Participant Survey | IOEA {config.currentYear}</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<h1>Participant Survey</h1>
		<p>Please provide your travel details for IOEA {config.currentYear}</p>
	</div>

	{#if form?.success}
		<div class="alert alert-success">
			Your information has been saved successfully!
		</div>
	{/if}

	{#if form?.error}
		<div class="alert alert-error">
			{form.error}
		</div>
	{/if}

	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
		class="survey-form"
	>
		<!-- Arrival Section -->
		<div class="form-section">
			<h2>Arrival Information</h2>

			<div class="form-row">
				<div class="form-group">
					<label for="arrival_date" class="form-label">Arrival Date</label>
					<input
						type="date"
						id="arrival_date"
						name="arrival_date"
						class="form-input"
						value={data.travel?.arrivalDate ?? ''}
					/>
				</div>
				<div class="form-group">
					<label for="arrival_transport" class="form-label">Mode of Transport</label>
					<select id="arrival_transport" name="arrival_transport" class="form-input">
						{#each config.travel.transport as option}
							<option value={option} selected={data.travel?.arrivalTransport === option}>
								{option || '-----------------'}
							</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="arrival_location" class="form-label">Arrival Location</label>
					<select id="arrival_location" name="arrival_location" class="form-input">
						<option value="">-----------------</option>
						{#each Object.entries(config.travel.locations) as [key, value]}
							<option value={key} selected={data.travel?.arrivalLocation === parseInt(key)}>
								{value}
							</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label for="arrival_flight" class="form-label">Flight/Boat Number</label>
					<input
						type="text"
						id="arrival_flight"
						name="arrival_flight"
						class="form-input"
						placeholder="e.g., AF1234"
						value={data.travel?.arrivalFlight ?? ''}
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="arrival_transfer" class="form-label">Transfer to Cargèse</label>
				<select id="arrival_transfer" name="arrival_transfer" class="form-input">
					<option value="">-----------------</option>
					{#each Object.entries(config.transfer.arrival) as [key, value]}
						<option value={key} selected={data.travel?.arrivalTransfer === parseInt(key)}>
							{value}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Departure Section -->
		<div class="form-section">
			<h2>Departure Information</h2>

			<div class="form-row">
				<div class="form-group">
					<label for="departure_date" class="form-label">Departure Date</label>
					<input
						type="date"
						id="departure_date"
						name="departure_date"
						class="form-input"
						value={data.travel?.departureDate ?? ''}
					/>
				</div>
				<div class="form-group">
					<label for="departure_transport" class="form-label">Mode of Transport</label>
					<select id="departure_transport" name="departure_transport" class="form-input">
						{#each config.travel.transport as option}
							<option value={option} selected={data.travel?.departureTransport === option}>
								{option || '-----------------'}
							</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="departure_location" class="form-label">Departure Location</label>
					<select id="departure_location" name="departure_location" class="form-input">
						<option value="">-----------------</option>
						{#each Object.entries(config.travel.locations) as [key, value]}
							<option value={key} selected={data.travel?.departureLocation === parseInt(key)}>
								{value}
							</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label for="departure_flight" class="form-label">Flight/Boat Number</label>
					<input
						type="text"
						id="departure_flight"
						name="departure_flight"
						class="form-input"
						placeholder="e.g., AF1234"
						value={data.travel?.departureFlight ?? ''}
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="departure_transfer" class="form-label">Transfer from Cargèse</label>
				<select id="departure_transfer" name="departure_transfer" class="form-input">
					<option value="">-----------------</option>
					{#each Object.entries(config.transfer.departure) as [key, value]}
						<option value={key} selected={data.travel?.departureTransfer === parseInt(key)}>
							{value}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="form-actions">
			<button type="submit" class="btn btn-primary" disabled={loading}>
				{#if loading}
					Saving...
				{:else}
					Save Information
				{/if}
			</button>
		</div>
	</form>
</div>

<style>
	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		margin-bottom: 0.5rem;
	}

	.page-header p {
		color: var(--color-text-light);
	}

	.survey-form {
		max-width: 800px;
		background: white;
		padding: 2rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
	}

	.form-section {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--color-border);
	}

	.form-section:last-of-type {
		border-bottom: none;
	}

	.form-section h2 {
		margin-bottom: 1.5rem;
		font-size: 1.25rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-actions {
		padding-top: 1rem;
	}

	@media (max-width: 600px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>

