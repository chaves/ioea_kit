<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
	<title>The Community | IOEA</title>
	<meta name="description" content="Join the vibrant IOEA community of scholars and researchers in institutional and organizational economics." />
</svelte:head>

<PageHeader title="The Community" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<article class="content">
					<p class="lead">
						The IOEA community brings together scholars from around the world who share
						a passion for institutional and organizational economics. Our alumni network
						spans continents and generations of researchers.
					</p>

					<div class="community-stats">
						<div class="stat-card">
							<span class="stat-number">1200+</span>
							<span class="stat-label">Alumni Worldwide</span>
						</div>
						<div class="stat-card">
							<span class="stat-number">20+</span>
							<span class="stat-label">Years of Excellence</span>
						</div>
						<div class="stat-card">
							<span class="stat-number">50+</span>
							<span class="stat-label">Countries Represented</span>
						</div>
						<div class="stat-card">
							<span class="stat-number">100+</span>
							<span class="stat-label">Faculty Members</span>
						</div>
					</div>

					<h2>Who We Are</h2>
					<p>
						The IOEA community includes doctoral students, post-doctoral researchers,
						junior faculty, and established scholars who have participated in or contributed
						to our summer school over the years.
					</p>

					<div class="community-sections">
						<a href="/community/faculty" class="community-card">
							<h3>The Faculty</h3>
							<p>Meet the renowned scholars who teach at IOEA.</p>
						</a>
						<a href="/community/organizers" class="community-card">
							<h3>The Organizers</h3>
							<p>The team behind the IOEA summer school.</p>
						</a>
						<a href="/community/alumni" class="community-card">
							<h3>Alumni Network</h3>
							<p>Connect with former IOEA participants.</p>
						</a>
						<a href="/community/testimonials" class="community-card">
							<h3>Testimonials</h3>
							<p>Hear from past participants about their experience.</p>
						</a>
					</div>

					<div class="join-section">
						<h2>Join the Community</h2>
						<p>
							Stay connected with the IOEA community by subscribing to our mailing list.
							You'll receive updates about upcoming sessions, community news, and opportunities
							for collaboration.
						</p>
						<a href="/community/join" class="btn btn-primary btn-lg">Subscribe Now</a>
					</div>
				</article>
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

	.lead {
		font-size: 1.2rem;
		color: var(--color-text-light);
		margin-bottom: 2rem;
		line-height: 1.7;
	}

	.community-stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 3rem;
	}

	.stat-card {
		background: var(--color-primary);
		color: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		text-align: center;
	}

	.stat-number {
		display: block;
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 0.85rem;
		opacity: 0.9;
	}

	.content h2 {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.content p {
		font-size: 1.05rem;
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.community-sections {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.community-card {
		background: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.community-card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transform: translateY(-2px);
	}

	.community-card h3 {
		color: var(--color-primary);
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
	}

	.community-card p {
		color: var(--color-text-light);
		margin: 0;
		font-size: 0.95rem;
	}

	.join-section {
		margin-top: 3rem;
		padding: 2rem;
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
		border-radius: 0.5rem;
		color: white;
		text-align: center;
	}

	.join-section h2 {
		color: white;
		margin-top: 0;
	}

	.join-section p {
		color: rgba(255, 255, 255, 0.9);
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.btn-lg {
		padding: 1rem 2rem;
		font-size: 1.1rem;
	}

	.sidebar {
		position: sticky;
		top: 100px;
		align-self: start;
	}

	@media (max-width: 1024px) {
		.main-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
		}
	}

	@media (max-width: 767px) {
		.community-stats {
			grid-template-columns: repeat(2, 1fr);
		}

		.community-sections {
			grid-template-columns: 1fr;
		}

		.stat-number {
			font-size: 2rem;
		}
	}
</style>

