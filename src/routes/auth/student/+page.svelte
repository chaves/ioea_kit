<script lang="ts">
	interface Props {
		data: {
			session: {
				name: string;
				email: string;
				roles: string[];
			};
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Student Area | IOEA</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<h1>Welcome, {data.session.name}</h1>
	</header>

	<div class="info-card">
		<div class="info-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="16" x2="12" y2="12"></line>
				<line x1="12" y1="8" x2="12.01" y2="8"></line>
			</svg>
		</div>
		<h2>Your student area is being prepared</h2>
		<p>You will soon be able to update your details, paper, and travel information here.</p>
	</div>
</div>

<style>
	.admin-page {
		padding: 2rem;
	}

	.auth-header {
		margin-bottom: 2rem;
	}

	.auth-header h1 {
		margin: 0;
		font-size: 1.75rem;
	}

	.info-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 3rem;
		text-align: center;
		max-width: 500px;
	}

	.info-icon {
		color: var(--color-accent);
		margin-bottom: 1rem;
	}

	.info-card h2 {
		margin: 0 0 0.75rem;
		font-size: 1.25rem;
		color: var(--color-primary);
	}

	.info-card p {
		margin: 0;
		color: var(--color-text-light);
		line-height: 1.6;
	}
</style>
