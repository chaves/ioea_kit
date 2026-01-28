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
					<p class="text-lg sm:text-xl font-medium text-text mb-12 leading-relaxed">
						Watch recorded lectures, presentations, and highlights from past IOEA sessions.
						These videos provide a glimpse into the academic content and atmosphere of our
						summer school.
					</p>

					{#each videoSections as section}
						<div class="mb-16 last:mb-0">
							<h2 class="text-primary text-2xl mb-8 pb-3 border-b-2 border-secondary font-bold">{section.title}</h2>
							<div class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-8">
								{#each section.videos as video}
									<div class="bg-white border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-2xl hover:-translate-y-1">
										<div class="relative pb-[56.25%] h-0 overflow-hidden bg-black shadow-inner">
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
													class="absolute top-0 left-0 w-full h-full border-0 p-0 bg-transparent cursor-pointer flex items-center justify-center transition-opacity duration-300 hover:opacity-95 group"
													onclick={() => loadVideo(video.id)}
													aria-label="Play {video.name}"
												>
													<img
														src={getThumbnailUrl(video.id)}
														alt="{video.name}"
														loading="lazy"
														class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
														onerror={(e) => {
															// Fallback to hqdefault if maxresdefault doesn't exist
															const img = e.currentTarget as HTMLImageElement;
															img.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
														}}
													/>
													<div class="relative z-10 w-[72px] h-14 transition-transform duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] group-hover:scale-125" aria-hidden="true">
														<svg xmlns="http://www.w3.org/2000/svg" width="72" height="52" viewBox="0 0 68 48">
															<path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.63-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"/>
															<path d="M 45,24 27,14 27,34" fill="#fff"/>
														</svg>
													</div>
												</button>
											{/if}
										</div>
										<div class="p-6 flex flex-col gap-2">
											<strong class="text-primary text-lg font-bold leading-tight">{video.name}</strong>
											{#if video.institution}
												<span class="text-text-light text-sm font-medium">{video.institution}</span>
											{/if}
											{#if video.topic}
												<span class="text-text text-sm italic mt-2 border-l-4 border-secondary/30 pl-3">"{video.topic}"</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<div class="bg-bg-alt rounded-2xl p-8 text-center border border-border shadow-inner">
					<p class="mb-6 text-base leading-relaxed">
						<strong class="text-primary block mb-3 text-lg font-bold">Discover our on-line learning platform on its dedicated website:</strong>
					</p>
					<a href="https://learn.ioea.eu" target="_blank" rel="noopener" class="inline-block my-6 transition-all duration-300 hover:scale-110 hover:opacity-90 no-underline">
						<img src="/images/logo_learn.svg" alt="IOEA Learn" class="max-w-[200px] w-full h-auto drop-shadow-sm" />
					</a>
					<p class="mt-6 mb-0 text-base text-text-light leading-relaxed font-medium italic">
						Learn everything about institutional and organizational economics!
					</p>
				</div>
			</aside>
		</div>
	</div>
</section>

