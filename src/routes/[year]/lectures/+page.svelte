<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Lectures - IOEA {data.year}</title>
	<meta name="description" content="Lectures from the IOEA {data.year} session." />
</svelte:head>

<PageHeader title="Lectures - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				{#if data.themeGroups.length > 0}
					<div class="themes-list">
						{#each data.themeGroups as theme}
							<section class="theme-group">
								<header class="theme-header">
									<h2>{theme.name}</h2>
									{#if theme.dateFormatted}
										<p class="theme-date">{theme.dateFormatted}</p>
									{/if}
								</header>

								<div class="lectures-list">
									{#each theme.lectures as lecture}
										<a href="/{data.year}/presentation/{lecture.id}" class="lecture-card-link">
											<div class="lecture-card">
												<div class="lecture-author">
													{#if lecture.author.photo}
														<img
															src={`/images/lec/${lecture.author.photo}`}
															alt="{lecture.author.firstName} {lecture.author.lastName}"
															class="author-photo"
															onerror={(e) => {
																const img = e.currentTarget as HTMLImageElement;
																img.style.display = 'none';
															}}
														/>
													{/if}
													<div class="author-info">
														<h3>
															{lecture.author.firstName} {lecture.author.lastName}
														</h3>
														{#if lecture.author.institution}
															<p class="institution">{lecture.author.institution}</p>
														{/if}
													</div>
												</div>
												<div class="lecture-content">
													{#if lecture.title}
														<h4>{lecture.title}</h4>
													{/if}
													{#if lecture.abstract}
														<p class="abstract">{@html lecture.abstract}</p>
													{/if}
													{#if lecture.link}
														<button
															type="button"
															onclick={(e) => {
																e.stopPropagation();
																e.preventDefault();
																if (lecture.link) {
																	window.open(lecture.link, '_blank', 'noopener');
																}
															}}
															class="lecture-link"
														>
															View materials →
														</button>
													{/if}
												</div>
											</div>
										</a>
									{/each}
								</div>
							</section>
						{/each}
					</div>
				{:else}
					<div class="no-data">
						<p>Lecture information for IOEA {data.year} will be available soon.</p>
					</div>
				{/if}
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

	.theme-group {
		margin-bottom: 3rem;
		position: relative;
	}

	.theme-group:not(:last-child)::after {
		content: '';
		position: absolute;
		bottom: -1.5rem;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent,
			var(--color-border),
			transparent
		);
	}

	.theme-header {
		background: linear-gradient(135deg, #7A6294 0%, #5d4a78 50%, #70BABE 100%);
		color: white;
		padding: 1.5rem 2rem;
		border-radius: 0.875rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 6px 20px rgba(93, 74, 120, 0.25), 0 2px 8px rgba(112, 186, 190, 0.15);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		position: relative;
		overflow: hidden;
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.theme-header::before {
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
		pointer-events: none;
	}

	.theme-header::after {
		content: '';
		position: absolute;
		top: -50%;
		right: -10%;
		width: 200px;
		height: 200px;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
		border-radius: 50%;
		pointer-events: none;
	}

	.theme-header h2 {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 700;
		color: white;
		position: relative;
		z-index: 1;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		letter-spacing: 0.02em;
	}

	.theme-date {
		color: rgba(255, 255, 255, 0.95);
		font-weight: 600;
		font-size: 0.95rem;
		position: relative;
		z-index: 1;
		white-space: nowrap;
	}

	.themes-list {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.lectures-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.lecture-card-link {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.lecture-card {
		background: white;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		height: 100%;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.lecture-card-link:hover .lecture-card {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
		border-color: var(--color-primary);
	}

	.lecture-author {
		display: flex;
		gap: 1rem;
		padding: 1.25rem;
		background: linear-gradient(135deg, var(--color-bg-alt) 0%, rgba(255, 255, 255, 0.8) 100%);
		border-bottom: 1px solid var(--color-border);
		position: relative;
	}

	.lecture-author::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(
			to right,
			transparent,
			var(--color-primary),
			transparent
		);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.lecture-card:hover .lecture-author::after {
		opacity: 1;
	}

	.author-photo {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		object-fit: cover;
		border: 3px solid white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		flex-shrink: 0;
	}

	.lecture-card:hover .author-photo {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.author-info {
		flex: 1;
		min-width: 0;
	}

	.author-info h3 {
		margin-bottom: 0.25rem;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.institution {
		color: var(--color-text-light);
		font-size: 0.9rem;
		margin: 0;
		line-height: 1.4;
	}

	.lecture-content {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex: 1;
	}

	.lecture-content h4 {
		color: var(--color-primary);
		margin: 0;
		font-size: 1.05rem;
		font-weight: 600;
		line-height: 1.4;
	}

	.abstract {
		color: var(--color-text);
		line-height: 1.7;
		margin: 0;
		font-size: 0.95rem;
	}

	.lecture-link {
		background: none;
		border: none;
		padding: 0;
		color: var(--color-secondary);
		font-weight: 600;
		font-size: 0.9rem;
		margin-top: auto;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		transition: all 0.2s ease;
		text-decoration: none;
		cursor: pointer;
		font: inherit;
	}

	.lecture-link:hover {
		color: var(--color-secondary-dark);
		gap: 0.5rem;
	}

	.no-data {
		text-align: center;
		padding: 3rem;
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
		color: var(--color-text-light);
	}

	.sidebar {
		position: sticky;
		top: 100px;
		align-self: start;
	}

	@media (max-width: 768px) {
		.theme-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.theme-header h2 {
			font-size: 1.25rem;
		}

		.theme-date {
			font-size: 0.85rem;
		}

		.lectures-list {
			grid-template-columns: 1fr;
		}

		.lecture-author {
			padding: 1rem;
		}

		.lecture-content {
			padding: 1rem;
		}
	}

	@media (max-width: 1024px) {
		.main-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
		}
	}
</style>

