<script lang="ts">
	import { config } from '$lib/config';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { PageData } from './$types';

	type TestimonialCard =
		| { type: 'text'; name: string; position: string; institution: string; quote: string; photo: string; website?: string | null }
		| { type: 'video'; name: string; institution: string; videoId: string };

	let { data }: { data: PageData } = $props();

	const currentYear = data.currentYear;
	const randomTestimonials = data.testimonials;
	const randomVideoTestimonials = data.videoTestimonials;
	const combinedTestimonials: TestimonialCard[] = [
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
	];

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

<section class="hero">
	<div class="container">
		<div class="hero-content">
			<h1>Institutional and Organizational Economics<br />Academy</h1>
			<p class="hero-subtitle">
				<strong>The 22nd session of the Institutional and Organizational Economics Academy</strong>
				<strong>will be held in Cargèse (Corsica - France) on 12-16 May 2025.</strong>
			</p>
			<div class="hero-actions">
				<a href="/{currentYear}" class="btn btn-primary btn-lg">
					IOEA {currentYear}
				</a>
				<a href="/call" class="btn btn-secondary btn-lg">
					Apply Now
				</a>
			</div>
		</div>
	</div>
	<div class="hero-overlay"></div>
</section>

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<!-- Video Section -->
				<div class="video-section">
					<div class="video-wrapper">
						{#if mainVideoLoaded}
							<iframe
								width="560"
								height="315"
								src="https://www.youtube.com/embed/{mainVideoId}?autoplay=1"
								title="IOEA Presentation"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
							></iframe>
						{:else}
							<button
								type="button"
								class="video-thumbnail"
								onclick={loadMainVideo}
								aria-label="Play IOEA Presentation"
							>
								<img
									src={getThumbnailUrl(mainVideoId)}
									alt="IOEA Presentation"
									loading="lazy"
									onerror={(e) => {
										// Fallback to hqdefault if maxresdefault doesn't exist
										const img = e.currentTarget as HTMLImageElement;
										img.src = `https://img.youtube.com/vi/${mainVideoId}/hqdefault.jpg`;
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
				</div>

				<!-- About Section -->
				<div class="about-section">
					<p>
						In more than twenty years of existence, the <strong>Institutional and Organizational Economics Academy</strong> (IOEA) has become one of the most prominent events in research on institutional and organizational economics.
					</p>

					<p>
						Using rigorous scientific methods, <strong>Institutional and Organizational Economics</strong> (IOE) focuses on the analysis of the economic impacts and on the evolutions of co-ordination frameworks: institutions, organizations and contracts. Main subjects of investigation cover issues that are essential in the design of efficient public policies and firm strategies. IOE put emphasis on applied analysis to confront the theory to facts to enrich the former accordingly. In addition, it is based on multi-disciplinarity to stimulate cross-fertilisation among political science, anthropology, sociology, management, law, and economics.
					</p>

					<p>
						The IOEA organizes three types of activities:
					</p>

					<ol class="activities-list">
						<li>
							A one-week <strong>spring school</strong> which is held every year at the Institut d'Etudes Scientifiques de Cargèse in Corsica (France) and combines lectures given by internationally recognized scholars, and workshops and seminars coordinated by young scientists known for their expertise either on a research topic or on a methodology;
						</li>
						<li>
							<strong>Workshops</strong> focusing on a specific topic in the field
						</li>
					</ol>

					<p>
						Over the years, IOEA has continually built up a dense and wide network of researchers and students interested in this dynamic field.
					</p>

					<p>
						The strong mobilization of scholars, the organization of complementary workshops and joint publications, the development of on-line resources, the benefit of well-suited facilities, the support of renowned universities, the reiterated financial support from numerous noteworthy institutions and the positive signal that these supports gives to researchers have all contributed to a long-term success. Today more than 350 alumni currently hold academic positions throughout the world, and many scientific co-operations were initiated in this framework.
					</p>
				</div>

				<!-- Current Edition -->
				<div class="current-edition">
					<h2>IOEA {currentYear}</h2>
				<p>
					The {currentYear} edition of the IOEA will take place in spring at the
					Institut d'Études Scientifiques de Cargèse in Corsica, France.
				</p>
					<div class="deadlines">
						<h3>Important Dates</h3>
						<ul>
							<li>
								<strong>Application Deadline:</strong> {config.deadlines.application}
							</li>
							<li>
								<strong>Notification:</strong> {config.deadlines.notification}
							</li>
							<li>
								<strong>Registration:</strong> {config.deadlines.registration}
							</li>
						</ul>
					</div>
					<a href="/call" class="btn btn-primary">
						Apply for IOEA {currentYear}
					</a>
				</div>

			<!-- Testimonials Preview -->
			<div class="testimonials-section">
				<h2>What Alumni & Faculty Say</h2>
				<div class="testimonials-grid">
					{#each combinedTestimonials as item, index}
						{#if item.type === 'text'}
							<div class="testimonial-card">
								<div class="testimonial-photo">
									<img
										src={item.photo}
										alt={item.name}
										onerror={(e) => {
											const img = e.currentTarget as HTMLImageElement;
											img.src = '/images/placeholder-person.jpg';
										}}
									/>
								</div>
								<div class="testimonial-content">
									<blockquote>
										"{getTruncatedQuote(item.quote, index)}"
									</blockquote>
									{#if item.quote.length > maxQuoteLength}
										<button
											type="button"
											class="read-more-quote"
											onclick={() => toggleQuote(index)}
										>
											{expandedQuotes.has(index) ? 'Read less' : 'Read more'}
										</button>
									{/if}
									<div class="testimonial-author">
										<strong>
											{#if item.website}
												<a href={item.website} target="_blank" rel="noopener">
													{item.name}
												</a>
											{:else}
												{item.name}
											{/if}
										</strong>
										<span class="position">{item.position}</span>
										<span class="institution">{item.institution}</span>
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
				<div class="view-more-wrapper">
					<a href="/community/testimonials" class="view-more-link">
						Read more testimonials →
					</a>
				</div>

				<div class="mt-9 videos-grid testimonials-grid">
					{#each combinedTestimonials as item}
						{#if item.type === 'video'}
							<div class="testimonial-card video-card">
								<div class="video-wrapper">
									{#if loadedVideos.has(item.videoId)}
										<iframe
											src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1`}
											title={`${item.name} - ${item.institution}`}
											frameborder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowfullscreen
										></iframe>
									{:else}
										<button
											type="button"
											class="video-thumbnail"
											onclick={() => loadVideo(item.videoId)}
											aria-label="Play {item.name}"
										>
											<img
												src={getThumbnailUrl(item.videoId)}
												alt="{item.name}"
												loading="lazy"
												onerror={(e) => {
													// Fallback to hqdefault if maxresdefault doesn't exist
													const img = e.currentTarget as HTMLImageElement;
													img.src = `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`;
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
								<div class="testimonial-content">
									<div class="testimonial-author">
										<strong>{item.name}</strong>
										<span class="institution">{item.institution}</span>
										<span class="position">Video testimonial</span>
									</div>
									<a class="read-more-inline" href="/videos">Watch more videos →</a>
								</div>
							</div>
						{/if}
					{/each}
				</div>
				<div class="view-more-wrapper">
					<a href="/videos" class="view-more-link">
						Read more faculty videos →
					</a>
				</div>
			</div>
			</div>

			<!-- Sidebar -->
			<aside class="sidebar">
				<Sidebar />
				<div class="sidebar-widget learning-platform-widget">
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
	.hero {
		@apply relative text-white py-12 overflow-hidden;
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
	}

	.hero::before {
		@apply content-[''] absolute inset-0 opacity-20;
	}

	.hero-content {
		@apply relative z-10;
	}

	.hero h1 {
		@apply text-white text-4xl leading-tight mb-4;
	}

	.hero-subtitle {
		@apply text-xl opacity-95 mb-6 leading-relaxed;
		font-weight: 500;
	}

	.hero-actions {
		@apply flex gap-4 flex-wrap;
	}

	.btn-lg {
		@apply px-8 py-4 text-lg;
	}

	.main-grid {
		@apply grid gap-12;
		grid-template-columns: 1fr 320px;
	}

	.video-section {
		@apply mb-12;
	}

	.video-wrapper {
		@apply relative pb-[56.25%] h-0 overflow-hidden rounded-lg;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		background: #000;
	}

	.video-wrapper iframe {
		@apply absolute top-0 left-0 w-full h-full;
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

	.about-section,
	.current-edition,
	.testimonials-section {
		@apply mb-12;
	}

	.current-edition h2,
	.testimonials-section h2 {
		@apply mb-6;
	}

	.about-section p,
	.current-edition p {
		@apply text-lg leading-relaxed mb-4;
	}

	.activities-list {
		@apply mb-6 ml-6 space-y-4;
	}

	.activities-list li {
		@apply text-lg leading-relaxed;
		padding-left: 0.5rem;
	}

	.activities-list li strong {
		@apply text-primary font-semibold;
	}

	.deadlines {
		@apply bg-bg-alt p-6 rounded-lg my-6;
	}

	.deadlines h3 {
		@apply text-base mb-4;
	}

	.deadlines ul {
		@apply list-none p-0 m-0;
	}

	.deadlines li {
		@apply py-2 border-b border-border;
	}

	.deadlines li:last-child {
		@apply border-b-0;
	}

	.testimonials-grid {
		@apply grid gap-6 mb-6;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	.testimonial-card {
		@apply flex gap-6 bg-white p-6 rounded-lg border border-border;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.video-card {
		@apply flex-col;
	}

	.testimonial-photo {
		@apply flex-shrink-0 w-24 h-24 rounded-full overflow-hidden;
	}

	.testimonial-photo img {
		@apply w-full h-full object-cover;
	}

	.testimonial-content {
		@apply flex-1;
	}

	.video-wrapper {
		@apply relative pb-[56.25%] h-0 overflow-hidden rounded-lg;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		background: #000;
	}

	.video-wrapper iframe {
		@apply absolute top-0 left-0 w-full h-full;
	}

	.testimonial-content blockquote {
		@apply italic text-text leading-relaxed mb-2 m-0 p-0;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.read-more-quote {
		@apply text-secondary text-xs font-semibold mb-3 cursor-pointer;
		background: none;
		border: none;
		padding: 0;
		text-decoration: underline;
		transition: color 0.2s ease;
	}

	.read-more-quote:hover {
		@apply text-secondary-dark;
	}

	.testimonial-author {
		@apply flex flex-col gap-1;
	}

	.testimonial-author strong,
	.testimonial-author a {
		@apply text-primary font-semibold;
	}

	.testimonial-author a:hover {
		@apply text-secondary;
	}

	.testimonial-author .position {
		@apply text-sm text-text-light;
	}

	.testimonial-author .institution {
		@apply text-xs text-text-light;
	}

	.read-more-inline {
		@apply text-secondary text-sm font-semibold;
		display: inline-block;
		margin-top: 0.5rem;
	}

	.view-more-wrapper {
		@apply text-center mt-8;
	}

	.view-more-link {
		@apply inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-secondary rounded-lg transition-all duration-200 hover:bg-secondary-dark hover:shadow-lg hover:-translate-y-0.5;
	}

	.sidebar {
		@apply sticky top-[100px] self-start;
	}

	.learning-platform-widget {
		background: var(--color-bg-alt);
		border-radius: 0.5rem;
		padding: 1.5rem;
		text-align: center;
		margin-top: 1.5rem;
	}

	.learning-platform-widget p {
		margin-bottom: 1rem;
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.learning-platform-widget strong {
		color: var(--color-primary);
		display: block;
		margin-bottom: 0.5rem;
	}

	.learning-platform-widget .platform-link {
		display: inline-block;
		margin: 1rem 0;
		transition: opacity 0.2s ease;
	}

	.learning-platform-widget .platform-link:hover {
		opacity: 0.8;
	}

	.learning-platform-widget .learn-logo {
		max-width: 180px;
		width: 100%;
		height: auto;
	}

	.learning-platform-widget .platform-tagline {
		margin-top: 1rem;
		margin-bottom: 0;
		font-size: 0.9rem;
		color: var(--color-text-light);
		line-height: 1.5;
	}

	@media (max-width: 1024px) {
		.main-grid {
			@apply grid-cols-1;
		}

		.sidebar {
			@apply static;
		}
	}

	@media (max-width: 767px) {
		.hero h1 {
			@apply text-3xl;
		}

		.hero-subtitle {
			@apply text-lg;
		}

		.testimonial-card {
			@apply flex-col text-center;
		}

		.testimonial-photo {
			@apply mx-auto;
		}
	}
</style>
