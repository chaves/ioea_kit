<script lang="ts">
	interface Props {
		title: string;
		showSubscribe?: boolean;
	}

	let { title, showSubscribe = true }: Props = $props();
</script>

<section class="page-header">
	<div class="container">
		<div class="header-content">
			<h1>{title}</h1>
			{#if showSubscribe}
				<a href="/community/join" class="subscribe-link">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="4"></circle>
						<path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
					</svg>
					subscribe
				</a>
			{/if}
		</div>
	</div>
</section>

<style>
	.page-header {
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
		color: white;
		padding: 2rem 0;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		position: relative;
		z-index: 1;
	}

	h1 {
		color: white;
		margin: 0;
		font-size: 1.75rem;
	}

	.subscribe-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: rgba(255, 255, 255, 0.9);
		font-size: 1.1rem;
		transition: color 0.2s ease;
		position: relative;
		z-index: 2;
	}

	.subscribe-link:hover {
		color: white;
	}

	@media (max-width: 767px) {
		h1 {
			font-size: 1.5rem;
		}
	}
</style>

