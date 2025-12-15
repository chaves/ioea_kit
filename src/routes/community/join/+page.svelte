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
			<h2 class="mb-4">Subscribe to Our Mailing List</h2>
			<p class="text-[1.05rem] leading-[1.7] mb-6">
				Join our mailing list to stay informed about upcoming IOEA sessions,
				application deadlines, and community news. We respect your privacy and
				will only send you relevant updates.
			</p>

			{#if form?.success}
				<div class="alert alert-success">
					<h3>Thank you for subscribing!</h3>
					<p>You have been successfully added to our mailing list. You will receive updates about upcoming IOEA sessions and community news.</p>
				</div>
			{:else}
				{#if form?.error}
					<div class="alert alert-error">
						{form.error}
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
					class="bg-white p-8 max-sm:p-6 rounded-lg border border-[var(--color-border)] max-w-[600px] mx-auto"
				>
					<div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
						<div class="mb-6">
							<label for="first_name" class="form-label">First Name</label>
							<input
								type="text"
								id="first_name"
								name="first_name"
								class="form-input"
								placeholder="Your first name"
							/>
						</div>
						<div class="mb-6">
							<label for="last_name" class="form-label">Last Name</label>
							<input
								type="text"
								id="last_name"
								name="last_name"
								class="form-input"
								placeholder="Your last name"
							/>
						</div>
					</div>

					<div class="mb-6">
						<label for="email" class="form-label">Email Address *</label>
						<input
							type="email"
							id="email"
							name="email"
							class="form-input"
							placeholder="your.email@example.com"
							required
						/>
					</div>

					<div class="mb-8">
						<label class="flex items-start gap-3 cursor-pointer text-sm text-[var(--color-text-light)]">
							<input type="checkbox" name="consent" required class="mt-1" />
							<span>I agree to receive emails from IOEA about upcoming sessions and community updates.</span>
						</label>
					</div>

					<button type="submit" class="btn btn-primary" disabled={loading}>
						{#if loading}
							<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
							Subscribing...
						{:else}
							Subscribe
						{/if}
					</button>
				</form>
			{/if}

			<div class="mt-8 p-6 bg-[var(--color-bg-alt)] rounded-lg">
				<h3 class="text-base mb-3">Privacy Note</h3>
				<p class="text-sm text-[var(--color-text-light)] m-0">
					Your email address will only be used to send you information about IOEA.
					We will not share your information with third parties. You can unsubscribe
					at any time by clicking the unsubscribe link in any of our emails.
				</p>
			</div>
		</article>
	</div>
</section>

