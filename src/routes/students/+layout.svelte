<script lang="ts">
	import { page } from '$app/stores';
	import { config } from '$lib/config';

	let { children, data } = $props();

	const isLoginPage = $derived($page.url.pathname === '/students/login');
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="students-layout">
		<header class="students-header">
			<div class="container">
				<div class="header-inner">
					<a href="/" class="logo">
						<img src="/site-logo.png" alt="IOEA" onerror={(e) => e.currentTarget.outerHTML = 'IOEA'} />
					</a>
					<nav class="header-nav">
						<a href="/students" class:active={$page.url.pathname === '/students'}>Dashboard</a>
						<a href="/students/survey" class:active={$page.url.pathname === '/students/survey'}>Survey</a>
						<a href="/ioea/{config.currentYear}/students">All Participants</a>
					</nav>
					<div class="user-section">
						<span class="user-name">{data.session?.name ?? 'Student'}</span>
						<form method="POST" action="/students/logout">
							<button type="submit" class="logout-btn">Logout</button>
						</form>
					</div>
				</div>
			</div>
		</header>

		<main class="students-main">
			{@render children()}
		</main>

		<footer class="students-footer">
			<div class="container">
				<p>IOEA {config.currentYear} - Institutional and Organizational Economics Academy</p>
			</div>
		</footer>
	</div>
{/if}

<style>
	.students-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--color-bg);
	}

	.students-header {
		background: var(--color-primary);
		color: white;
		padding: 1rem 0;
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	.logo img {
		height: 40px;
		filter: brightness(0) invert(1);
	}

	.header-nav {
		display: flex;
		gap: 0.5rem;
	}

	.header-nav a {
		padding: 0.5rem 1rem;
		color: rgba(255, 255, 255, 0.8);
		border-radius: 0.375rem;
		transition: all 0.2s ease;
	}

	.header-nav a:hover,
	.header-nav a.active {
		background: rgba(255, 255, 255, 0.15);
		color: white;
	}

	.user-section {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-name {
		font-weight: 500;
	}

	.logout-btn {
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.15);
		border: none;
		color: white;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.logout-btn:hover {
		background: rgba(255, 255, 255, 0.25);
	}

	.students-main {
		flex: 1;
		padding: 2rem 0;
	}

	.students-footer {
		background: var(--color-primary-dark);
		color: rgba(255, 255, 255, 0.7);
		padding: 1rem 0;
		text-align: center;
		font-size: 0.9rem;
	}

	.students-footer p {
		margin: 0;
	}

	@media (max-width: 767px) {
		.header-inner {
			flex-wrap: wrap;
		}

		.header-nav {
			order: 3;
			width: 100%;
			justify-content: center;
			margin-top: 1rem;
		}
	}
</style>

