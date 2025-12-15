<script lang="ts">
	import { page } from '$app/stores';

	let { children, data } = $props();

	// Don't show admin layout on login page
	const isLoginPage = $derived($page.url.pathname === '/admin/login');
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="admin-layout">
		<aside class="admin-sidebar">
			<div class="sidebar-header">
				<a href="/" class="logo">
					<img src="/site-logo.png" alt="IOEA" onerror={(e) => e.currentTarget.outerHTML = 'IOEA'} />
				</a>
				<span class="admin-badge">Admin</span>
			</div>

			<nav class="sidebar-nav">
				{#if data.session?.userType === 'admin'}
					<a href="/admin/manager" class="nav-item" class:active={$page.url.pathname === '/admin/manager'}>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
							<circle cx="9" cy="7" r="4"></circle>
							<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
							<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
						</svg>
						Applications
					</a>
				{/if}
				<a href="/admin/reviewer" class="nav-item" class:active={$page.url.pathname === '/admin/reviewer'}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
						<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
					</svg>
					Review
				</a>
			</nav>

			<div class="sidebar-footer">
				<div class="user-info">
					<span class="user-name">{data.session?.name ?? 'User'}</span>
					<span class="user-role">{data.session?.reviewerType ?? 'Reviewer'}</span>
				</div>
				<form method="POST" action="/admin/logout">
					<button type="submit" class="logout-btn">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
							<polyline points="16 17 21 12 16 7"></polyline>
							<line x1="21" y1="12" x2="9" y2="12"></line>
						</svg>
						Logout
					</button>
				</form>
			</div>
		</aside>

		<main class="admin-main">
			{@render children()}
		</main>
	</div>
{/if}

<style>
	.admin-layout {
		display: flex;
		min-height: 100vh;
	}

	.admin-sidebar {
		width: 260px;
		background: var(--color-primary-dark);
		color: white;
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
	}

	.sidebar-header {
		padding: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo img {
		height: 40px;
		filter: brightness(0) invert(1);
	}

	.admin-badge {
		background: var(--color-secondary);
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.sidebar-nav {
		flex: 1;
		padding: 1.5rem 0;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1.5rem;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.nav-item.active {
		background: rgba(255, 255, 255, 0.15);
		color: white;
		border-left: 3px solid var(--color-secondary);
	}

	.sidebar-footer {
		padding: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.user-info {
		margin-bottom: 1rem;
	}

	.user-name {
		display: block;
		font-weight: 600;
	}

	.user-role {
		font-size: 0.85rem;
		opacity: 0.7;
		text-transform: capitalize;
	}

	.logout-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background 0.2s ease;
	}

	.logout-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.admin-main {
		flex: 1;
		margin-left: 260px;
		background: var(--color-bg);
		min-height: 100vh;
	}
</style>

