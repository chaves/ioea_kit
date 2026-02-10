<script lang="ts">
	import { page } from '$app/stores';

	let { children, data } = $props();

	// Don't show auth layout on standalone pages (login, forgot/reset/change password)
	const isStandalonePage = $derived(['/auth/login', '/auth/forgot-password', '/auth/reset-password', '/auth/change-password'].includes($page.url.pathname));

	const userRoleLabel = $derived(() => {
		const roles = data.session?.roles ?? [];
		if (roles.includes('admin')) return 'Admin';
		if (roles.includes('program-admin')) return 'Program Admin';
		if (roles.includes('student')) return 'Student';
		return 'User';
	});
</script>

{#if isStandalonePage}
	{@render children()}
{:else}
	<div class="flex min-h-screen">
		<aside class="w-[300px] min-w-[300px] bg-primary-dark text-white flex flex-col fixed top-0 left-0 bottom-0 shrink-0">
			<div class="p-6 border-b border-white/10 flex items-center gap-4">
				<a href="/" class="no-underline">
					<img src="/site-logo.png" alt="IOEA" class="h-10 brightness-0 invert" onerror={(e) => e.currentTarget.outerHTML = 'IOEA'} />
				</a>
				<span class="bg-secondary px-3 py-1 rounded-full text-xs font-semibold uppercase">Auth</span>
			</div>

			<nav class="flex-1 py-6">
				{#if data.session?.roles?.includes('admin')}
					<div class="px-6 pb-2 pt-1 text-xs uppercase tracking-wider text-white/40 font-semibold">Admin</div>
					<a href="/auth/manager/users" class="flex items-center gap-3 pl-6 pr-8 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/auth/manager/users' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
							<circle cx="9" cy="7" r="4"></circle>
							<line x1="19" y1="8" x2="19" y2="14"></line>
							<line x1="22" y1="11" x2="16" y2="11"></line>
						</svg>
						Users
					</a>
				{/if}
				{#if data.session?.roles?.includes('admin') || data.session?.roles?.includes('program-admin')}
					<a href="/auth/submissions" class="flex items-center gap-3 pl-6 pr-8 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/auth/submissions' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">
							<path d="M9 11l3 3L22 4"></path>
							<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
						</svg>
						Submissions
					</a>
				{/if}
				{#if data.session?.roles?.includes('admin') || data.session?.roles?.includes('student')}
					<div class="px-6 pb-2 pt-1 text-xs uppercase tracking-wider text-white/40 font-semibold">Student</div>
					<a href="/auth/student" class="flex items-center gap-3 pl-6 pr-8 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/auth/student' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
						My Profile
					</a>
				{/if}
			</nav>

			<div class="p-6 border-t border-white/10">
				<div class="mb-4">
					<span class="block font-semibold">{data.session?.name ?? 'User'}</span>
					<span class="text-sm opacity-70 capitalize">{userRoleLabel()}</span>
				</div>
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

		<main class="flex-1 ml-[300px] bg-bg min-h-screen">
			{@render children()}
		</main>
	</div>
{/if}
