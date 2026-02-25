<script lang="ts">
	import { page } from '$app/stores';

	let { children, data } = $props();

	// Don't show auth layout on standalone pages (login, forgot/reset/change password)
	const isStandalonePage = $derived(['/auth/login', '/auth/forgot-password', '/auth/reset-password', '/auth/change-password', '/auth/verify-email'].includes($page.url.pathname));

	const userRoleLabel = $derived(() => {
		const roles = data.session?.roles ?? [];
		if (roles.includes('admin')) return 'Admin';
		if (roles.includes('program-admin')) return 'Program Admin';
		if (roles.includes('student')) return 'Student';
		return 'User';
	});

	let mobileOpen = $state(false);

	// Close sidebar on route change
	$effect(() => {
		$page.url.pathname;
		mobileOpen = false;
	});
</script>

{#if isStandalonePage}
	{@render children()}
{:else}
	<div class="flex min-h-screen">
		<!-- Mobile top bar -->
		<div class="md:hidden fixed top-0 left-0 right-0 z-40 bg-primary-dark text-white flex items-center justify-between px-4 h-14 border-b border-white/10">
			<span class="font-semibold text-sm">IOEA — {userRoleLabel()}</span>
			<button
				type="button"
				class="p-2 rounded-md hover:bg-white/10 transition-colors"
				onclick={() => mobileOpen = !mobileOpen}
				aria-label="Toggle menu"
			>
				{#if mobileOpen}
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
				{/if}
			</button>
		</div>

		<!-- Backdrop (mobile) -->
		{#if mobileOpen}
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
			<div class="md:hidden fixed inset-0 z-40 bg-black/50" onclick={() => mobileOpen = false}></div>
		{/if}

		<aside class="w-[280px] min-w-[280px] bg-primary-dark text-white flex flex-col fixed top-0 left-0 bottom-0 shrink-0 z-50 transition-transform duration-300 {mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0">
			<div class="p-6 border-b border-white/10 flex items-center gap-4">
				<a href="/" class="no-underline">
					<img src="/site-logo.png" alt="IOEA" class="h-10 brightness-0 invert" onerror={(e) => e.currentTarget.outerHTML = 'IOEA'} />
				</a>
				<span class="bg-secondary px-3 py-1 rounded-full text-xs font-semibold uppercase">Auth</span>
			</div>

			<nav class="flex-1 pt-8 pb-6 overflow-visible">
				{#if data.session?.roles?.includes('admin')}
					<div class="px-6 pb-2 pt-1 text-xs uppercase tracking-wider text-white/40 font-semibold">Admin</div>
					<a href="/auth/manager/users" class="flex items-center gap-3 px-6 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/auth/manager/users' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
							<circle cx="9" cy="7" r="4"></circle>
							<line x1="19" y1="8" x2="19" y2="14"></line>
							<line x1="22" y1="11" x2="16" y2="11"></line>
						</svg>
						Users
					</a>
					<a href="/auth/manager/provision-students" class="flex items-center gap-3 px-6 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/auth/manager/provision-students' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
							<polyline points="16 11 18 13 22 9"></polyline>
						</svg>
						Provision Students
					</a>
				{/if}
				{#if data.session?.roles?.includes('admin') || data.session?.roles?.includes('program-admin')}
					<a href="/auth/submissions" class="flex items-center gap-3 px-6 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/auth/submissions' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">
							<path d="M9 11l3 3L22 4"></path>
							<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
						</svg>
						Submissions
					</a>
					<a href="/auth/students-validation" class="flex items-center gap-3 px-6 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/auth/students-validation' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">
							<path d="M9 11l3 3L22 4"></path>
							<circle cx="12" cy="7" r="4"></circle>
							<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path>
						</svg>
						Students Validation
					</a>
				{/if}
				{#if data.session?.roles?.includes('student') && !data.session?.roles?.includes('admin') && !data.session?.roles?.includes('program-admin')}
					<div class="px-6 pb-2 pt-1 text-xs uppercase tracking-wider text-white/40 font-semibold">Student</div>
					<a href="/auth/student" class="flex items-center gap-3 px-6 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/auth/student' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
						My Profile
					</a>
				{/if}
			</nav>

			<div class="p-6 border-t border-white/10">
				<div class="mb-3">
					<span class="block font-semibold">{data.session?.name ?? 'User'}</span>
					<span class="text-sm opacity-70 capitalize">{userRoleLabel()}</span>
				</div>
				<a href="/auth/profile" class="flex items-center gap-2 text-white/70 text-sm mb-3 no-underline transition-colors duration-200 hover:text-white {$page.url.pathname === '/auth/profile' ? 'text-white' : ''}">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</svg>
					My Profile
				</a>
				<form method="POST" action="/auth/logout">
					<button type="submit" class="flex items-center gap-2 bg-white/10 border-none text-white px-4 py-2 rounded-md cursor-pointer text-sm transition-colors duration-200 hover:bg-white/20">
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

		<main class="flex-1 md:ml-[280px] bg-bg min-h-screen pt-14 md:pt-0">
			{@render children()}
		</main>
	</div>
{/if}
