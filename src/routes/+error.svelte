<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/components/PageHeader.svelte';

	// Check if error is from browser extension
	const isExtensionError = $page.error?.message?.includes('browser extension') ?? false;
</script>

<svelte:head>
	<title>Error | IOEA</title>
</svelte:head>

{#if !isExtensionError}
	<PageHeader title="Something went wrong" />

	<section class="section-space">
		<div class="container">
			<div class="max-w-2xl mx-auto text-center">
				<div class="mb-8">
					<svg
						class="w-24 h-24 mx-auto text-red-500 mb-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						></path>
					</svg>
				</div>

				<h1 class="text-3xl font-bold mb-4 text-text">Oops! Something went wrong</h1>

				{#if $page.status === 404}
					<p class="text-lg text-text-light mb-8">
						The page you're looking for doesn't exist or has been moved.
					</p>
				{:else if $page.status === 500}
					<p class="text-lg text-text-light mb-8">
						We're experiencing technical difficulties. Please try again later.
					</p>
				{:else}
					<p class="text-lg text-text-light mb-8">
						{$page.error?.message ?? 'An unexpected error occurred'}
					</p>
				{/if}

				{#if import.meta.env.DEV && $page.error}
					<div class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
						<p class="text-sm font-semibold text-red-800 mb-2">Development Error Details:</p>
						<pre
							class="text-xs text-red-700 whitespace-pre-wrap overflow-x-auto">{JSON.stringify($page.error, null, 2)}</pre>
					</div>
				{/if}

				<div class="flex gap-4 justify-center mt-8">
					<a href="/" class="btn btn-primary"> Go to Homepage </a>
					<button onclick={() => window.location.reload()} class="btn btn-secondary">
						Try Again
					</button>
				</div>

				<p class="text-sm text-text-light mt-8">
					If this problem persists, please contact us at
					<a href="mailto:ioea.coordinator@gmail.com" class="text-primary hover:underline">
						ioea.coordinator@gmail.com
					</a>
				</p>
			</div>
		</div>
	</section>
{/if}
