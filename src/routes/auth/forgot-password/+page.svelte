<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		form?: {
			error?: string;
			success?: boolean;
			message?: string;
			email?: string;
		};
	}

	let { form }: Props = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Forgot Password | IOEA</title>
</svelte:head>

<div class="login-page">
		<div class="login-container">
			<div class="login-header">
				<img
					src="/site-logo.png"
					alt="IOEA"
					class="login-logo"
					onerror={(e) => {
						(e.currentTarget as HTMLImageElement).style.display = 'none';
					}}
				/>
				<h1>Forgot Password</h1>
				<p>Enter your email to receive a password reset link</p>
			</div>

		{#if form?.error}
			<div class="alert alert-error">
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="alert alert-success">
				{form.message}
			</div>
		{:else}
			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
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
						placeholder="your.email@example.com"
						value={form?.email ?? ''}
					/>
				</div>

				<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
					{#if loading}
						<span class="spinner-small"></span>
						Sending...
					{:else}
						Send Reset Link
					{/if}
				</button>
			</form>
		{/if}

		<div class="login-footer">
			<a href="/auth/login">← Back to Login</a>
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
		margin-bottom: 2rem;
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

	.login-footer {
		text-align: center;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.login-footer a {
		color: var(--color-text-light);
		font-size: 0.9rem;
	}

	.login-footer a:hover {
		color: var(--color-primary);
	}

	.alert-success {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #166534;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}

	.alert-error {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #991b1b;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}
</style>
