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

<header class="bg-white sticky top-0 z-[100] shadow-[0_1px_3px_rgba(61,58,66,0.06)]">
	<div class="py-3.5">
		<div class="container">
			<div class="flex items-center justify-between">
				<!-- Logo -->
				<a href="/" class="block" title="Home Page">
					<img src="/site-logo.png" alt="IOEA Logo" class="h-[90px] w-auto max-w-none" />
				</a>

				<!-- Mobile menu button -->
				<button
					class="block md:hidden bg-transparent border-0 cursor-pointer p-2"
					onclick={toggleMobileMenu}
					aria-label="Toggle menu"
				>
					<span class="flex flex-col gap-[5px] w-6" class:open={mobileMenuOpen}>
						<span class="block h-0.5 bg-primary transition-all duration-300 {mobileMenuOpen ? 'rotate-45 translate-x-[5px] translate-y-[5px]' : ''}"></span>
						<span class="block h-0.5 bg-primary transition-all duration-300 {mobileMenuOpen ? 'opacity-0' : ''}"></span>
						<span class="block h-0.5 bg-primary transition-all duration-300 {mobileMenuOpen ? '-rotate-45 translate-x-[5px] -translate-y-[5px]' : ''}"></span>
					</span>
				</button>

				<!-- Desktop Navigation -->
				<nav class="flex-1 flex justify-end hidden md:flex">
					<ul class="flex gap-0.5 list-none m-0 p-0">
						{#each menus.main as item}
							<li
								class="relative"
								onmouseenter={() => hasSubmenu(item.href) && (activeDropdown = item.href)}
								onmouseleave={() => hasSubmenu(item.href) && (activeDropdown = null)}
							>
								<a
									href={item.href}
									class="flex items-center gap-1.5 px-3.5 py-2.5 font-medium text-[0.9375rem] text-text rounded-md transition-all duration-200 no-underline {isActive(item.href) ? 'bg-primary text-white' : 'hover:bg-primary-faded hover:text-primary'}"
									title={item.title}
								>
									{item.label}
									{#if hasSubmenu(item.href)}
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 opacity-60 transition-all duration-200 hover:opacity-100 {activeDropdown === item.href ? 'rotate-180' : ''}">
											<polyline points="6 9 12 15 18 9"></polyline>
										</svg>
									{/if}
								</a>
								{#if hasSubmenu(item.href) && activeDropdown === item.href}
									<ul class="absolute top-full left-0 bg-white border border-border-light rounded-lg shadow-[0_8px_24px_rgba(61,58,66,0.12),0_2px_6px_rgba(61,58,66,0.06)] min-w-[200px] max-w-[260px] p-1.5 pt-2.5 list-none z-[1000] whitespace-nowrap before:content-[''] before:absolute before:top-[-0.5rem] before:left-0 before:right-0 before:h-2 {item === menus.main[menus.main.length - 1] || item === menus.main[menus.main.length - 2] ? 'left-auto right-0' : ''}">
										{#each getSubmenuForItem(item.href) as subItem}
											<li>
												<a
													href={subItem.href}
													class="block px-3.5 py-2.5 text-text text-sm rounded-md transition-all duration-150 no-underline {isActive(subItem.href, true) ? 'bg-primary text-white' : 'hover:bg-primary-faded hover:text-primary'}"
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
		<nav class="bg-white border-t border-border-light p-3 md:hidden">
			<ul class="list-none m-0 p-0">
				{#each menus.main as item}
					<li class="border-b border-border-light last:border-b-0">
						<div class="flex items-center justify-between">
							<a
								href={item.href}
								class="flex-1 block px-4 py-3.5 text-text font-medium rounded-md no-underline {isActive(item.href) ? 'bg-primary text-white' : 'hover:bg-primary-faded hover:text-primary'}"
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
									class="bg-transparent border-0 px-4 py-3.5 cursor-pointer text-text-light flex items-center justify-center rounded-md transition-all duration-200 hover:bg-primary-faded hover:text-primary"
									onclick={() => toggleDropdown(item.href)}
									aria-label="Toggle submenu"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 {activeDropdown === item.href ? 'rotate-180' : ''}">
										<polyline points="6 9 12 15 18 9"></polyline>
									</svg>
								</button>
							{/if}
						</div>
						{#if hasSubmenu(item.href) && activeDropdown === item.href}
							<ul class="list-none m-0 p-0 bg-bg-alt rounded-md my-1 overflow-hidden">
								{#each getSubmenuForItem(item.href) as subItem}
									<li class="border-b border-border-light last:border-b-0">
										<a
											href={subItem.href}
											class="block px-4 py-3 pl-8 text-text-light text-sm font-normal transition-all duration-150 no-underline {isActive(subItem.href, true) ? 'bg-primary text-white' : 'hover:bg-secondary-light hover:text-white'}"
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

	<div class="h-[9px] bg-gradient-to-r from-[#C85399] via-[#7A6294] via-[#70BABE] via-[#4FB161] to-[#D5D945]"></div>
</header>


