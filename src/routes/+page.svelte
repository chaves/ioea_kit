<script lang="ts">
	import { staticConfig, getConfig, isSessionOver } from '#lib/config.js';
	import SEO from '#lib/components/SEO.svelte';
	import NewsCard from '#lib/components/NewsCard.svelte';
	import type { PageData } from './$types';

	type TestimonialCard =
		| { type: 'text'; name: string; position: string; institution: string; quote: string; photo: string; website?: string | null }
		| { type: 'video'; name: string; institution: string; videoId: string };

	let { data }: { data: PageData } = $props();

	const currentYear = $derived(data.currentYear);
	const randomTestimonials = $derived(data.testimonials);
	const randomVideoTestimonials = $derived(data.videoTestimonials);

	// Get config
	const appConfig = $derived(getConfig());
	const sessionDates = $derived(appConfig.session.fullDateRange);
	const sessionOver = isSessionOver();

	// Get session number from config
	const sessionNumber = $derived(appConfig.sessionNumber);

	// Calculate ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
	function getOrdinal(num: number): string {
		const lastDigit = num % 10;
		const lastTwoDigits = num % 100;

		// Handle special cases: 11th, 12th, 13th (not 11st, 12nd, 13rd)
		if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
			return 'th';
		}

		// Handle regular cases
		if (lastDigit === 1) return 'st';
		if (lastDigit === 2) return 'nd';
		if (lastDigit === 3) return 'rd';
		return 'th';
	}

	const sessionOrdinal = $derived(getOrdinal(sessionNumber));

	const aboutLinks = [
		{ href: '/project', label: 'Goals of the IOEA' },
		{ href: '/project/research', label: 'Research areas' },
		{ href: '/community/faculty', label: 'The faculty' },
		{ href: '/archives', label: 'Past editions' },
		{ href: '/community/alumni', label: 'Alumni' },
		{ href: 'https://learn.ioea.eu', label: 'Learning platform', external: true }
	];

	const combinedTestimonials = $derived<TestimonialCard[]>([
		...randomTestimonials.map<TestimonialCard>((t) => ({
			type: 'text' as const,
			name: t.name,
			position: t.position,
			institution: t.institution,
			quote: t.quote,
			photo: t.photo,
			website: t.website
		})),
		...randomVideoTestimonials.map<TestimonialCard>((v) => ({
			type: 'video' as const,
			name: v.name,
			institution: v.institution,
			videoId: v.id
		}))
	]);

	// Track which videos have been loaded (iframe shown)
	let loadedVideos = $state(new Set<string>());
	let mainVideoLoaded = $state(false);
	const mainVideoId = 'igkwXFJLjWk';

	// Track which testimonials are expanded
	let expandedQuotes = $state(new Set<number>());
	const maxQuoteLength = 150;

	function toggleQuote(index: number) {
		if (expandedQuotes.has(index)) {
			expandedQuotes.delete(index);
		} else {
			expandedQuotes.add(index);
		}
		expandedQuotes = new Set(expandedQuotes);
	}

	function getTruncatedQuote(quote: string, index: number): string {
		if (expandedQuotes.has(index) || quote.length <= maxQuoteLength) {
			return quote;
		}
		return quote.substring(0, maxQuoteLength) + '...';
	}

	function loadVideo(videoId: string) {
		loadedVideos.add(videoId);
		loadedVideos = new Set(loadedVideos); // Trigger reactivity by creating new Set
	}

	function loadMainVideo() {
		mainVideoLoaded = true;
	}

	function getThumbnailUrl(videoId: string): string {
		// Use maxresdefault for best quality, fallback to hqdefault
		return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
	}
</script>

<SEO />

