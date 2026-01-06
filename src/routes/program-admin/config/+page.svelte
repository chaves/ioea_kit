<script lang="ts">
	interface Props {
		data: {
			siteConfig: {
				siteName: string;
				currentYear: number;
				adminEmail: string;
			};
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Site Configuration | Program Admin</title>
</svelte:head>

<div class="p-8">
	<div class="mb-6">
		<h1 class="text-3xl font-bold mb-2">Site Configuration</h1>
		<p class="text-text-light">Manage site settings and configuration</p>
	</div>

	<div class="bg-white rounded-lg border border-border p-6 shadow-sm mb-6">
		<h2 class="text-xl font-bold mb-4">Current Configuration</h2>

		<div class="space-y-4">
			<div class="flex items-center justify-between border-b border-border pb-4">
				<div>
					<div class="font-semibold text-text">Site Name</div>
					<div class="text-sm text-text-light">The name of the site</div>
				</div>
				<div class="text-text-light">{data.siteConfig.siteName}</div>
			</div>

			<div class="flex items-center justify-between border-b border-border pb-4">
				<div>
					<div class="font-semibold text-text">Current Year</div>
					<div class="text-sm text-text-light">Active program year</div>
				</div>
				<div class="text-text-light">{data.siteConfig.currentYear}</div>
			</div>

			<div class="flex items-center justify-between border-b border-border pb-4">
				<div>
					<div class="font-semibold text-text">Admin Email</div>
					<div class="text-sm text-text-light">Contact email for administrators</div>
				</div>
				<div class="text-text-light">{data.siteConfig.adminEmail || 'Not configured'}</div>
			</div>
		</div>
	</div>

	<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
		<div class="flex items-start gap-3">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600 flex-shrink-0">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="16" x2="12" y2="12"></line>
				<line x1="12" y1="8" x2="12.01" y2="8"></line>
			</svg>
			<div>
				<h3 class="font-semibold text-blue-900 mb-2">Environment Variables</h3>
				<p class="text-sm text-blue-800 mb-3">
					Site configuration is managed through environment variables. To modify these settings, update your <code class="bg-blue-100 px-2 py-0.5 rounded">.env</code> file with the following variables:
				</p>
				<ul class="text-sm text-blue-800 space-y-1 ml-4 list-disc">
					<li><code class="bg-blue-100 px-2 py-0.5 rounded">SITE_NAME</code> - Name of the site</li>
					<li><code class="bg-blue-100 px-2 py-0.5 rounded">ADMIN_EMAIL</code> - Administrator contact email</li>
					<li><code class="bg-blue-100 px-2 py-0.5 rounded">PROGRAM_ADMIN_PASSWORD</code> - Password for program admin login</li>
				</ul>
			</div>
		</div>
	</div>
</div>
