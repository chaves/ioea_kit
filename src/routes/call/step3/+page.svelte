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
	let errorDiv: HTMLDivElement | null = $state(null);

	// Auto-scroll to error when it appears
	$effect(() => {
		if (form?.error && errorDiv) {
			errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	});
</script>

<svelte:head>
	<title>Apply - Step 3 | IOEA {config.currentYear}</title>
</svelte:head>

<PageHeader title="Call for Applications - Step 3" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<!-- Progress Steps -->
				<div class="flex justify-between mb-8 p-6 bg-bg-alt rounded-lg">
					<div class="flex flex-col items-center gap-2 flex-1 text-center opacity-100">
						<span class="flex items-center justify-center w-9 h-9 bg-accent text-white rounded-full font-semibold">✓</span>
						<span class="text-sm text-text-light">{config.callSteps[1]}</span>
					</div>
					<div class="flex flex-col items-center gap-2 flex-1 text-center opacity-100">
						<span class="flex items-center justify-center w-9 h-9 bg-accent text-white rounded-full font-semibold">✓</span>
						<span class="text-sm text-text-light">{config.callSteps[2]}</span>
					</div>
					<div class="flex flex-col items-center gap-2 flex-1 text-center opacity-100">
						<span class="flex items-center justify-center w-9 h-9 bg-secondary text-white rounded-full font-semibold">3</span>
						<span class="text-sm text-text-light">{config.callSteps[3]}</span>
					</div>
				</div>

				{#if form?.error}
					<div bind:this={errorDiv} class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
						<div class="flex items-start">
							<svg
								class="w-6 h-6 text-red-500 mr-3 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<div class="flex-1">
								<p class="text-sm font-semibold text-red-800 mb-1">Error</p>
								<p class="text-sm text-red-700">{form.error}</p>
							</div>
						</div>
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
					class="bg-white p-8 rounded-lg border border-border"
				>
					<h2 class="mb-4 pb-3 border-b-2 border-border">Upload Your Files</h2>

					<p class="text-text-light mb-8">
						Please upload your CV and a research paper or writing sample in PDF format.
						Maximum file size: 5MB per file.
					</p>

					<div class="mb-8">
						<label for="cv" class="form-label">Curriculum Vitae (CV) *</label>
						<div class="relative border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:border-primary hover:bg-bg-alt">
							<input
								type="file"
								id="cv"
								name="cv"
								accept=".pdf"
								required
								class="absolute inset-0 opacity-0 cursor-pointer"
								onchange={(e) => {
									const target = e.target as HTMLInputElement;
									cvFile = target.files?.[0] ?? null;
								}}
							/>
							<div class="text-text-light">
								{#if cvFile}
									<span class="text-primary font-semibold">{cvFile.name}</span>
								{:else}
									<span>Choose PDF file or drag here</span>
								{/if}
							</div>
						</div>
						<p class="text-sm text-text-light mt-2">PDF format, max 5MB</p>
					</div>

					<div class="mb-8">
						<label for="paper" class="form-label">Research Paper / Writing Sample *</label>
						<div class="relative border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:border-primary hover:bg-bg-alt">
							<input
								type="file"
								id="paper"
								name="paper"
								accept=".pdf"
								required
								class="absolute inset-0 opacity-0 cursor-pointer"
								onchange={(e) => {
									const target = e.target as HTMLInputElement;
									paperFile = target.files?.[0] ?? null;
								}}
							/>
							<div class="text-text-light">
								{#if paperFile}
									<span class="text-primary font-semibold">{paperFile.name}</span>
								{:else}
									<span>Choose PDF file or drag here</span>
								{/if}
							</div>
						</div>
						<p class="text-sm text-text-light mt-2">PDF format, max 5MB. This can be a work in progress.</p>
					</div>

					<div class="mt-8">
						<label class="flex gap-3 cursor-pointer text-sm text-text-light">
							<input type="checkbox" name="consent" required class="mt-1 flex-shrink-0" />
							<span>
								I confirm that the information provided is accurate and I agree to the
								processing of my personal data for the purpose of this application.
							</span>
						</label>
					</div>

					<div class="mt-8 pt-6 border-t border-border flex justify-between gap-4 flex-col sm:flex-row">
						<a href="/call/step2" class="btn btn-secondary">
							← Back to Step 2
						</a>
						<button type="submit" class="btn btn-primary" disabled={loading}>
							{#if loading}
								<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
								Submitting...
							{:else}
								Submit Application
							{/if}
						</button>
					</div>
				</form>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar showBrochure={true} showPhotos={false} />
			</aside>
		</div>
	</div>
</section>


