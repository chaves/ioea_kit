<script lang="ts">
	interface Props {
		data: {
			stats: {
				themesCount: number;
				authorsCount: number;
				chairsCount: number;
				lecturesCount: number;
				workshopsCount: number;
				presentationsCount: number;
			};
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Program Administration Dashboard | IOEA</title>
</svelte:head>

<div class="p-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">Program Administration</h1>
		<p class="text-text-light">Manage the IOEA school program, lectures, workshops, and seminars</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
		<div class="bg-white rounded-lg border border-border p-6 shadow-sm">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-semibold uppercase tracking-wide text-text-light">Total Themes</h3>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
					<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
					<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
				</svg>
			</div>
			<p class="text-4xl font-bold text-primary">{data.stats.themesCount}</p>
		</div>

		<div class="bg-white rounded-lg border border-border p-6 shadow-sm">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-semibold uppercase tracking-wide text-text-light">Lectures</h3>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-secondary">
					<rect x="2" y="3" width="20" height="14" rx="2"></rect>
					<line x1="8" y1="21" x2="16" y2="21"></line>
					<line x1="12" y1="17" x2="12" y2="21"></line>
				</svg>
			</div>
			<p class="text-4xl font-bold text-secondary">{data.stats.lecturesCount}</p>
		</div>

		<div class="bg-white rounded-lg border border-border p-6 shadow-sm">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-semibold uppercase tracking-wide text-text-light">Workshops</h3>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-secondary">
					<rect x="2" y="3" width="20" height="14" rx="2"></rect>
					<line x1="8" y1="21" x2="16" y2="21"></line>
					<line x1="12" y1="17" x2="12" y2="21"></line>
				</svg>
			</div>
			<p class="text-4xl font-bold text-secondary">{data.stats.workshopsCount}</p>
		</div>

		<div class="bg-white rounded-lg border border-border p-6 shadow-sm">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-semibold uppercase tracking-wide text-text-light">Presentations</h3>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
					<rect x="2" y="7" width="20" height="14" rx="2"></rect>
					<path d="M16 3h5v5"></path>
					<path d="M21 3L12 12"></path>
				</svg>
			</div>
			<p class="text-4xl font-bold text-primary">{data.stats.presentationsCount}</p>
		</div>

		<div class="bg-white rounded-lg border border-border p-6 shadow-sm">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-semibold uppercase tracking-wide text-text-light">Authors</h3>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
					<circle cx="9" cy="7" r="4"></circle>
					<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
					<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
				</svg>
			</div>
			<p class="text-4xl font-bold text-primary">{data.stats.authorsCount}</p>
		</div>

		<div class="bg-white rounded-lg border border-border p-6 shadow-sm">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-semibold uppercase tracking-wide text-text-light">Seminar Chairs</h3>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
					<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
					<circle cx="9" cy="7" r="4"></circle>
					<line x1="19" y1="8" x2="19" y2="14"></line>
					<line x1="22" y1="11" x2="16" y2="11"></line>
				</svg>
			</div>
			<p class="text-4xl font-bold text-primary">{data.stats.chairsCount}</p>
		</div>
	</div>

	<div class="bg-white rounded-lg border border-border p-6 shadow-sm">
		<h2 class="text-xl font-bold mb-4">Quick Actions</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<a href="/program-admin/themes" class="flex items-center gap-3 p-4 border border-border rounded-lg transition-colors duration-200 hover:bg-bg hover:border-primary no-underline">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
					<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
					<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
				</svg>
				<div>
					<div class="font-semibold text-text">Manage Themes</div>
					<div class="text-sm text-text-light">Add or edit lecture/workshop themes</div>
				</div>
			</a>

			<a href="/program-admin/presentations" class="flex items-center gap-3 p-4 border border-border rounded-lg transition-colors duration-200 hover:bg-bg hover:border-primary no-underline">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
					<rect x="2" y="3" width="20" height="14" rx="2"></rect>
					<line x1="8" y1="21" x2="16" y2="21"></line>
					<line x1="12" y1="17" x2="12" y2="21"></line>
				</svg>
				<div>
					<div class="font-semibold text-text">Manage Presentations</div>
					<div class="text-sm text-text-light">Add or edit presentations</div>
				</div>
			</a>

			<a href="/program-admin/authors" class="flex items-center gap-3 p-4 border border-border rounded-lg transition-colors duration-200 hover:bg-bg hover:border-primary no-underline">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
					<circle cx="9" cy="7" r="4"></circle>
					<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
					<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
				</svg>
				<div>
					<div class="font-semibold text-text">Manage Authors</div>
					<div class="text-sm text-text-light">Add or edit author profiles</div>
				</div>
			</a>

			<a href="/program-admin/config" class="flex items-center gap-3 p-4 border border-border rounded-lg transition-colors duration-200 hover:bg-bg hover:border-primary no-underline">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
					<circle cx="12" cy="12" r="3"></circle>
					<path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
				</svg>
				<div>
					<div class="font-semibold text-text">Site Configuration</div>
					<div class="text-sm text-text-light">Update site settings</div>
				</div>
			</a>
		</div>
	</div>
</div>
