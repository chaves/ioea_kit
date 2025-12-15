<script lang="ts">
	import { config } from '$lib/config';
	import { getFooterSponsors } from '$lib/data/sponsors';

	const footerSponsors = getFooterSponsors();
</script>

<footer class="mt-16">
	<!-- Sponsors Strip -->
	<div class="bg-bg-alt py-8 text-center">
		<div class="container">
			<h3 class="text-base font-semibold text-text-light mb-6 uppercase tracking-wider">Our Sponsors</h3>
			<div class="flex flex-wrap justify-center items-center gap-12">
				{#each footerSponsors as sponsor}
					{#if sponsor.url && sponsor.url.trim() !== ''}
						<a href={sponsor.url} target="_blank" rel="noopener" title={sponsor.name} class="flex items-center justify-center no-underline cursor-pointer">
							<img
								src={sponsor.logo}
								alt={sponsor.name}
								class="max-h-[50px] w-auto grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
							/>
						</a>
					{:else}
						<div class="flex items-center justify-center cursor-default" title={sponsor.name}>
							<img
								src={sponsor.logo}
								alt={sponsor.name}
								class="max-h-[50px] w-auto grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
							/>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>

	<!-- Main Footer -->
	<div class="bg-primary-dark text-white py-12">
		<div class="container">
			<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
				<!-- About -->
				<div>
					<h4 class="text-white text-base font-semibold mb-4 pb-2 border-b-2 border-secondary">About IOEA</h4>
					<p class="text-white/80 text-sm leading-relaxed">
						The Institutional and Organizational Economics Academy is a two-week
						intensive summer school held annually in Cargèse, Corsica.
					</p>
				</div>

				<!-- Quick Links -->
				<div>
					<h4 class="text-white text-base font-semibold mb-4 pb-2 border-b-2 border-secondary">Quick Links</h4>
					<ul class="list-none p-0 m-0">
						<li class="mb-2"><a href="/{config.currentYear}" class="text-white/80 text-sm transition-colors duration-200 hover:text-white no-underline">IOEA {config.currentYear}</a></li>
						<li class="mb-2"><a href="/call" class="text-white/80 text-sm transition-colors duration-200 hover:text-white no-underline">Apply Now</a></li>
						<li class="mb-2"><a href="/community" class="text-white/80 text-sm transition-colors duration-200 hover:text-white no-underline">The Community</a></li>
						<li class="mb-2"><a href="/archives" class="text-white/80 text-sm transition-colors duration-200 hover:text-white no-underline">Past Editions</a></li>
					</ul>
				</div>

				<!-- Contact -->
				<div>
					<h4 class="text-white text-base font-semibold mb-4 pb-2 border-b-2 border-secondary">Contact</h4>
					<ul class="list-none p-0 m-0">
						<li class="mb-2">
							<a href="mailto:{config.emails.coordination}" class="text-white/80 text-sm transition-colors duration-200 hover:text-white no-underline">
								{config.emails.coordination}
							</a>
						</li>
						<li class="mb-2">
							<a href="/community/join" class="text-white/80 text-sm transition-colors duration-200 hover:text-white no-underline">Join our mailing list</a>
						</li>
					</ul>
				</div>

				<!-- Social -->
				<div>
					<h4 class="text-white text-base font-semibold mb-4 pb-2 border-b-2 border-secondary">Follow Us</h4>
					<div class="flex gap-4">
						<a href="https://www.youtube.com/channel/UCI8J34RXhW1Tq7yGTgXlHcQ" target="_blank" rel="noopener" aria-label="YouTube" class="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-white transition-all duration-200 hover:bg-secondary">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Copyright -->
	<div class="bg-[#0a1628] text-white/60 py-4 text-center text-sm">
		<div class="container">
			<p class="m-0">
				© {new Date().getFullYear()} Institutional and Organizational Economics Academy.
				All rights reserved.
			</p>
		</div>
	</div>
</footer>

