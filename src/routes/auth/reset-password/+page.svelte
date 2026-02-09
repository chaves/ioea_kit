<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	interface Props {
		data: {
			valid: boolean;
			token?: string;
			error?: string;
		};
		form?: {
			error?: string;
			token?: string;
		};
	}

	let { data, form }: Props = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Reset Password | IOEA</title>
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
				<h1>Reset Password</h1>
				<p>Enter your new password</p>
			</div>

		{#if !data.valid && !form?.token}
			<div class="alert alert-error">
				{data.error}
			</div>
			<div class="login-footer">
				<a href="/auth/forgot-password">Request a new reset link</a>
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
				<input type="hidden" name="token" value={form?.token ?? data.token} />

				<div class="form-group">
					<label for="password" class="form-label">New Password</label>
					<input
						type="password"
						id="password"
						name="password"
						class="form-input"
						required
						minlength="8"
						placeholder="Minimum 8 characters"
					/>
				</div>

				<div class="form-group">
					<label for="confirmPassword" class="form-label">Confirm Password</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						class="form-input"
						required
						minlength="8"
					/>
				</div>

				<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
					{#if loading}
						<span class="spinner-small"></span>
						Resetting...
					{:else}
						Reset Password
					{/if}
				</button>
			</form>

			<div class="login-footer">
				<a href="/auth/login">← Back to Login</a>
			</div>
		{/if}
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
