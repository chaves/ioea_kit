<script lang="ts">
	import { config } from '$lib/config';
	import { getFooterSponsors } from '$lib/data/sponsors';

	const footerSponsors = getFooterSponsors();
</script>

<footer class="footer">
	<!-- Sponsors Strip -->
	<div class="sponsors-strip">
		<div class="container">
			<h3 class="sponsors-title">Our Sponsors</h3>
			<div class="sponsors-grid">
				{#each footerSponsors as sponsor}
					{#if sponsor.url && sponsor.url.trim() !== ''}
						<a href={sponsor.url} target="_blank" rel="noopener" title={sponsor.name} class="sponsor-link">
							<img
								src={sponsor.logo}
								alt={sponsor.name}
								class="sponsor-logo"
							/>
						</a>
					{:else}
						<div class="sponsor-link" title={sponsor.name}>
							<img
								src={sponsor.logo}
								alt={sponsor.name}
								class="sponsor-logo"
							/>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>

	<!-- Main Footer -->
	<div class="footer-main">
		<div class="container">
			<div class="footer-grid">
				<!-- About -->
				<div class="footer-section">
					<h4>About IOEA</h4>
					<p>
						The Institutional and Organizational Economics Academy is a two-week
						intensive summer school held annually in Cargèse, Corsica.
					</p>
				</div>

				<!-- Quick Links -->
				<div class="footer-section">
					<h4>Quick Links</h4>
					<ul>
						<li><a href="/{config.currentYear}">IOEA {config.currentYear}</a></li>
						<li><a href="/call">Apply Now</a></li>
						<li><a href="/community">The Community</a></li>
						<li><a href="/archives">Past Editions</a></li>
					</ul>
				</div>

				<!-- Contact -->
				<div class="footer-section">
					<h4>Contact</h4>
					<ul>
						<li>
							<a href="mailto:{config.emails.coordination}">
								{config.emails.coordination}
							</a>
						</li>
						<li>
							<a href="/community/join">Join our mailing list</a>
						</li>
					</ul>
				</div>

				<!-- Social -->
				<div class="footer-section">
					<h4>Follow Us</h4>
					<div class="social-links">
						<a href="https://www.youtube.com/channel/UCI8J34RXhW1Tq7yGTgXlHcQ" target="_blank" rel="noopener" aria-label="YouTube">
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
	<div class="footer-bottom">
		<div class="container">
			<p>
				© {new Date().getFullYear()} Institutional and Organizational Economics Academy.
				All rights reserved.
			</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		margin-top: 4rem;
	}

	.sponsors-strip {
		background-color: var(--color-bg-alt);
		padding: 2rem 0;
		text-align: center;
	}

	.sponsors-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-light);
		margin-bottom: 1.5rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.sponsors-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 3rem;
	}

	.sponsor-link {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		cursor: default;
	}

	a.sponsor-link {
		cursor: pointer;
	}

	.sponsor-logo {
		max-height: 50px;
		width: auto;
		filter: grayscale(100%);
		opacity: 0.6;
		transition: all 0.3s ease;
	}

	.sponsor-logo:hover {
		filter: grayscale(0%);
		opacity: 1;
	}

	.footer-main {
		background-color: var(--color-primary-dark);
		color: white;
		padding: 3rem 0;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
	}

	.footer-section h4 {
		color: white;
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.footer-section p {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.footer-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.footer-section li {
		margin-bottom: 0.5rem;
	}

	.footer-section a {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.9rem;
		transition: color 0.2s ease;
	}

	.footer-section a:hover {
		color: white;
	}

	.social-links {
		display: flex;
		gap: 1rem;
	}

	.social-links a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		color: white;
		transition: all 0.2s ease;
	}

	.social-links a:hover {
		background-color: var(--color-secondary);
	}

	.footer-bottom {
		background-color: #0a1628;
		color: rgba(255, 255, 255, 0.6);
		padding: 1rem 0;
		text-align: center;
		font-size: 0.85rem;
	}

	.footer-bottom p {
		margin: 0;
	}
</style>

