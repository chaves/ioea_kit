<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	interface Props {
		form?: {
			error?: string;
		};
	}

	let { form }: Props = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Student Login | IOEA</title>
</svelte:head>

<div class="login-page">
	<div class="login-container">
		<div class="login-header">
			<img src="/site-logo.png" alt="IOEA" class="login-logo" onerror={(e) => e.currentTarget.style.display = 'none'} />
			<h1>Participant Login</h1>
			<p>Access your IOEA student portal</p>
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
			class="login-form"
		>
			<div class="form-group">
				<label for="email" class="form-label">Email Address</label>
				<input
					type="email"
					id="email"
					name="email"
					class="form-input"
					required
					placeholder="Use the email from your application"
				/>
			</div>

			<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
				{#if loading}
					<span class="spinner-small"></span>
					Signing in...
				{:else}
					Sign In
				{/if}
			</button>
		</form>

		<div class="login-help">
			<p>
				Use the email address you used when applying to IOEA.
				If you have trouble logging in, please contact
				<a href="mailto:ioea.coordinator@gmail.com">ioea.coordinator@gmail.com</a>.
			</p>
		</div>

		<div class="login-footer">
			<a href="/">← Back to Website</a>
		</div>
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
		padding: 2rem;
	}

	.login-container {
		width: 100%;
		max-width: 420px;
		background: white;
		border-radius: 0.75rem;
		padding: 2.5rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.login-logo {
		height: 50px;
		margin-bottom: 1.5rem;
	}

	.login-header h1 {
		font-size: 1.75rem;
		margin-bottom: 0.5rem;
	}

	.login-header p {
		color: var(--color-text-light);
		margin: 0;
	}

	.login-form {
		margin-bottom: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.btn-block {
		width: 100%;
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

	.login-help {
		background: var(--color-bg-alt);
		padding: 1rem;
		border-radius: 0.375rem;
		margin-bottom: 1.5rem;
	}

	.login-help p {
		font-size: 0.9rem;
		color: var(--color-text-light);
		margin: 0;
	}

	.login-help a {
		color: var(--color-secondary);
	}

	.login-footer {
		text-align: center;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.login-footer a {
		color: var(--color-text-light);
		font-size: 0.9rem;
	}
</style>

