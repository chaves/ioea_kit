<script lang="ts">
	import { config } from '$lib/config';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { PageData } from './$types';

	type TestimonialCard =
		| { type: 'text'; name: string; position: string; institution: string; quote: string; photo: string; website?: string | null }
		| { type: 'video'; name: string; institution: string; videoId: string };

	let { data }: { data: PageData } = $props();

	const currentYear = $derived(data.currentYear);
	const randomTestimonials = $derived(data.testimonials);
	const randomVideoTestimonials = $derived(data.videoTestimonials);

	// Get session dates from dynamic config (via layout)
	const sessionDates = $derived(data.dynamicConfig?.session?.fullDateRange || '6-10 May 2026');
	
	// Get session number from config (database) or calculate it
	const sessionNumber = $derived(() => {
		const dbValue = data.dynamicConfig?.session?.sessionNumber;
		if (dbValue) {
			return dbValue;
		}
		// Fallback calculation
		const calculated = currentYear - 2002 + 1;
		console.warn(`[Homepage] sessionNumber not found in dynamicConfig, using fallback: ${calculated}`);
		return calculated;
	});
	
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

<svelte:head>
	<title>Institutional and Organizational Economics Academy | IOEA</title>
	<meta name="description" content="The IOEA is an intensive one-week academy on Institutional and Organizational Economics held annually in Cargèse, Corsica, France." />
</svelte:head>

<section class="relative text-white py-12 overflow-hidden bg-gradient-to-br from-primary to-primary-dark before:content-[''] before:absolute before:inset-0 before:opacity-20">
	<div class="container">
		<div class="relative z-10">
			<h1 class="text-white text-4xl leading-tight mb-4 sm:text-3xl">Institutional and Organizational Economics<br />Academy</h1>
			<p class="text-xl opacity-95 mb-6 leading-relaxed font-medium sm:text-lg">
				<strong>The {sessionNumber}{sessionOrdinal} session of the Institutional and Organizational Economics Academy</strong>
				<strong>will be held in Cargèse (Corsica - France) on {sessionDates}.</strong>
			</p>
			<div class="flex gap-4 flex-wrap">
				<a href="/{currentYear}" class="btn btn-primary px-8 py-4 text-lg">
					IOEA {currentYear}
				</a>
				<a href="/call" class="btn btn-secondary px-8 py-4 text-lg">
					Apply Now
				</a>
			</div>
		</div>
	</div>
