<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { videoSections } from '$lib/data/videos';

	// Track which videos have been loaded (iframe shown)
	let loadedVideos = $state(new Set<string>());

	function loadVideo(videoId: string) {
		loadedVideos.add(videoId);
		// Trigger reactivity by creating a new Set
		loadedVideos = new Set(loadedVideos);
	}

	function getThumbnailUrl(videoId: string): string {
		// Use maxresdefault for best quality, fallback to hqdefault
		return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
	}
</script>

<svelte:head>
	<title>Videos | IOEA</title>
	<meta name="description" content="Watch videos from the Institutional and Organizational Economics Academy lectures and presentations." />
</svelte:head>

<PageHeader title="Videos" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<p class="lead">
					Watch recorded lectures, presentations, and highlights from past IOEA sessions.
					These videos provide a glimpse into the academic content and atmosphere of our
					summer school.
				</p>

				{#each videoSections as section}
					<div class="video-section">
						<h2>{section.title}</h2>
						<div class="videos-grid">
							{#each section.videos as video}
								<div class="video-card">
									<div class="video-wrapper">
										{#if loadedVideos.has(video.id)}
											<iframe
												src="https://www.youtube.com/embed/{video.id}?autoplay=1"
												title="{video.name} - {video.institution}"
												frameborder="0"
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												allowfullscreen
											></iframe>
										{:else}
											<button
												type="button"
												class="video-thumbnail"
												onclick={() => loadVideo(video.id)}
												aria-label="Play {video.name}"
											>
												<img
													src={getThumbnailUrl(video.id)}
													alt="{video.name}"
													loading="lazy"
													onerror={(e) => {
														// Fallback to hqdefault if maxresdefault doesn't exist
														const img = e.currentTarget as HTMLImageElement;
														img.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
													}}
												/>
												<div class="play-button" aria-hidden="true">
													<svg xmlns="http://www.w3.org/2000/svg" width="68" height="48" viewBox="0 0 68 48">
														<path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.63-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"/>
														<path d="M 45,24 27,14 27,34" fill="#fff"/>
													</svg>
												</div>
											</button>
										{/if}
									</div>
									<div class="video-info">
										<strong class="video-name">{video.name}</strong>
										{#if video.institution}
											<span class="video-institution">{video.institution}</span>
										{/if}
										{#if video.topic}
											<span class="video-topic">"{video.topic}"</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<aside class="sidebar">
				<div class="sidebar-widget">
					<p>
						<strong>Discover our on-line learning platform on its dedicated website:</strong>
					</p>
					<a href="https://learn.ioea.eu" target="_blank" rel="noopener" class="platform-link">
						<img src="/images/logo_learn.svg" alt="IOEA Learn" class="learn-logo" />
					</a>
					<p class="platform-tagline">
						<em>Learn everything about institutional and organizational economics!</em>
					</p>
				</div>
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

	.lead {
		font-size: 1.2rem;
		color: var(--color-text-light);
		margin-bottom: 2rem;
		line-height: 1.7;
	}

	.youtube-cta {
		margin-bottom: 3rem;
		padding: 2rem;
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
		text-align: center;
	}

	.video-section {
		margin-bottom: 3rem;
	}

	.video-section h2 {
		color: var(--color-primary);
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.videos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.video-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.video-card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.video-wrapper {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
		background: #000;
	}

	.video-wrapper iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.video-thumbnail {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
		padding: 0;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s ease;
	}

	.video-thumbnail:hover {
		opacity: 0.9;
	}

	.video-thumbnail img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.play-button {
		position: relative;
		z-index: 1;
		width: 68px;
		height: 48px;
		transition: transform 0.2s ease;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
	}

	.video-thumbnail:hover .play-button {
		transform: scale(1.1);
	}

	.video-info {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.video-name {
		color: var(--color-primary);
		font-size: 0.95rem;
	}

	.video-institution {
		color: var(--color-text-light);
		font-size: 0.85rem;
	}

	.video-topic {
		color: var(--color-text);
		font-size: 0.8rem;
		font-style: italic;
		margin-top: 0.25rem;
	}

	.sidebar {
		position: sticky;
		top: 100px;
		align-self: start;
	}

	.sidebar-widget {
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
		padding: 1.5rem;
		text-align: center;
	}

	.sidebar-widget p {
		margin-bottom: 1rem;
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.sidebar-widget strong {
		color: var(--color-primary);
		display: block;
		margin-bottom: 0.5rem;
	}

	.platform-link {
		display: inline-block;
		margin: 1rem 0;
		transition: opacity 0.2s ease;
	}

	.platform-link:hover {
		opacity: 0.8;
	}

	.learn-logo {
		max-width: 180px;
		width: 100%;
		height: auto;
	}

	.platform-tagline {
		margin-top: 1rem;
		margin-bottom: 0;
		font-size: 0.9rem;
		color: var(--color-text-light);
		line-height: 1.5;
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
		.videos-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
