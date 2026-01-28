<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
	title="The Community"
	description="Join the vibrant IOEA community of scholars and researchers in institutional and organizational economics."
/>

<PageHeader title="The Community" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<article>
					<p class="text-xl text-text-light mb-8 leading-relaxed">
						The IOEA community brings together scholars from around the world who share
						a passion for institutional and organizational economics. Our alumni network
						spans continents and generations of researchers.
					</p>

					<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
						<div class="bg-primary text-white p-6 rounded-lg text-center">
							<span class="block text-4xl font-bold leading-none mb-2">1200+</span>
							<span class="text-sm opacity-90">Alumni Worldwide</span>
						</div>
						<div class="bg-primary text-white p-6 rounded-lg text-center">
							<span class="block text-4xl font-bold leading-none mb-2">20+</span>
							<span class="text-sm opacity-90">Years of Excellence</span>
						</div>
						<div class="bg-primary text-white p-6 rounded-lg text-center">
							<span class="block text-4xl font-bold leading-none mb-2">50+</span>
							<span class="text-sm opacity-90">Countries Represented</span>
						</div>
						<div class="bg-primary text-white p-6 rounded-lg text-center">
							<span class="block text-4xl font-bold leading-none mb-2">100+</span>
							<span class="text-sm opacity-90">Faculty Members</span>
						</div>
					</div>

					<h2 class="mt-8 mb-4">Who We Are</h2>
					<p class="text-[1.05rem] leading-relaxed mb-4">
						The IOEA community includes doctoral students, post-doctoral researchers,
						junior faculty, and established scholars who have participated in or contributed
						to our summer school over the years.
					</p>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
						<a href="/community/faculty" class="bg-white p-6 rounded-lg border border-border transition-all duration-200 no-underline hover:border-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
							<h3 class="text-primary mb-2 text-lg">The Faculty</h3>
							<p class="text-text-light m-0 text-sm">Meet the renowned scholars who teach at IOEA.</p>
						</a>
						<a href="/community/organizers" class="bg-white p-6 rounded-lg border border-border transition-all duration-200 no-underline hover:border-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
							<h3 class="text-primary mb-2 text-lg">The Organizers</h3>
							<p class="text-text-light m-0 text-sm">The team behind the IOEA summer school.</p>
						</a>
						<a href="/community/alumni" class="bg-white p-6 rounded-lg border border-border transition-all duration-200 no-underline hover:border-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
							<h3 class="text-primary mb-2 text-lg">Alumni Network</h3>
							<p class="text-text-light m-0 text-sm">Connect with former IOEA participants.</p>
						</a>
						<a href="/community/testimonials" class="bg-white p-6 rounded-lg border border-border transition-all duration-200 no-underline hover:border-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
							<h3 class="text-primary mb-2 text-lg">Testimonials</h3>
							<p class="text-text-light m-0 text-sm">Hear from past participants about their experience.</p>
						</a>
					</div>

					<div class="mt-12 p-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg text-white text-center">
						<h2 class="text-white mt-0 mb-4">Join the Community</h2>
						<p class="text-white/90 max-w-[600px] mx-auto mb-6">
							Stay connected with the IOEA community by subscribing to our mailing list.
							You'll receive updates about upcoming sessions, community news, and opportunities
							for collaboration.
						</p>
						<a href="/community/join" class="btn btn-primary px-8 py-4 text-lg no-underline">Subscribe Now</a>
					</div>
				</article>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


