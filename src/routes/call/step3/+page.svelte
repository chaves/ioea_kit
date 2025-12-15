<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { config } from '$lib/config';

	interface Props {
		form?: {
			error?: string;
		};
	}

	let { form }: Props = $props();
	let loading = $state(false);
	let cvFile = $state<File | null>(null);
	let paperFile = $state<File | null>(null);
</script>

<svelte:head>
	<title>Apply - Step 3 | IOEA {config.currentYear}</title>
</svelte:head>

<PageHeader title="Call for Applications - Step 3" />

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
					<div class="step completed">
						<span class="step-number">✓</span>
						<span class="step-label">{config.callSteps[2]}</span>
					</div>
					<div class="step active">
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
					enctype="multipart/form-data"
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
					<h2>Upload Your Files</h2>

					<p class="upload-intro">
						Please upload your CV and a research paper or writing sample in PDF format.
						Maximum file size: 5MB per file.
					</p>

					<div class="form-group">
						<label for="cv" class="form-label">Curriculum Vitae (CV) *</label>
						<div class="file-upload">
							<input
								type="file"
								id="cv"
								name="cv"
								accept=".pdf"
								required
								onchange={(e) => {
									const target = e.target as HTMLInputElement;
									cvFile = target.files?.[0] ?? null;
								}}
							/>
							<div class="file-upload-label">
								{#if cvFile}
									<span class="file-name">{cvFile.name}</span>
								{:else}
									<span>Choose PDF file or drag here</span>
								{/if}
							</div>
						</div>
						<p class="form-help">PDF format, max 5MB</p>
					</div>

					<div class="form-group">
						<label for="paper" class="form-label">Research Paper / Writing Sample *</label>
						<div class="file-upload">
							<input
								type="file"
								id="paper"
								name="paper"
								accept=".pdf"
								required
								onchange={(e) => {
									const target = e.target as HTMLInputElement;
									paperFile = target.files?.[0] ?? null;
								}}
							/>
							<div class="file-upload-label">
								{#if paperFile}
									<span class="file-name">{paperFile.name}</span>
								{:else}
									<span>Choose PDF file or drag here</span>
								{/if}
							</div>
						</div>
						<p class="form-help">PDF format, max 5MB. This can be a work in progress.</p>
					</div>

					<div class="form-group checkbox-group">
						<label class="checkbox-label">
							<input type="checkbox" name="consent" required />
							<span>
								I confirm that the information provided is accurate and I agree to the
								processing of my personal data for the purpose of this application.
							</span>
						</label>
					</div>

					<div class="form-actions">
						<a href="/call/step2" class="btn btn-secondary">
							← Back to Step 2
						</a>
						<button type="submit" class="btn btn-primary" disabled={loading}>
							{#if loading}
								<span class="spinner-small"></span>
								Submitting...
							{:else}
								Submit Application
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
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid var(--color-border);
	}

	.upload-intro {
		color: var(--color-text-light);
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 2rem;
	}

	.file-upload {
		position: relative;
		border: 2px dashed var(--color-border);
		border-radius: 0.5rem;
		padding: 2rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.file-upload:hover {
		border-color: var(--color-primary);
		background: var(--color-bg-alt);
	}

	.file-upload input[type="file"] {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.file-upload-label {
		color: var(--color-text-light);
	}

	.file-name {
		color: var(--color-primary);
		font-weight: 600;
	}

	.form-help {
		font-size: 0.85rem;
		color: var(--color-text-light);
		margin-top: 0.5rem;
	}

	.checkbox-group {
		margin-top: 2rem;
	}

	.checkbox-label {
		display: flex;
		gap: 0.75rem;
		cursor: pointer;
		font-size: 0.9rem;
		color: var(--color-text-light);
	}

	.checkbox-label input {
		margin-top: 0.25rem;
		flex-shrink: 0;
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
		.form-actions {
			flex-direction: column;
		}
	}
</style>

