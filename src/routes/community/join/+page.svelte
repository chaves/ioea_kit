<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';

	interface Props {
		form?: {
			success?: boolean;
			error?: string;
		};
	}

	let { form }: Props = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Join the Community | IOEA</title>
	<meta name="description" content="Subscribe to the IOEA mailing list to receive updates about upcoming sessions and community news." />
</svelte:head>

<PageHeader title="Join the Community" />

<section class="section-space">
	<div class="container">
		<article class="max-w-3xl mx-auto">
			<h2 class="mb-6 text-primary text-2xl font-bold">Subscribe to Our Mailing List</h2>
			<p class="text-lg sm:text-xl font-medium text-text mb-10 leading-relaxed">
				Join our mailing list to stay informed about upcoming IOEA sessions,
				application deadlines, and community news. We respect your privacy and
				will only send you relevant updates.
			</p>

			{#if form?.success}
				<div class="p-10 bg-green-50 border border-green-200 rounded-2xl text-center shadow-lg">
					<div class="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
					</div>
					<h3 class="text-green-900 text-2xl font-bold mb-4">Thank you for subscribing!</h3>
					<p class="text-green-800 text-lg leading-relaxed">You have been successfully added to our mailing list. You will receive updates about upcoming IOEA sessions and community news.</p>
				</div>
			{:else}
				{#if form?.error}
					<div class="mb-8 p-6 bg-red-50 border-l-8 border-red-500 rounded-r-xl text-red-800 font-bold shadow-md">
						<div class="flex items-center gap-4">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
							{form.error}
						</div>
					</div>
				{/if}

				<form
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							await update();
						};
					}}
					class="bg-white p-10 max-sm:p-8 rounded-2xl border border-border shadow-xl max-w-[640px] mx-auto"
				>
					<div class="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
						<div class="mb-6">
							<label for="first_name" class="block text-sm font-bold uppercase tracking-wider text-text-light mb-2">First Name</label>
							<input
								type="text"
								id="first_name"
								name="first_name"
								class="w-full px-4 py-3 bg-bg-alt border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-base font-medium"
								placeholder="Your first name"
							/>
						</div>
						<div class="mb-6">
							<label for="last_name" class="block text-sm font-bold uppercase tracking-wider text-text-light mb-2">Last Name</label>
							<input
								type="text"
								id="last_name"
								name="last_name"
								class="w-full px-4 py-3 bg-bg-alt border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-base font-medium"
								placeholder="Your last name"
							/>
						</div>
					</div>

					<div class="mb-8">
						<label for="email" class="block text-sm font-bold uppercase tracking-wider text-text-light mb-2">Email Address *</label>
						<input
							type="email"
							id="email"
							name="email"
							class="w-full px-4 py-3 bg-bg-alt border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-base font-medium"
							placeholder="your.email@example.com"
							required
						/>
					</div>

					<div class="mb-10">
						<label class="flex items-start gap-4 cursor-pointer group">
							<input type="checkbox" name="consent" required class="mt-1.5 w-5 h-5 accent-primary cursor-pointer" />
							<span class="text-base text-text-light leading-relaxed group-hover:text-text transition-colors">I agree to receive emails from IOEA about upcoming sessions and community updates.</span>
						</label>
					</div>

					<button type="submit" class="w-full py-5 bg-primary text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" disabled={loading}>
						{#if loading}
							<span class="inline-block w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
							Subscribing...
						{:else}
							Subscribe Now
						{/if}
					</button>
				</form>
			{/if}

			<div class="mt-12 p-8 bg-bg-alt rounded-2xl border border-border shadow-inner">
				<h3 class="text-lg font-bold text-primary mb-4 flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
					Privacy Note
				</h3>
				<p class="text-base text-text-light leading-relaxed m-0">
					Your email address will only be used to send you information about IOEA.
					We will not share your information with third parties. You can unsubscribe
					at any time by clicking the unsubscribe link in any of our emails.
				</p>
			</div>
		</article>
	</div>
</section>