</section>

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<!-- Video Section -->
				<div class="mb-12">
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
								class="absolute top-0 left-0 w-full h-full border-0 p-0 bg-transparent cursor-pointer flex items-center justify-center transition-opacity duration-200 hover:opacity-90"
								onclick={loadMainVideo}
								aria-label="Play IOEA Presentation"
							>
								<img
									src={getThumbnailUrl(mainVideoId)}
									alt="IOEA Presentation"
									loading="lazy"
									class="absolute top-0 left-0 w-full h-full object-cover"
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

				<!-- About Section -->
				<div class="mb-12">
					<p class="text-lg leading-relaxed mb-4">
						In more than twenty years of existence, the <strong class="text-primary font-semibold">Institutional and Organizational Economics Academy</strong> (IOEA) has become one of the most prominent events in research on institutional and organizational economics.
					</p>

					<p class="text-lg leading-relaxed mb-4">
						Using rigorous scientific methods, <strong class="text-primary font-semibold">Institutional and Organizational Economics</strong> (IOE) focuses on the analysis of the economic impacts and on the evolutions of co-ordination frameworks: institutions, organizations and contracts. Main subjects of investigation cover issues that are essential in the design of efficient public policies and firm strategies. IOE put emphasis on applied analysis to confront the theory to facts to enrich the former accordingly. In addition, it is based on multi-disciplinarity to stimulate cross-fertilisation among political science, anthropology, sociology, management, law, and economics.
					</p>

					<p class="text-lg leading-relaxed mb-4">
						The IOEA organizes three types of activities:
					</p>

					<ol class="mb-6 ml-6 space-y-4">
						<li class="text-lg leading-relaxed pl-2">
							A one-week <strong class="text-primary font-semibold">spring school</strong> which is held every year at the Institut d'Etudes Scientifiques de Cargèse in Corsica (France) and combines lectures given by internationally recognized scholars, and workshops and seminars coordinated by young scientists known for their expertise either on a research topic or on a methodology;
						</li>
						<li class="text-lg leading-relaxed pl-2">
							<strong class="text-primary font-semibold">Workshops</strong> focusing on a specific topic in the field
						</li>
					</ol>

					<p class="text-lg leading-relaxed mb-4">
						Over the years, IOEA has continually built up a dense and wide network of researchers and students interested in this dynamic field.
					</p>

					<p class="text-lg leading-relaxed mb-4">
						The strong mobilization of scholars, the organization of complementary workshops and joint publications, the development of on-line resources, the benefit of well-suited facilities, the support of renowned universities, the reiterated financial support from numerous noteworthy institutions and the positive signal that these supports gives to researchers have all contributed to a long-term success. Today more than 350 alumni currently hold academic positions throughout the world, and many scientific co-operations were initiated in this framework.
					</p>
				</div>

				<!-- Current Edition -->
				<div class="mb-12">
					<h2 class="mb-6">IOEA {currentYear}</h2>
					<p class="text-lg leading-relaxed mb-4">
						The {currentYear} edition of the IOEA will take place in spring at the
						Institut d'Études Scientifiques de Cargèse in Corsica, France.
					</p>
					<div class="bg-bg-alt p-6 rounded-lg my-6">
						<h3 class="text-base mb-4">Important Dates</h3>
						<ul class="list-none p-0 m-0">
							<li class="py-2 border-b border-border last:border-b-0">
								<strong>Application Deadline:</strong> {config.deadlines.application}
							</li>
							<li class="py-2 border-b border-border last:border-b-0">
								<strong>Notification:</strong> {config.deadlines.notification}
							</li>
							<li class="py-2 border-b border-border last:border-b-0">
								<strong>Registration:</strong> {config.deadlines.registration}
							</li>
						</ul>
					</div>
					<a href="/call" class="btn btn-primary">
						Apply for IOEA {currentYear}
					</a>
				</div>

			<!-- Testimonials Preview -->
			<div class="mb-12">
				<h2 class="mb-6">What Alumni & Faculty Say</h2>
				<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-6">
					{#each combinedTestimonials as item, index}
						{#if item.type === 'text'}
							<div class="flex gap-6 bg-white p-6 rounded-lg border border-border shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex-col text-center sm:flex-row sm:text-left">
								<div class="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden mx-auto sm:mx-0">
									<img
										src={item.photo}
										alt={item.name}
										class="w-full h-full object-cover"
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
											class="text-secondary text-xs font-semibold mb-3 cursor-pointer bg-transparent border-0 p-0 underline transition-colors duration-200 hover:text-secondary-dark"
											onclick={() => toggleQuote(index)}
										>
											{expandedQuotes.has(index) ? 'Read less' : 'Read more'}
										</button>
									{/if}
									<div class="flex flex-col gap-1">
										<strong class="text-primary font-semibold">
											{#if item.website}
												<a href={item.website} target="_blank" rel="noopener" class="text-primary font-semibold hover:text-secondary">
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
				<div class="text-center mt-8">
					<a href="/community/testimonials" class="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-secondary rounded-lg transition-all duration-200 hover:bg-secondary-dark hover:shadow-lg hover:-translate-y-0.5 no-underline">
						Read more testimonials →
					</a>
				</div>

				<div class="mt-9 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
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
											class="absolute top-0 left-0 w-full h-full border-0 p-0 bg-transparent cursor-pointer flex items-center justify-center transition-opacity duration-200 hover:opacity-90"
											onclick={() => loadVideo(item.videoId)}
											aria-label="Play {item.name}"
										>
											<img
												src={getThumbnailUrl(item.videoId)}
												alt="{item.name}"
												loading="lazy"
												class="absolute top-0 left-0 w-full h-full object-cover"
												onerror={(e) => {
													// Fallback to hqdefault if maxresdefault doesn't exist
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
										<strong class="text-primary font-semibold">{item.name}</strong>
										<span class="text-xs text-text-light">{item.institution}</span>
										<span class="text-sm text-text-light">Video testimonial</span>
									</div>
									<a class="text-secondary text-sm font-semibold inline-block mt-2 no-underline hover:text-secondary-dark" href="/videos">Watch more videos →</a>
								</div>
							</div>
						{/if}
					{/each}
				</div>
				<div class="text-center mt-8">
					<a href="/videos" class="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-secondary rounded-lg transition-all duration-200 hover:bg-secondary-dark hover:shadow-lg hover:-translate-y-0.5 no-underline">
						Read more faculty videos →
					</a>
				</div>
			</div>
			</div>

			<!-- Sidebar -->
			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
				<div class="bg-bg-alt rounded-lg p-6 text-center mt-6">
					<p class="mb-4 text-[0.95rem] leading-relaxed">
						<strong class="text-primary block mb-2">Discover our on-line learning platform on its dedicated website:</strong>
					</p>
					<a href="https://learn.ioea.eu" target="_blank" rel="noopener" class="inline-block my-4 transition-opacity duration-200 hover:opacity-80">
						<img src="/images/logo_learn.svg" alt="IOEA Learn" class="max-w-[180px] w-full h-auto" />
					</a>
					<p class="mt-4 mb-0 text-[0.9rem] text-text-light leading-normal">
						<em>Learn everything about institutional and organizational economics!</em>
					</p>
				</div>
			</aside>
		</div>
	</div>
</section>

