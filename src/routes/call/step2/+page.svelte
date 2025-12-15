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
			error?: string;
			values?: Record<string, string>;
		};
	}

	let { data, form }: Props = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Apply - Step 2 | IOEA {config.currentYear}</title>
</svelte:head>

<PageHeader title="Call for Applications - Step 2" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<!-- Progress Steps -->
				<div class="steps">
					<div class="step completed">
						<span class="step-number">✓</span>
						<span class="step-label">{config.callSteps[1]}</span>
					</div>
					<div class="step active">
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
					<h2>Affiliation</h2>

					<div class="form-row">
						<div class="form-group">
							<label for="university" class="form-label">University / Institution *</label>
							<input
								type="text"
								id="university"
								name="university"
								class="form-input"
								required
								value={form?.values?.university ?? ''}
							/>
						</div>
						<div class="form-group">
							<label for="department" class="form-label">Department *</label>
							<input
								type="text"
								id="department"
								name="department"
								class="form-input"
								required
								value={form?.values?.department ?? ''}
							/>
						</div>
					</div>

					<div class="form-group">
						<label for="country" class="form-label">Country *</label>
						<select id="country" name="country" class="form-input" required>
							<option value="">-----------------</option>
							{#each data.countries as country}
								<option value={country.id} selected={form?.values?.country === String(country.id)}>
									{country.name}
								</option>
							{/each}
						</select>
					</div>

					<h2>PhD Project / Current Research</h2>

					<div class="form-group">
						<label for="phd_title" class="form-label">Title of PhD / Research Project *</label>
						<input
							type="text"
							id="phd_title"
							name="phd_title"
							class="form-input"
							required
							value={form?.values?.phd_title ?? ''}
						/>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="phd_ad_name" class="form-label">Supervisor Name *</label>
							<input
								type="text"
								id="phd_ad_name"
								name="phd_ad_name"
								class="form-input"
								required
								value={form?.values?.phd_ad_name ?? ''}
							/>
						</div>
						<div class="form-group">
							<label for="phd_ad_mail" class="form-label">Supervisor Email *</label>
							<input
								type="email"
								id="phd_ad_mail"
								name="phd_ad_mail"
								class="form-input"
								required
								value={form?.values?.phd_ad_mail ?? ''}
							/>
						</div>
					</div>

					<div class="form-group">
						<label for="phd_year" class="form-label">Expected Year of Completion *</label>
						<input
							type="number"
							id="phd_year"
							name="phd_year"
							class="form-input"
							required
							min="2024"
							max="2035"
							value={form?.values?.phd_year ?? ''}
						/>
					</div>

					<div class="form-group">
						<label for="phd_summary" class="form-label">
							Summary of Research (max 500 words) *
						</label>
						<textarea
							id="phd_summary"
							name="phd_summary"
							class="form-input"
							rows="8"
							required
							placeholder="Describe your research project, methodology, and expected contributions..."
						>{form?.values?.phd_summary ?? ''}</textarea>
					</div>

					<div class="form-actions">
						<a href="/call" class="btn btn-secondary">
							← Back to Step 1
						</a>
						<button type="submit" class="btn btn-primary" disabled={loading}>
							{#if loading}
								<span class="spinner-small"></span>
								Processing...
							{:else}
								Continue to Step 3 →
							{/if}
						</button>
					</div>
				</form>
			</div>

			<aside class="sidebar">
				<Sidebar showBrochure={true} showPhotos={false} />
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

	.step.active,
	.step.completed {
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

	.step.completed .step-number {
		background: var(--color-accent);
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
		margin-top: 2rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid var(--color-border);
	}

	.application-form h2:first-child {
		margin-top: 0;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	textarea.form-input {
		resize: vertical;
		min-height: 150px;
	}

	.form-actions {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
		display: flex;
		justify-content: space-between;
		gap: 1rem;
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

		.form-actions {
			flex-direction: column;
		}
	}
</style>

