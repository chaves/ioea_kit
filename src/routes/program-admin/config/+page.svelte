<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		data: {
			configsByCategory: Record<string, Array<{ key: string; value: string; updated: string }>>;
		};
		form?: {
			success?: boolean;
			message?: string;
			error?: string;
		};
	}

	let { data, form }: Props = $props();

	let editingKey = $state<string | null>(null);
	let editValue = $state('');

	function startEdit(key: string, currentValue: string) {
		editingKey = key;
		editValue = currentValue;
	}

	function cancelEdit() {
		editingKey = null;
		editValue = '';
	}

	function getCategoryTitle(category: string): string {
		const titles: Record<string, string> = {
			email: 'Email Addresses',
			deadline: 'General Deadlines',
			applicationDeadline: 'Application Deadlines'
		};
		return titles[category] || category;
	}

	function getFieldLabel(key: string): string {
		const parts = key.split('.');
		return parts[parts.length - 1]
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, (str) => str.toUpperCase())
			.trim();
	}

	function getFieldDescription(key: string): string {
		const descriptions: Record<string, string> = {
			'email.general': 'Main contact email for the site',
			'email.coordination': 'Coordination team email',
			'email.webmaster': 'Webmaster contact email',
			'deadline.application': 'Application submission deadline',
			'deadline.notification': 'Notification date for applicants',
			'deadline.registration': 'Registration deadline for accepted participants',
			'deadline.students': 'Student-specific deadline',
			'applicationDeadline.first.date': 'First application deadline date',
			'applicationDeadline.first.notificationDate':
				'Notification date for first round',
			'applicationDeadline.first.active': 'Enable first application deadline',
			'applicationDeadline.second.date': 'Second application deadline date',
			'applicationDeadline.second.notificationDate':
				'Notification date for second round',
			'applicationDeadline.second.active': 'Enable second application deadline',
		};
		return descriptions[key] || '';
	}

	function isBoolean(value: string): boolean {
		return value === 'true' || value === 'false';
	}
</script>

<svelte:head>
	<title>Site Configuration | Program Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mb-6">
		<h1 class="text-3xl font-bold mb-2">Site Configuration</h1>
		<p class="text-text-light">Manage emails, deadlines, and application settings</p>
	</div>

	{#if form?.success}
		<div
			class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="text-green-600"
			>
				<polyline points="20 6 9 17 4 12"></polyline>
			</svg>
			{form.message}
		</div>
	{/if}

	{#if form?.error}
		<div
			class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="text-red-600"
			>
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="8" x2="12" y2="12"></line>
				<line x1="12" y1="16" x2="12.01" y2="16"></line>
			</svg>
			{form.error}
		</div>
	{/if}

	{#each Object.entries(data.configsByCategory) as [category, configs]}
		<div class="bg-white rounded-lg border border-border p-6 shadow-sm mb-6">
			<h2 class="text-xl font-bold mb-4">{getCategoryTitle(category)}</h2>

			<div class="space-y-4">
				{#each configs as config}
					<div class="border-b border-border pb-4 last:border-b-0 last:pb-0">
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<div class="font-semibold text-text mb-1">{getFieldLabel(config.key)}</div>
								{#if getFieldDescription(config.key)}
									<div class="text-sm text-text-light mb-2">
										{getFieldDescription(config.key)}
									</div>
								{/if}

								{#if editingKey === config.key}
									<form
										method="POST"
										action="?/update"
										use:enhance={() => {
											return async ({ result, update }) => {
												await update();
												if (result.type === 'success') {
													cancelEdit();
												}
											};
										}}
										class="flex gap-2 mt-2"
									>
										<input type="hidden" name="key" value={config.key} />
										{#if isBoolean(config.value)}
											<select
												name="value"
												bind:value={editValue}
												class="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
											>
												<option value="true">Enabled (true)</option>
												<option value="false">Disabled (false)</option>
											</select>
										{:else}
											<input
												type="text"
												name="value"
												bind:value={editValue}
												class="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
												placeholder="Enter value"
											/>
										{/if}
										<button
											type="submit"
											class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
										>
											Save
										</button>
										<button
											type="button"
											onclick={cancelEdit}
											class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
										>
											Cancel
										</button>
									</form>
								{:else}
									<div class="flex items-center gap-2 mt-2">
										{#if isBoolean(config.value)}
											<span
												class="px-3 py-1 rounded-full text-sm font-medium {config.value ===
												'true'
													? 'bg-green-100 text-green-800'
													: 'bg-gray-100 text-gray-800'}"
											>
												{config.value === 'true' ? 'Enabled' : 'Disabled'}
											</span>
										{:else}
											<code class="text-text-light bg-gray-50 px-3 py-1 rounded">
												{config.value}
											</code>
										{/if}
									</div>
								{/if}
							</div>

							{#if editingKey !== config.key}
								<button
									onclick={() => startEdit(config.key, config.value)}
									class="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex-shrink-0"
								>
									Edit
								</button>
							{/if}
						</div>

						<div class="text-xs text-text-light mt-2">
							Last updated: {new Date(config.updated).toLocaleString()}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}

	<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
		<div class="flex items-start gap-3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="text-blue-600 flex-shrink-0"
			>
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="16" x2="12" y2="12"></line>
				<line x1="12" y1="8" x2="12.01" y2="8"></line>
			</svg>
			<div>
				<h3 class="font-semibold text-blue-900 mb-2">Configuration Management</h3>
				<p class="text-sm text-blue-800 mb-3">
					These settings are stored in the database and can be updated here without requiring code
					changes or redeployment.
				</p>
				<ul class="text-sm text-blue-800 space-y-1 ml-4 list-disc">
					<li>Changes take effect immediately across the site</li>
					<li>Date formats should be human-readable (e.g., "March 31", "April 4")</li>
					<li>Boolean values must be "true" or "false"</li>
				</ul>
			</div>
		</div>
	</div>
</div>
