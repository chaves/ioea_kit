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
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<!-- Progress Steps -->
				<div class="flex justify-between mb-8 p-6 bg-bg-alt rounded-lg flex-col gap-4 sm:flex-row">
					<div class="flex flex-col items-center gap-2 flex-1 text-center opacity-100 sm:flex-row sm:justify-start">
						<span class="flex items-center justify-center w-9 h-9 bg-secondary text-white rounded-full font-semibold">1</span>
						<span class="text-sm text-text-light">{config.callSteps[1]}</span>
					</div>
					<div class="flex flex-col items-center gap-2 flex-1 text-center opacity-50 sm:flex-row sm:justify-start">
						<span class="flex items-center justify-center w-9 h-9 bg-primary text-white rounded-full font-semibold">2</span>
						<span class="text-sm text-text-light">{config.callSteps[2]}</span>
					</div>
					<div class="flex flex-col items-center gap-2 flex-1 text-center opacity-50 sm:flex-row sm:justify-start">
						<span class="flex items-center justify-center w-9 h-9 bg-primary text-white rounded-full font-semibold">3</span>
						<span class="text-sm text-text-light">{config.callSteps[3]}</span>
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
					class="bg-white p-8 rounded-lg border border-border"
				>
					<h2 class="mb-6 pb-3 border-b-2 border-border">Personal Information</h2>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="mb-6">
							<label for="first_name" class="block mb-2 font-medium text-text">First Name *</label>
							<input
								type="text"
								id="first_name"
								name="first_name"
								class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								required
								value={form?.values?.first_name ?? ''}
							/>
						</div>
						<div class="mb-6">
							<label for="last_name" class="block mb-2 font-medium text-text">Last Name *</label>
							<input
								type="text"
								id="last_name"
								name="last_name"
								class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								required
								value={form?.values?.last_name ?? ''}
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="mb-6">
							<label for="email" class="block mb-2 font-medium text-text">Email Address *</label>
							<input
								type="email"
								id="email"
								name="email"
								class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								required
								value={form?.values?.email ?? ''}
							/>
						</div>
						<div class="mb-6">
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
						<div class="mb-6">
							<label for="gender" class="block mb-2 font-medium text-text">Gender *</label>
							<select id="gender" name="gender" class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required>
								<option value="">-----------------</option>
								<option value="F" selected={form?.values?.gender === 'F'}>Female</option>
								<option value="M" selected={form?.values?.gender === 'M'}>Male</option>
							</select>
						</div>
						<div class="mb-6">
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
						<div class="mb-6">
							<label for="status" class="block mb-2 font-medium text-text">Current Status *</label>
							<select id="status" name="status" class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required>
								<option value="">-----------------</option>
								{#each Object.entries(config.statusOptions) as [value, label]}
									<option value={value} selected={form?.values?.status === value}>
										{label}
									</option>
								{/each}
							</select>
						</div>
						<div class="mb-6">
							<label for="domain" class="block mb-2 font-medium text-text">Research Domain *</label>
							<input
								type="text"
								id="domain"
								name="domain"
								class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								required
								placeholder="e.g., Economics, Management, Law"
								value={form?.values?.domain ?? ''}
							/>
						</div>
					</div>

					<div class="mb-6">
						<label for="diploma" class="block mb-2 font-medium text-text">Highest Diploma Obtained *</label>
						<input
							type="text"
							id="diploma"
							name="diploma"
							class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							required
							placeholder="e.g., Master in Economics"
							value={form?.values?.diploma ?? ''}
						/>
					</div>

					<div class="mt-8 pt-6 border-t border-border text-right">
						<button type="submit" class="btn btn-primary" disabled={loading}>
							{#if loading}
								<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
								Processing...
							{:else}
								Continue to Step 2 →
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


