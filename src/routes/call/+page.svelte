<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';
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
	let errorDiv: HTMLDivElement | undefined = $state();
	let cvFile = $state<File | null>(null);
	let paperFile = $state<File | null>(null);
	let selectedStatus = $state('');

	// Sync selectedStatus when form returns with values (e.g., after validation error)
	$effect(() => {
		if (form?.values?.status) {
			selectedStatus = form.values.status;
		}
	});

	// Check if user is a PhD student (status = 1)
	const isPhDStudent = $derived(selectedStatus === '1');
	const titleLabel = $derived(isPhDStudent ? 'Title of PhD' : 'Title of Research Project');

	// Handle form errors: scroll to error and reset file state
	$effect(() => {
		if (form?.error) {
			// Reset file state since browser clears file inputs on form resubmission
			cvFile = null;
			paperFile = null;

			if (errorDiv) {
				setTimeout(() => {
					errorDiv?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}, 100);
			}
		}
	});
</script>

<SEO
	title="Application form - IOEA {config.currentYear}"
	description="Submit your application for the IOEA {config.currentYear} session."
/>

<PageHeader title="Application form - IOEA {config.currentYear}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
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
								await goto(result.location);
							} else {
								await update();
							}
						};
					}}
					class="space-y-8"
					novalidate
				>
					<!-- Section 1: Personal Information -->
					<div class="bg-white p-8 rounded-lg border border-border">
						<div class="flex items-center gap-3 mb-6 pb-3 border-b-2 border-border">
							<span class="flex items-center justify-center w-8 h-8 bg-secondary text-white rounded-full font-semibold text-sm">1</span>
							<h2 class="m-0">{config.callSteps[1]}</h2>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="mb-4">
								<label for="first_name" class="block mb-2 font-medium text-text">First Name *</label>
								<input
									type="text"
									id="first_name"
									name="first_name"
									class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
									minlength="2"
									maxlength="255"
									value={form?.values?.first_name ?? ''}
									autocomplete="given-name"
								/>
							</div>
							<div class="mb-4">
								<label for="last_name" class="block mb-2 font-medium text-text">Last Name *</label>
								<input
									type="text"
									id="last_name"
									name="last_name"
									class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
									minlength="2"
									maxlength="255"
									value={form?.values?.last_name ?? ''}
									autocomplete="family-name"
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="mb-4">
								<label for="email" class="block mb-2 font-medium text-text">Email Address *</label>
								<input
									type="email"
									id="email"
									name="email"
									class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
									maxlength="255"
									value={form?.values?.email ?? ''}
									autocomplete="email"
									placeholder="name@example.com"
								/>
							</div>
							<div class="mb-4">
								<label for="nationality" class="block mb-2 font-medium text-text">Nationality *</label>
								<select id="nationality" name="nationality" class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required>
									<option value="">-----------------</option>
									{#each data.countries as country}
										<option value={country.id} selected={form?.values?.nationality === String(country.id)}>
											{country.name}
										</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="mb-4">
								<label for="gender" class="block mb-2 font-medium text-text">Gender *</label>
								<select id="gender" name="gender" class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required>
									<option value="">-----------------</option>
									<option value="F" selected={form?.values?.gender === 'F'}>Female</option>
									<option value="M" selected={form?.values?.gender === 'M'}>Male</option>
								</select>
							</div>
							<div class="mb-4">
								<label for="age" class="block mb-2 font-medium text-text">Age *</label>
								<input
									type="number"
									id="age"
									name="age"
									class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
									min="18"
									max="100"
									value={form?.values?.age ?? ''}
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="mb-4">
								<label for="status" class="block mb-2 font-medium text-text">Current Status *</label>
								<select
									id="status"
									name="status"
									class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
									bind:value={selectedStatus}
								>
									<option value="">-----------------</option>
									{#each Object.entries(config.statusOptions) as [value, label]}
										<option value={value}>
											{label}
										</option>
									{/each}
								</select>
							</div>
							<div class="mb-4">
								<label for="domain" class="block mb-2 font-medium text-text">Research Domain *</label>
								<input
									type="text"
									id="domain"
									name="domain"
									class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
									minlength="3"
									maxlength="255"
									placeholder="e.g., Economics, Management, Law"
									value={form?.values?.domain ?? ''}
								/>
							</div>
						</div>

						<div class="mb-4">
							<label for="diploma" class="block mb-2 font-medium text-text">Highest Diploma Obtained *</label>
							<input
								type="text"
								id="diploma"
								name="diploma"
								class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								required
								minlength="3"
								maxlength="255"
								placeholder="e.g., Master in Economics"
								value={form?.values?.diploma ?? ''}
							/>
						</div>
					</div>

					<!-- Section 2: Affiliation & Project -->
					<div class="bg-white p-8 rounded-lg border border-border">
						<div class="flex items-center gap-3 mb-6 pb-3 border-b-2 border-border">
							<span class="flex items-center justify-center w-8 h-8 bg-secondary text-white rounded-full font-semibold text-sm">2</span>
							<h2 class="m-0">{config.callSteps[2]}</h2>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="mb-4">
								<label for="university" class="block mb-2 font-medium text-text">University / Institution *</label>
								<input
									type="text"
									id="university"
									name="university"
									class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
									value={form?.values?.university ?? ''}
								/>
							</div>
							<div class="mb-4">
								<label for="department" class="block mb-2 font-medium text-text">Department *</label>
								<input
									type="text"
									id="department"
									name="department"
									class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
									value={form?.values?.department ?? ''}
								/>
							</div>
						</div>

						<div class="mb-4">
							<label for="country" class="block mb-2 font-medium text-text">Institution Country *</label>
							<select id="country" name="country" class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required>
								<option value="">-----------------</option>
								{#each data.countries as country}
									<option value={country.id} selected={form?.values?.country === String(country.id)}>
										{country.name}
									</option>
								{/each}
							</select>
						</div>

						<h3 class="mt-6 mb-4 pb-2 border-b border-border text-lg">
							{isPhDStudent ? 'PhD Project' : 'Research Project'}
						</h3>

						<div class="mb-4">
							<label for="phd_title" class="block mb-2 font-medium text-text">{titleLabel} *</label>
							<input
								type="text"
								id="phd_title"
								name="phd_title"
								class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								required
								value={form?.values?.phd_title ?? ''}
							/>
						</div>

						{#if isPhDStudent}
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="mb-4">
									<label for="phd_ad_name" class="block mb-2 font-medium text-text">Supervisor Name *</label>
									<input
										type="text"
										id="phd_ad_name"
										name="phd_ad_name"
										class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										required
										value={form?.values?.phd_ad_name ?? ''}
									/>
								</div>
								<div class="mb-4">
									<label for="phd_ad_mail" class="block mb-2 font-medium text-text">Supervisor Email *</label>
									<input
										type="email"
										id="phd_ad_mail"
										name="phd_ad_mail"
										class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										required
										value={form?.values?.phd_ad_mail ?? ''}
									/>
								</div>
							</div>

							<div class="mb-4">
								<label for="phd_year" class="block mb-2 font-medium text-text">Expected Year of Completion *</label>
								<input
									type="number"
									id="phd_year"
									name="phd_year"
									class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
									min="2024"
									max="2035"
									value={form?.values?.phd_year ?? ''}
								/>
							</div>
						{/if}

						<div class="mb-4">
							<label for="phd_summary" class="block mb-2 font-medium text-text">
								{isPhDStudent ? 'PhD Research Summary' : 'Research Summary'} (50–2000 characters) *
							</label>
							<textarea
								id="phd_summary"
								name="phd_summary"
								class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y min-h-[150px]"
								rows="8"
								required
								minlength="50"
								maxlength="2000"
								placeholder={isPhDStudent
									? 'Describe your PhD research, methodology, and expected contributions...'
									: 'Describe your research interests, current projects, and contributions...'}
							>{form?.values?.phd_summary ?? ''}</textarea>
						</div>
					</div>

					<!-- Section 3: File Uploads -->
					<div class="bg-white p-8 rounded-lg border border-border">
						<div class="flex items-center gap-3 mb-6 pb-3 border-b-2 border-border">
							<span class="flex items-center justify-center w-8 h-8 bg-secondary text-white rounded-full font-semibold text-sm">3</span>
							<h2 class="m-0">{config.callSteps[3]}</h2>
						</div>

						<p class="text-text-light mb-6">
							Please upload your CV and a research paper or writing sample in PDF format.
							Maximum file size: 5MB per file.
						</p>

						<div class="mb-6">
							<label for="cv" class="block mb-2 font-medium text-text">Curriculum Vitae (CV) *</label>
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

						<div class="mb-6">
							<label for="paper" class="block mb-2 font-medium text-text">Research Paper / Writing Sample *</label>
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

						<div class="mt-6">
							<label class="flex gap-3 cursor-pointer text-sm text-text-light">
								<input type="checkbox" name="consent" required class="mt-1 flex-shrink-0" />
								<span>
									I confirm that the information provided is accurate and I agree to the
									processing of my personal data for the purpose of this application.
								</span>
							</label>
						</div>
					</div>

					<!-- Submit Button -->
					<div class="text-right">
						<button type="submit" class="btn btn-primary" disabled={loading}>
							{#if loading}
								<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
								Submitting Application...
							{:else}
								Submit Application
							{/if}
						</button>
					</div>
				</form>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar showBrochure={true} showPhotos={false} />

				<div class="sidebar-widget bg-bg-alt rounded-lg p-6 mt-6">
					<h3 class="mb-4 text-lg font-semibold text-primary">Important Dates</h3>
					<ul class="list-none p-0 m-0">
						<li class="py-3 border-b border-border last:border-b-0">
							<strong>Deadline:</strong><br />
							{config.deadlines.application}
						</li>
						<li class="py-3 border-b border-border last:border-b-0">
							<strong>Notification:</strong><br />
							{config.deadlines.notification}
						</li>
					</ul>
				</div>
			</aside>
		</div>
	</div>
</section>