<section class="relative text-white py-12 overflow-hidden bg-gradient-to-br from-primary to-primary-dark before:content-[''] before:absolute before:inset-0 before:opacity-20">
	<div class="container">
		<div class="relative z-10">
			<h1 class="mb-4 text-4xl leading-tight text-white sm:text-3xl">Institutional and Organizational Economics<br />Academy</h1>
			<p class="mb-6 text-xl font-medium leading-relaxed opacity-95 sm:text-lg">
				<strong>The {sessionNumber}{sessionOrdinal} session of the Institutional and Organizational Economics Academy</strong>
				<strong>{sessionOver ? 'was held' : 'will be held'} in Cargèse (Corsica - France) on {sessionDates}.</strong>
			</p>
			<div class="flex flex-wrap gap-4">
				<a href="/{currentYear}" class="px-8 py-4 text-lg btn btn-primary">
					IOEA {currentYear}
				</a>
				{#if appConfig.callIsOpen}
					<a href="/call" class="px-8 py-4 text-lg btn btn-secondary">
						Apply Now
					</a>
				{:else}
					<a href="/community/join" class="px-8 py-4 text-lg btn btn-secondary">
						Join our mailing list
					</a>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Latest News: full width right under the hero, like SIOE. The layout follows
     the number of articles so a single one never sits alone in an empty grid. -->
{#if data.recentNews.length > 0}
	<section class="py-12 bg-bg-alt border-b border-border" aria-labelledby="latest-news">
		<div class="container">
			<div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 mb-8">
				<h2 id="latest-news" class="mb-0">Latest News</h2>
				<a href="/news" class="btn btn-primary text-sm">All news →</a>
			</div>
			{#if data.recentNews.length === 1}
				<NewsCard article={data.recentNews[0]} headingLevel="h3" featured eager />
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 {data.recentNews.length > 2 ? 'lg:grid-cols-3' : ''} gap-6">
					{#each data.recentNews as article, i (article.slug)}
						<!-- Three cards: the third waits for the 3-column layout rather than orphaning on 2 columns -->
						<div class={i === 2 ? 'sm:max-lg:hidden' : ''}>
							<NewsCard {article} headingLevel="h3" eager={i === 0} />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>
{/if}

<!-- About: a short lead beside the video. The full presentation lives on
     /project, so the news above stay within the first screen. -->
<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
			<div>
				<h2 class="mb-5">About the IOEA</h2>
				<p class="mb-6 text-lg leading-relaxed">
					In more than twenty years of existence, the <strong class="font-semibold text-primary">Institutional and Organizational Economics Academy</strong>
					has become one of the most prominent events in research on institutions, organizations and contracts.
					Every spring, internationally recognized scholars and young researchers meet in Cargèse (Corsica)
					for a week of lectures, workshops and seminars.
				</p>
				<ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 p-0 m-0 list-none">
					{#each aboutLinks as link (link.href)}
						<li class="border-b border-border">
							<a
								href={link.href}
								class="flex justify-between items-center py-2.5 font-semibold text-primary hover:text-secondary"
								{...link.external ? { target: '_blank', rel: 'noopener' } : {}}
							>
								{link.label}<span aria-hidden="true">→</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<div class="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] bg-black">
					{#if mainVideoLoaded}
						<iframe
							width="560"
							height="315"
							src="https://www.youtube.com/embed/{mainVideoId}?autoplay=1"
							title="IOEA Presentation"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
							class="absolute top-0 left-0 w-full h-full"
						></iframe>
					{:else}
						<button
							type="button"
							class="flex absolute top-0 left-0 justify-center items-center p-0 w-full h-full bg-transparent border-0 transition-opacity duration-200 cursor-pointer hover:opacity-90"
							onclick={loadMainVideo}
							aria-label="Play IOEA Presentation"
						>
							<img
								src={getThumbnailUrl(mainVideoId)}
								alt="IOEA Presentation"
								loading="lazy"
								class="object-cover absolute top-0 left-0 w-full h-full"
								onerror={(e) => {
									// Fallback to hqdefault if maxresdefault doesn't exist
									const img = e.currentTarget as HTMLImageElement;
									img.src = `https://img.youtube.com/vi/${mainVideoId}/hqdefault.jpg`;
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
			</div>
		</div>
	</div>
</section>

<!-- Voices: full width, so the lower half of the page no longer leaves the
     sidebar column empty -->
<section class="section-space bg-white border-t border-border">
	<div class="container">
		<h2 class="mb-6">Faculties and participants speak about it!</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each combinedTestimonials as item}
				{#if item.type === 'video'}
					<div class="flex flex-col gap-6 bg-white p-6 rounded-lg border border-border shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
						<div class="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-black">
							{#if loadedVideos.has(item.videoId)}
								<iframe
									src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1`}
									title={`${item.name} - ${item.institution}`}
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
									class="absolute top-0 left-0 w-full h-full"
								></iframe>
							{:else}
								<button
									type="button"
									class="flex absolute top-0 left-0 justify-center items-center p-0 w-full h-full bg-transparent border-0 transition-opacity duration-200 cursor-pointer hover:opacity-90"
									onclick={() => loadVideo(item.videoId)}
									aria-label="Play {item.name}"
								>
									<img
										src={getThumbnailUrl(item.videoId)}
										alt="{item.name}"
										loading="lazy"
										class="object-cover absolute top-0 left-0 w-full h-full"
										onerror={(e) => {
											const img = e.currentTarget as HTMLImageElement;
											img.src = `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`;
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
						<div class="flex-1">
							<div class="flex flex-col gap-1">
								<strong class="font-semibold text-primary">{item.name}</strong>
								<span class="text-xs text-text-light">{item.institution}</span>
							</div>
						</div>
					</div>
				{/if}
			{/each}
			{#each [{ id: 'aKZikF2fXxQ', year: 2026 }, { id: 'avcC11fXzlA', year: 2025 }] as vid}
				<div class="flex flex-col gap-6 bg-white p-6 rounded-lg border border-border shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
					<div class="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-black">
						{#if loadedVideos.has(vid.id)}
							<iframe
								src="https://www.youtube.com/embed/{vid.id}?autoplay=1"
								title="IOEA {vid.year} - Participants' impressions"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
								class="absolute top-0 left-0 w-full h-full"
							></iframe>
						{:else}
							<button
								type="button"
								class="flex absolute top-0 left-0 justify-center items-center p-0 w-full h-full bg-transparent border-0 transition-opacity duration-200 cursor-pointer hover:opacity-90"
								onclick={() => loadVideo(vid.id)}
								aria-label="Play IOEA {vid.year} - Participants' impressions"
							>
								<img
									src={getThumbnailUrl(vid.id)}
									alt="IOEA {vid.year} - Participants' impressions"
									loading="lazy"
									class="object-cover absolute top-0 left-0 w-full h-full"
									onerror={(e) => {
										const img = e.currentTarget as HTMLImageElement;
										img.src = `https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`;
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
					<div class="flex-1">
						<div class="flex flex-col gap-1">
							<strong class="font-semibold text-primary">Participants</strong>
							<span class="text-xs text-text-light">IOEA {vid.year}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="mt-8 text-center">
			<a href="/videos" class="inline-flex gap-2 items-center px-6 py-3 text-base font-semibold text-white no-underline rounded-lg transition-all duration-200 bg-secondary hover:bg-secondary-dark hover:shadow-lg hover:-translate-y-0.5">
				Watch more videos →
			</a>
		</div>

		<h2 class="mt-16 mb-6">What Alumni &amp; Faculty Say</h2>
		<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-6">
			{#each combinedTestimonials as item, index}
				{#if item.type === 'text'}
					<div class="flex gap-6 bg-white p-6 rounded-lg border border-border shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex-col text-center sm:flex-row sm:text-left">
						<div class="overflow-hidden flex-shrink-0 mx-auto w-24 h-24 rounded-full sm:mx-0">
							<img
								src={item.photo}
								alt={item.name}
								class="object-cover w-full h-full"
								onerror={(e) => {
									const img = e.currentTarget as HTMLImageElement;
									img.src = '/images/placeholder-person.jpg';
								}}
							/>
						</div>
						<div class="flex-1">
							<blockquote class="italic text-text mb-2 m-0 p-0 text-[0.9rem] leading-relaxed">
								"{getTruncatedQuote(item.quote, index)}"
							</blockquote>
							{#if item.quote.length > maxQuoteLength}
								<button
									type="button"
									class="p-0 mb-3 text-xs font-semibold underline bg-transparent border-0 transition-colors duration-200 cursor-pointer text-secondary hover:text-secondary-dark"
									onclick={() => toggleQuote(index)}
								>
									{expandedQuotes.has(index) ? 'Read less' : 'Read more'}
								</button>
							{/if}
							<div class="flex flex-col gap-1">
								<strong class="font-semibold text-primary">
									{#if item.website}
										<a href={item.website} target="_blank" rel="noopener" class="font-semibold text-primary hover:text-secondary">
											{item.name}
										</a>
									{:else}
										{item.name}
									{/if}
								</strong>
								<span class="text-sm text-text-light">{item.position}</span>
								<span class="text-xs text-text-light">{item.institution}</span>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
		<div class="mt-8 text-center">
			<a href="/community/testimonials" class="inline-flex gap-2 items-center px-6 py-3 text-base font-semibold text-white no-underline rounded-lg transition-all duration-200 bg-secondary hover:bg-secondary-dark hover:shadow-lg hover:-translate-y-0.5">
				Read more testimonials →
			</a>
		</div>
	</div>
</section>
