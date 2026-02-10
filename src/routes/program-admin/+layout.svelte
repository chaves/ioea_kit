<script lang="ts">
	import { page } from '$app/stores';

	let { children, data } = $props();

	// Don't show admin layout on login page
	const isLoginPage = $derived($page.url.pathname === '/program-admin/login');
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="flex min-h-screen">
		<aside class="w-[280px] min-w-[280px] bg-primary-dark text-white flex flex-col fixed top-0 left-0 bottom-0 shrink-0">
			<div class="p-6 border-b border-white/10 flex items-center gap-4">
				<a href="/" class="no-underline">
					<img src="/site-logo.png" alt="IOEA" class="h-10 brightness-0 invert" onerror={(e) => e.currentTarget.outerHTML = 'IOEA'} />
				</a>
				<span class="bg-secondary px-3 py-1 rounded-full text-xs font-semibold uppercase">Program</span>
			</div>

			<nav class="flex-1 py-6 overflow-y-auto">
				<a href="/program-admin" class="flex items-center gap-3 px-6 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/program-admin' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="3" width="7" height="7"></rect>
						<rect x="14" y="3" width="7" height="7"></rect>
						<rect x="14" y="14" width="7" height="7"></rect>
						<rect x="3" y="14" width="7" height="7"></rect>
					</svg>
					Dashboard
				</a>

				<div class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/50">
					Program Management
				</div>

				<a href="/program-admin/themes" class="flex items-center gap-3 px-6 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/program-admin/themes' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
					</svg>
					Themes
				</a>

				<a href="/program-admin/presentations" class="flex items-center gap-3 px-6 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/program-admin/presentations' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="2" y="3" width="20" height="14" rx="2"></rect>
						<line x1="8" y1="21" x2="16" y2="21"></line>
						<line x1="12" y1="17" x2="12" y2="21"></line>
					</svg>
					Presentations
				</a>

				<a href="/program-admin/authors" class="flex items-center gap-3 px-6 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/program-admin/authors' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
						<circle cx="9" cy="7" r="4"></circle>
						<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
						<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
					</svg>
					Authors
				</a>

				<a href="/program-admin/chairs" class="flex items-center gap-3 px-6 py-3.5 text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white {$page.url.pathname === '/program-admin/chairs' ? 'bg-white/15 text-white border-l-[3px] border-secondary' : ''}">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
						<circle cx="9" cy="7" r="4"></circle>
						<line x1="19" y1="8" x2="19" y2="14"></line>
						<line x1="22" y1="11" x2="16" y2="11"></line>
					</svg>
					Seminar Chairs
				</a>

		</nav>

			<div class="p-6 border-t border-white/10">
				<div class="mb-4">
					<span class="block font-semibold">{data.session?.name ?? 'Program Admin'}</span>
					<span class="text-sm opacity-70">Administrator</span>
				</div>
				<form method="POST" action="/program-admin/logout">
					<button type="submit" class="flex items-center gap-2 bg-white/10 border-none text-white px-4 py-2 rounded-md cursor-pointer text-sm transition-colors duration-200 hover:bg-white/20 w-full">
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

		<main class="flex-1 ml-[280px] bg-bg min-h-screen">
			{@render children()}
		</main>
	</div>
{/if}
