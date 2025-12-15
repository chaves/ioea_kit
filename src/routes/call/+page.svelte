<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { config } from '$lib/config';

	interface Props {
		data: {
			countries: Array<{ id: number; name: string }>;
		};
		form?: {
			success?: boolean;
			error?: string;
			values?: Record<string, string>;
		};
	}

	let { data, form }: Props = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Application form - IOEA {config.currentYear} | Institutional and Organizational Economics Academy</title>
</svelte:head>

<PageHeader title="Application form - IOEA {config.currentYear}" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<!-- Progress Steps -->
				<div class="steps">
					<div class="step active">
						<span class="step-number">1</span>
						<span class="step-label">{config.callSteps[1]}</span>
					</div>
					<div class="step">
						<span class="step-number">2</span>
						<span class="step-label">{config.callSteps[2]}</span>
					</div>
					<div class="step">
						<span class="step-number">3</span>
						<span class="step-label">{config.callSteps[3]}</span>
					</div>
				</div>

				{#if form?.error}
					<div class="alert alert-error">
						{form.error}
					</div>
				{/if}

				<form
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ result, update }) => {
							loading = false;
							if (result.type === 'redirect') {
								goto(result.location);
							} else {
								await update();
							}
						};
					}}
					class="application-form"
				>
					<h2>Personal Information</h2>

					<div class="form-row">
						<div class="form-group">
							<label for="first_name" class="form-label">First Name *</label>
							<input
								type="text"
								id="first_name"
								name="first_name"
								class="form-input"
								required
								value={form?.values?.first_name ?? ''}
							/>
						</div>
						<div class="form-group">
							<label for="last_name" class="form-label">Last Name *</label>
							<input
								type="text"
								id="last_name"
								name="last_name"
								class="form-input"
								required
								value={form?.values?.last_name ?? ''}
							/>
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="email" class="form-label">Email Address *</label>
							<input
								type="email"
								id="email"
								name="email"
								class="form-input"
								required
								value={form?.values?.email ?? ''}
							/>
						</div>
						<div class="form-group">
							<label for="nationality" class="form-label">Nationality *</label>
							<select id="nationality" name="nationality" class="form-input" required>
								<option value="">-----------------</option>
								{#each data.countries as country}
									<option value={country.id} selected={form?.values?.nationality === String(country.id)}>
										{country.name}
									</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="gender" class="form-label">Gender *</label>
							<select id="gender" name="gender" class="form-input" required>
								<option value="">-----------------</option>
								<option value="F" selected={form?.values?.gender === 'F'}>Female</option>
								<option value="M" selected={form?.values?.gender === 'M'}>Male</option>
							</select>
						</div>
						<div class="form-group">
							<label for="age" class="form-label">Age *</label>
							<input
								type="number"
								id="age"
								name="age"
								class="form-input"
								required
								min="18"
								max="100"
								value={form?.values?.age ?? ''}
							/>
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="status" class="form-label">Current Status *</label>
							<select id="status" name="status" class="form-input" required>
								<option value="">-----------------</option>
								{#each Object.entries(config.statusOptions) as [value, label]}
									<option value={value} selected={form?.values?.status === value}>
										{label}
									</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="domain" class="form-label">Research Domain *</label>
							<input
								type="text"
								id="domain"
								name="domain"
								class="form-input"
								required
								placeholder="e.g., Economics, Management, Law"
								value={form?.values?.domain ?? ''}
							/>
						</div>
					</div>

					<div class="form-group">
						<label for="diploma" class="form-label">Highest Diploma Obtained *</label>
						<input
							type="text"
							id="diploma"
							name="diploma"
							class="form-input"
							required
							placeholder="e.g., Master in Economics"
							value={form?.values?.diploma ?? ''}
						/>
					</div>

					<div class="form-actions">
						<button type="submit" class="btn btn-primary" disabled={loading}>
							{#if loading}
								<span class="spinner-small"></span>
								Processing...
							{:else}
								Continue to Step 2 →
							{/if}
						</button>
					</div>
				</form>
			</div>

			<aside class="sidebar">
				<Sidebar showBrochure={true} showPhotos={false} />

				<div class="sidebar-widget">
					<h3>Important Dates</h3>
					<ul class="dates-list">
						<li>
							<strong>Deadline:</strong><br />
							{config.deadlines.application}
						</li>
						<li>
							<strong>Notification:</strong><br />
							{config.deadlines.notification}
						</li>
					</ul>
				</div>
			</aside>
		</div>
	</div>
</section>

<style>
	.main-grid {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 3rem;
	}

	.steps {
		display: flex;
		justify-content: space-between;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		text-align: center;
		opacity: 0.5;
	}

	.step.active {
		opacity: 1;
	}

	.step-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: var(--color-primary);
		color: white;
		border-radius: 50%;
		font-weight: 600;
	}

	.step.active .step-number {
		background: var(--color-secondary);
	}

	.step-label {
		font-size: 0.85rem;
		color: var(--color-text-light);
	}

	.application-form {
		background: white;
		padding: 2rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
	}

	.application-form h2 {
		margin-bottom: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid var(--color-border);
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
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
		text-align: right;
	}

	.spinner-small {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-right: 0.5rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.sidebar {
		position: sticky;
		top: 100px;
		align-self: start;
	}

	.dates-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.dates-list li {
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.dates-list li:last-child {
		border-bottom: none;
	}

	@media (max-width: 1024px) {
		.main-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
		}
	}

	@media (max-width: 600px) {
		.form-row {
			grid-template-columns: 1fr;
		}

		.steps {
			flex-direction: column;
			gap: 1rem;
		}

		.step {
			flex-direction: row;
			justify-content: flex-start;
		}
	}
</style>

