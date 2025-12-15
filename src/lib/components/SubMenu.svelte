<script lang="ts">
	import { page } from '$app/stores';

	interface MenuItem {
		href: string;
		label: string;
		title: string;
	}

	interface Props {
		items: MenuItem[];
	}

	let { items }: Props = $props();

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}
</script>

<nav class="submenu">
	{#each items as item}
		<a href={item.href} class:active={isActive(item.href)} title={item.title}>
			{item.label}
		</a>
	{/each}
</nav>

<style>
	.submenu {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 1rem 0;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	a {
		padding: 0.5rem 1rem;
		background-color: var(--color-bg-alt);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text);
		transition: all 0.2s ease;
	}

	a:hover,
	a.active {
		background-color: var(--color-primary);
		color: white;
	}
</style>

