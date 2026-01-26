<script lang="ts">
	import { page } from '$app/stores';

	let { children, data } = $props();

	const year = $derived(data.year);
	const isCurrent = $derived(data.isCurrent);
	const tabs = $derived([
		{ href: `/${year}/lectures`, label: 'Lectures' },
		{ href: `/${year}/workshops`, label: 'Workshops' }
	]);

	function isTabActive(tabHref: string): boolean {
		return $page.url.pathname === tabHref || $page.url.pathname.startsWith(tabHref + '/');
	}
</script>

{#if !isCurrent}
	<div class="year-tabs-container">
		<div class="container">
			<nav class="year-tabs" aria-label="Year program navigation">
				{#each tabs as tab}
					<a
						href={tab.href}
						class="year-tab"
						class:active={isTabActive(tab.href)}
					>
						{tab.label}
					</a>
				{/each}
			</nav>
		</div>
	</div>
{/if}

{@render children()}

<style>
	.year-tabs-container {
		background: var(--color-bg-alt);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.year-tabs {
		display: flex;
		gap: 0.75rem;
		padding: 1rem 0;
	}

	.year-tab {
		padding: 1rem 2rem;
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--color-text);
		border-radius: 0.5rem;
		transition: all 0.3s ease;
		text-decoration: none;
		position: relative;
		background: white;
		border: 2px solid var(--color-border);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.year-tab:hover {
		background: linear-gradient(135deg, rgba(122, 98, 148, 0.1) 0%, rgba(112, 186, 190, 0.1) 100%);
		color: var(--color-primary);
		border-color: var(--color-primary-light);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(93, 74, 120, 0.15);
	}

	.year-tab.active {
		background: linear-gradient(135deg, #7A6294 0%, #5d4a78 50%, #70BABE 100%);
		color: white;
		border-color: transparent;
		box-shadow: 0 4px 16px rgba(93, 74, 120, 0.3), 0 2px 8px rgba(112, 186, 190, 0.2);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		position: relative;
	}

	.year-tab.active::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			rgba(200, 83, 153, 0.15) 0%,
			rgba(112, 186, 190, 0.1) 50%,
			rgba(213, 217, 69, 0.08) 100%
		);
		border-radius: 0.5rem;
		pointer-events: none;
	}

	@media (max-width: 600px) {
		.year-tabs {
			justify-content: center;
		}

		.year-tab {
			padding: 0.625rem 1rem;
			font-size: 0.9rem;
		}
	}
</style>

