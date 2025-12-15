<script lang="ts">
	import { page } from '$app/stores';
	import { menus } from '$lib/config';

	let mobileMenuOpen = $state(false);
	let activeDropdown = $state<string | null>(null);

	function isActive(href: string, exact = false): boolean {
		const currentPath = $page.url.pathname;
		if (href === '/') {
			return currentPath === '/';
		}
		// Check if "Past editions" (/archives) should be active for year routes
		if (href === '/archives') {
			// Match /archives or /YYYY (4-digit year) or /photos/YYYY
			return currentPath === '/archives' ||
				   currentPath.startsWith('/archives/') ||
				   /^\/\d{4}(\/|$)/.test(currentPath) ||
				   /^\/photos\/\d{4}(\/|$)/.test(currentPath);
		}
		if (exact) {
			return currentPath === href;
		}
		return currentPath.startsWith(href);
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function toggleDropdown(menuKey: string) {
		activeDropdown = activeDropdown === menuKey ? null : menuKey;
	}

	function getSubmenuForItem(href: string) {
		if (href.startsWith('/community')) {
			return menus.community;
		}
		if (href.startsWith('/project')) {
			return menus.project;
		}
		// Check if it's a year route (starts with /YYYY)
		if (href.match(/^\/\d{4}$/)) {
			return menus.ioea2025;
		}
		return null;
	}

	function hasSubmenu(href: string): boolean {
		return getSubmenuForItem(href) !== null;
	}
</script>

<header class="header">
	<div class="header-top">
		<div class="container">
			<div class="header-inner">
				<!-- Logo -->
				<a href="/" class="logo" title="Home Page">
					<img src="/site-logo.png" alt="IOEA Logo" class="logo-img" />
				</a>

				<!-- Mobile menu button -->
				<button
					class="mobile-menu-btn"
					onclick={toggleMobileMenu}
					aria-label="Toggle menu"
				>
					<span class="hamburger" class:open={mobileMenuOpen}>
						<span></span>
						<span></span>
						<span></span>
					</span>
				</button>

				<!-- Desktop Navigation -->
				<nav class="main-nav hidden-mobile">
					<ul class="nav-list">
						{#each menus.main as item}
							<li
								class="nav-item"
								class:has-dropdown={hasSubmenu(item.href)}
								onmouseenter={() => hasSubmenu(item.href) && (activeDropdown = item.href)}
								onmouseleave={() => hasSubmenu(item.href) && (activeDropdown = null)}
							>
								<a
									href={item.href}
									class="nav-link"
									class:active={isActive(item.href)}
									title={item.title}
								>
									{item.label}
									{#if hasSubmenu(item.href)}
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon">
											<polyline points="6 9 12 15 18 9"></polyline>
										</svg>
									{/if}
								</a>
								{#if hasSubmenu(item.href) && activeDropdown === item.href}
									<ul class="dropdown-menu">
										{#each getSubmenuForItem(item.href) as subItem}
											<li>
												<a
													href={subItem.href}
													class="dropdown-link"
													class:active={isActive(subItem.href, true)}
													title={subItem.title}
												>
													{subItem.label}
												</a>
											</li>
										{/each}
									</ul>
								{/if}
							</li>
						{/each}
					</ul>
				</nav>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<nav class="mobile-nav hidden-desktop">
			<ul class="mobile-nav-list">
				{#each menus.main as item}
					<li class="mobile-nav-item" class:has-dropdown={hasSubmenu(item.href)}>
						<div class="mobile-nav-header">
							<a
								href={item.href}
								class="mobile-nav-link"
								class:active={isActive(item.href)}
								onclick={() => {
									if (!hasSubmenu(item.href)) {
										mobileMenuOpen = false;
									}
								}}
							>
								{item.label}
							</a>
							{#if hasSubmenu(item.href)}
								<button
									class="mobile-dropdown-toggle"
									onclick={() => toggleDropdown(item.href)}
									aria-label="Toggle submenu"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class:rotated={activeDropdown === item.href}>
										<polyline points="6 9 12 15 18 9"></polyline>
									</svg>
								</button>
							{/if}
						</div>
						{#if hasSubmenu(item.href) && activeDropdown === item.href}
							<ul class="mobile-submenu">
								{#each getSubmenuForItem(item.href) as subItem}
									<li>
										<a
											href={subItem.href}
											class="mobile-submenu-link"
											class:active={isActive(subItem.href, true)}
											onclick={() => (mobileMenuOpen = false)}
										>
											{subItem.label}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
	{/if}

	<div class="header-line"></div>
</header>

<style>
	.header {
		background: white;
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: 0 1px 3px rgba(61, 58, 66, 0.06);
	}

	.header-top {
		padding: 0.875rem 0;
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		display: block;
	}

	.logo-img {
		height: 90px;
		width: auto;
		max-width: none;
	}

	.main-nav {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}

	.nav-list {
		display: flex;
		gap: 0.125rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-item {
		position: relative;
	}

	.nav-item.has-dropdown {
		position: relative;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.625rem 0.875rem;
		font-weight: 500;
		font-size: 0.9375rem;
		color: var(--color-text);
		border-radius: 0.375rem;
		transition: all 0.2s ease;
	}

	.nav-link:hover {
		background-color: var(--color-primary-faded);
		color: var(--color-primary);
	}

	.nav-link.active {
		background-color: var(--color-primary);
		color: white;
	}

	.dropdown-icon {
		width: 14px;
		height: 14px;
		opacity: 0.6;
		transition: transform 0.2s ease, opacity 0.2s ease;
	}

	.nav-link:hover .dropdown-icon {
		opacity: 1;
	}

	.nav-item.has-dropdown:hover .dropdown-icon {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		background: white;
		border: 1px solid var(--color-border-light);
		border-radius: 0.5rem;
		box-shadow: 0 8px 24px rgba(61, 58, 66, 0.12), 0 2px 6px rgba(61, 58, 66, 0.06);
		min-width: 200px;
		max-width: 260px;
		padding: 0.375rem;
		padding-top: 0.625rem;
		list-style: none;
		z-index: 1000;
		white-space: nowrap;
	}

	/* Bridge the gap between nav-link and dropdown to prevent closing */
	.dropdown-menu::before {
		content: '';
		position: absolute;
		top: -0.5rem;
		left: 0;
		right: 0;
		height: 0.5rem;
	}

	/* Adjust dropdown position for rightmost items to prevent overflow */
	.nav-item:last-child .dropdown-menu,
	.nav-item:nth-last-child(2) .dropdown-menu {
		left: auto;
		right: 0;
	}

	.dropdown-link {
		display: block;
		padding: 0.625rem 0.875rem;
		color: var(--color-text);
		font-size: 0.875rem;
		border-radius: 0.375rem;
		transition: all 0.15s ease;
	}

	.dropdown-link:hover {
		background-color: var(--color-primary-faded);
		color: var(--color-primary);
	}

	.dropdown-link.active {
		background-color: var(--color-primary);
		color: white;
	}

	/* Colorful header line using logo colors */
	.header-line {
		height: 9px;
		background: linear-gradient(
			90deg,
			#C85399 0%,
			#7A6294 25%,
			#70BABE 50%,
			#4FB161 75%,
			#D5D945 100%
		);
	}

	/* Mobile menu button */
	.mobile-menu-btn {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
	}

	.hamburger {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 24px;
	}

	.hamburger span {
		display: block;
		height: 2px;
		background-color: var(--color-primary);
		transition: all 0.3s ease;
	}

	.hamburger.open span:nth-child(1) {
		transform: rotate(45deg) translate(5px, 5px);
	}

	.hamburger.open span:nth-child(2) {
		opacity: 0;
	}

	.hamburger.open span:nth-child(3) {
		transform: rotate(-45deg) translate(5px, -5px);
	}

	/* Mobile Navigation */
	.mobile-nav {
		background: white;
		border-top: 1px solid var(--color-border-light);
		padding: 0.75rem;
	}

	.mobile-nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.mobile-nav-item {
		border-bottom: 1px solid var(--color-border-light);
	}

	.mobile-nav-item:last-child {
		border-bottom: none;
	}

	.mobile-nav-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.mobile-nav-link {
		flex: 1;
		display: block;
		padding: 0.875rem 1rem;
		color: var(--color-text);
		font-weight: 500;
		border-radius: 0.375rem;
	}

	.mobile-nav-link:hover {
		background-color: var(--color-primary-faded);
		color: var(--color-primary);
	}

	.mobile-nav-link.active {
		background-color: var(--color-primary);
		color: white;
	}

	.mobile-dropdown-toggle {
		background: none;
		border: none;
		padding: 0.875rem 1rem;
		cursor: pointer;
		color: var(--color-text-light);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
	}

	.mobile-dropdown-toggle:hover {
		background-color: var(--color-primary-faded);
		color: var(--color-primary);
	}

	.mobile-dropdown-toggle svg {
		transition: transform 0.2s ease;
	}

	.mobile-dropdown-toggle svg.rotated {
		transform: rotate(180deg);
	}

	.mobile-submenu {
		list-style: none;
		margin: 0;
		padding: 0;
		background: var(--color-bg-alt);
		border-radius: 0.375rem;
		margin: 0.25rem 0;
		overflow: hidden;
	}

	.mobile-submenu li {
		border-bottom: 1px solid var(--color-border-light);
	}

	.mobile-submenu li:last-child {
		border-bottom: none;
	}

	.mobile-submenu-link {
		display: block;
		padding: 0.75rem 1rem 0.75rem 2rem;
		color: var(--color-text-light);
		font-size: 0.9rem;
		font-weight: 400;
		transition: all 0.15s ease;
	}

	.mobile-submenu-link:hover {
		background-color: var(--color-secondary-light);
		color: white;
	}

	.mobile-submenu-link.active {
		background-color: var(--color-primary);
		color: white;
	}

	@media (max-width: 767px) {
		.mobile-menu-btn {
			display: block;
		}

		.hidden-mobile {
			display: none !important;
		}
	}

	@media (min-width: 768px) {
		.hidden-desktop {
			display: none !important;
		}
	}
</style>

