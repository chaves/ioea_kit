<script lang="ts">
	import { config } from '$lib/config';
	import { getFooterSponsors } from '$lib/data/sponsors';

	const footerSponsors = getFooterSponsors();
</script>

<footer class="mt-16">
	<!-- Sponsors Strip -->
	<div class="py-8 text-center bg-bg-alt">
		<div class="container">
			<h3 class="mb-6 text-base font-semibold tracking-wider uppercase text-text-light">Our Sponsors</h3>
			<div class="flex flex-wrap gap-12 justify-center items-center">
				{#each footerSponsors as sponsor}
					{#if sponsor.url && sponsor.url.trim() !== ''}
						<a href={sponsor.url} target="_blank" rel="noopener" title={sponsor.name} class="flex justify-center items-center no-underline cursor-pointer">
							<img
								src={sponsor.logo}
								alt={sponsor.name}
								class="max-h-[50px] w-auto grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
							/>
						</a>
					{:else}
						<div class="flex justify-center items-center cursor-default" title={sponsor.name}>
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
	<div class="py-12 text-white bg-primary-dark">
		<div class="container">
			<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
				<!-- About -->
				<div>
					<h4 class="pb-2 mb-4 text-base font-semibold text-white border-b-2 border-secondary">About IOEA</h4>
					<p class="text-sm leading-relaxed text-white/80">
						The Institutional and Organizational Economics Academy is a two-week
						intensive summer school held annually in Cargèse, Corsica.
					</p>
				</div>

				<!-- Quick Links -->
				<div>
					<h4 class="pb-2 mb-4 text-base font-semibold text-white border-b-2 border-secondary">Quick Links</h4>
					<ul class="p-0 m-0 list-none">
						<li class="mb-2"><a href="/{config.currentYear}" class="text-sm no-underline transition-colors duration-200 text-white/80 hover:text-white">IOEA {config.currentYear}</a></li>
						<li class="mb-2"><a href="/call" class="text-sm no-underline transition-colors duration-200 text-white/80 hover:text-white">Apply Now</a></li>
						<li class="mb-2"><a href="/community" class="text-sm no-underline transition-colors duration-200 text-white/80 hover:text-white">The Community</a></li>
						<li class="mb-2"><a href="/archives" class="text-sm no-underline transition-colors duration-200 text-white/80 hover:text-white">Past Editions</a></li>
					</ul>
				</div>

				<!-- Contact -->
				<div>
					<h4 class="pb-2 mb-4 text-base font-semibold text-white border-b-2 border-secondary">Contact</h4>
					<ul class="p-0 m-0 list-none">
						<li class="mb-2">
							<a href="mailto:{config.emails.coordination}" class="text-sm no-underline transition-colors duration-200 text-white/80 hover:text-white">
								{config.emails.coordination}
							</a>
						</li>
						<li class="mb-2">
							<a href="/community/join" class="text-sm no-underline transition-colors duration-200 text-white/80 hover:text-white">Join our mailing list</a>
						</li>
					</ul>
				</div>

				<!-- Social -->
				<div>
					<h4 class="pb-2 mb-4 text-base font-semibold text-white border-b-2 border-secondary">Follow Us</h4>
					<div class="flex gap-4">
						<a href="https://www.youtube.com/channel/UCI8J34RXhW1Tq7yGTgXlHcQ" target="_blank" rel="noopener" aria-label="YouTube" class="flex justify-center items-center w-10 h-10 text-white rounded-full transition-all duration-200 bg-white/10 hover:bg-secondary">
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
			<p class="my-6">
				Website & Extranet developed by Bruno Chaves Ferreira
			</p>
		</div>
	</div>
</footer>

