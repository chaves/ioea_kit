<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SEO from '$lib/components/SEO.svelte';
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

<SEO
	title="Videos"
	description="Watch videos from the Institutional and Organizational Economics Academy lectures and presentations."
/>

<PageHeader title="Videos" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<p class="text-xl text-text-light mb-8 leading-relaxed">
					Watch recorded lectures, presentations, and highlights from past IOEA sessions.
					These videos provide a glimpse into the academic content and atmosphere of our
					summer school.
				</p>

				{#each videoSections as section}
					<div class="mb-12">
						<h2 class="text-primary text-2xl mb-6 pb-2 border-b-2 border-secondary">{section.title}</h2>
						<div class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
							{#each section.videos as video}
								<div class="bg-white border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
									<div class="relative pb-[56.25%] h-0 overflow-hidden bg-black">
										{#if loadedVideos.has(video.id)}
											<iframe
												src="https://www.youtube.com/embed/{video.id}?autoplay=1"
												title="{video.name} - {video.institution}"
												frameborder="0"
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												allowfullscreen
												class="absolute top-0 left-0 w-full h-full"
											></iframe>
										{:else}
											<button
												type="button"
												class="absolute top-0 left-0 w-full h-full border-0 p-0 bg-transparent cursor-pointer flex items-center justify-center transition-opacity duration-200 hover:opacity-90"
												onclick={() => loadVideo(video.id)}
												aria-label="Play {video.name}"
											>
												<img
													src={getThumbnailUrl(video.id)}
													alt="{video.name}"
													loading="lazy"
													class="absolute top-0 left-0 w-full h-full object-cover"
													onerror={(e) => {
														// Fallback to hqdefault if maxresdefault doesn't exist
														const img = e.currentTarget as HTMLImageElement;
														img.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
													}}
												/>
												<div class="relative z-10 w-[68px] h-12 transition-transform duration-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:scale-110" aria-hidden="true">
													<svg xmlns="http://www.w3.org/2000/svg" width="68" height="48" viewBox="0 0 68 48">
														<path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.63-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"/>
														<path d="M 45,24 27,14 27,34" fill="#fff"/>
													</svg>
												</div>
											</button>
										{/if}
									</div>
									<div class="p-4 flex flex-col gap-1">
										<strong class="text-primary text-sm">{video.name}</strong>
										{#if video.institution}
											<span class="text-text-light text-xs">{video.institution}</span>
										{/if}
										{#if video.topic}
											<span class="text-text text-xs italic mt-1">"{video.topic}"</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<div class="bg-bg-alt rounded-lg p-6 text-center">
					<p class="mb-4 text-sm leading-relaxed">
						<strong class="text-primary block mb-2">Discover our on-line learning platform on its dedicated website:</strong>
					</p>
					<a href="https://learn.ioea.eu" target="_blank" rel="noopener" class="inline-block my-4 transition-opacity duration-200 hover:opacity-80 no-underline">
						<img src="/images/logo_learn.svg" alt="IOEA Learn" class="max-w-[180px] w-full h-auto" />
					</a>
					<p class="mt-4 mb-0 text-sm text-text-light leading-normal">
						<em>Learn everything about institutional and organizational economics!</em>
					</p>
				</div>
			</aside>
		</div>
	</div>
</section>

