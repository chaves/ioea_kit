<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { config } from '$lib/config';

	interface Props {
		data: {
			countries: Array<{ id: number; name: string }>;
			status: number;
		};
		form?: {
			error?: string;
			values?: Record<string, string>;
		};
	}

	let { data, form }: Props = $props();
	let loading = $state(false);
	let errorDiv: HTMLDivElement | null = $state(null);

	// Check if user is a PhD student (status = 1)
	const isPhDStudent = $derived(data.status === 1);
	const titleLabel = $derived(isPhDStudent ? 'Title of PhD' : 'Title of Research Project');

	// Auto-scroll to error when it appears
	$effect(() => {
		if (form?.error && errorDiv) {
			errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	});
</script>

<svelte:head>
	<title>Apply - Step 2 | IOEA {config.currentYear}</title>
</svelte:head>

<PageHeader title="Call for Applications - Step 2" />

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
						<span class="flex items-center justify-center w-9 h-9 bg-secondary text-white rounded-full font-semibold">2</span>
						<span class="text-sm text-text-light">{config.callSteps[2]}</span>
					</div>
					<div class="flex flex-col items-center gap-2 flex-1 text-center opacity-50">
						<span class="flex items-center justify-center w-9 h-9 bg-primary text-white rounded-full font-semibold">3</span>
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
					use:enhance={() => {
						loading = true;
						return async ({ result, update }) => {
							loading = false;
							if (result.type === 'redirect') {
								await goto(result.location);
							} else {
								await update();
							}
						};
					}}
					class="bg-white p-8 rounded-lg border border-border"
				>
					<h2 class="mt-0 mb-6 pb-3 border-b-2 border-border">Affiliation</h2>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="mb-6">
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
						<div class="mb-6">
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

					<div class="mb-6">
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

					<h2 class="mt-8 mb-6 pb-3 border-b-2 border-border">
						{isPhDStudent ? 'PhD Project' : 'Research Project'}
					</h2>

					<div class="mb-6">
						<label for="phd_title" class="form-label">{titleLabel} *</label>
						<input
							type="text"
							id="phd_title"
							name="phd_title"
							class="form-input"
							required
							value={form?.values?.phd_title ?? ''}
						/>
					</div>

					{#if isPhDStudent}
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="mb-6">
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
							<div class="mb-6">
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

						<div class="mb-6">
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
					{/if}

					<div class="mb-6">
						<label for="phd_summary" class="form-label">
							{isPhDStudent ? 'PhD Research Summary' : 'Research Summary'} (max 500 words) *
						</label>
						<textarea
							id="phd_summary"
							name="phd_summary"
							class="form-input resize-y min-h-[150px]"
							rows="8"
							required
							placeholder={isPhDStudent
								? 'Describe your PhD research, methodology, and expected contributions...'
								: 'Describe your research interests, current projects, and contributions...'}
						>{form?.values?.phd_summary ?? ''}</textarea>
					</div>

					<div class="mt-8 pt-6 border-t border-border flex justify-between gap-4 flex-col sm:flex-row">
						<a href="/call" class="btn btn-secondary">
							← Back to Step 1
						</a>
						<button type="submit" class="btn btn-primary" disabled={loading}>
							{#if loading}
								<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
								Processing...
							{:else}
								Continue to Step 3 →
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


