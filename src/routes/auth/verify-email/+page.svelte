<script lang="ts">
	interface Props {
		data: {
			success?: boolean;
			newEmail?: string;
			error?: string;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Verify Email | IOEA</title>
</svelte:head>

<div class="login-page">
	<div class="login-container">
		<div class="login-header">
			{#if data.success}
				<div class="icon-success">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
						<polyline points="22 4 12 14.01 9 11.01"></polyline>
					</svg>
				</div>
				<h1>Email Verified</h1>
				<p>Your email has been changed to <strong>{data.newEmail}</strong>.</p>
			{:else}
				<div class="icon-error">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"></circle>
						<line x1="15" y1="9" x2="9" y2="15"></line>
						<line x1="9" y1="9" x2="15" y2="15"></line>
					</svg>
				</div>
				<h1>Verification Failed</h1>
				<p>{data.error}</p>
			{/if}
		</div>

		<div class="login-footer">
			<a href="/auth/profile">← Back to Profile</a>
		</div>
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
		padding: 8vh 2rem 2rem;
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

	.login-header h1 {
		font-size: 1.75rem;
		margin-bottom: 0.5rem;
	}

	.login-header p {
		color: var(--color-text-light);
		margin: 0;
	}

	.icon-success {
		color: #16a34a;
		margin-bottom: 1rem;
	}

	.icon-error {
		color: #dc2626;
		margin-bottom: 1rem;
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
</style>
