<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { testimonials } from '$lib/data/testimonials';
</script>

<svelte:head>
	<title>Testimonials | IOEA Community</title>
	<meta name="description" content="Testimonials from IOEA alumni and faculty members." />
</svelte:head>

<PageHeader title="Testimonials" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">

				<div class="testimonials-list">
					{#each testimonials as testimonial}
						<div class="testimonial-card">
							<div class="testimonial-photo">
								<img
									src={testimonial.photo}
									alt={testimonial.name}
									onerror={(e) => {
										const img = e.currentTarget as HTMLImageElement;
										img.src = '/images/placeholder-person.jpg';
									}}
								/>
							</div>
							<div class="testimonial-content">
								<blockquote>
									"{testimonial.quote}"
								</blockquote>
								<div class="testimonial-author">
									<strong>
										{#if testimonial.website}
											<a href={testimonial.website} target="_blank" rel="noopener">
												{testimonial.name}
											</a>
										{:else}
											{testimonial.name}
										{/if}
									</strong>
									<span class="position">{testimonial.position}</span>
									<span class="institution">{testimonial.institution}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<aside class="sidebar">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

<style>
	.main-grid {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 3rem;
	}

	.testimonials-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.testimonial-card {
		display: flex;
		gap: 1.5rem;
		background: white;
		padding: 2rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
	}

	.testimonial-photo {
		flex-shrink: 0;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
	}

	.testimonial-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.testimonial-content {
		flex: 1;
	}

	blockquote {
		font-style: italic;
		color: var(--color-text);
		line-height: 1.7;
		margin: 0 0 1rem 0;
		padding: 0;
	}

	.testimonial-author {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.testimonial-author strong {
		color: var(--color-primary);
	}

	.testimonial-author a {
		color: var(--color-primary);
	}

	.testimonial-author a:hover {
		color: var(--color-secondary);
	}

	.position {
		font-size: 0.9rem;
		color: var(--color-text-light);
	}

	.institution {
		font-size: 0.85rem;
		color: var(--color-text-light);
	}

	.sidebar {
		position: sticky;
		top: 100px;
		align-self: start;
	}

	@media (max-width: 1024px) {
		.main-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
		}
	}

	@media (max-width: 600px) {
		.testimonial-card {
			flex-direction: column;
			text-align: center;
		}

		.testimonial-photo {
			margin: 0 auto;
		}
	}
</style>

