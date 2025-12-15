<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<Footer />
</div>

<!-- Scroll to top button -->
<button
	class="scroll-top"
	onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
	aria-label="Scroll to top"
>
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<polyline points="18 15 12 9 6 15"></polyline>
	</svg>
</button>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
	}

	.scroll-top {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 48px;
		height: 48px;
		background-color: var(--color-primary);
		color: white;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		opacity: 0.9;
		transition: all 0.2s ease;
		z-index: 50;
	}

	.scroll-top:hover {
		opacity: 1;
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
	}
</style>
