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
					<p class="text-lg sm:text-xl font-medium text-text mb-10 leading-relaxed">
						The IOEA community brings together scholars from around the world who share
						a passion for institutional and organizational economics. Our alumni network
						spans continents and generations of researchers.
					</p>

					<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
						<div class="bg-primary text-white p-6 rounded-lg text-center shadow-md">
							<span class="block text-4xl font-bold leading-none mb-2">1200+</span>
							<span class="text-sm font-medium uppercase tracking-wider opacity-90">Alumni Worldwide</span>
						</div>
						<div class="bg-primary text-white p-6 rounded-lg text-center shadow-md">
							<span class="block text-4xl font-bold leading-none mb-2">20+</span>
							<span class="text-sm font-medium uppercase tracking-wider opacity-90">Years of Excellence</span>
						</div>
						<div class="bg-primary text-white p-6 rounded-lg text-center shadow-md">
							<span class="block text-4xl font-bold leading-none mb-2">50+</span>
							<span class="text-sm font-medium uppercase tracking-wider opacity-90">Countries Represented</span>
						</div>
						<div class="bg-primary text-white p-6 rounded-lg text-center shadow-md">
							<span class="block text-4xl font-bold leading-none mb-2">100+</span>
							<span class="text-sm font-medium uppercase tracking-wider opacity-90">Faculty Members</span>
						</div>
					</div>

					<h2 class="text-primary text-2xl mb-6 pb-2 border-b-2 border-secondary">Who We Are</h2>
					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-10 text-text">
						The IOEA community includes doctoral students, post-doctoral researchers,
						junior faculty, and established scholars who have participated in or contributed
						to our summer school over the years.
					</p>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
						<a href="/community/faculty" class="bg-white p-8 rounded-lg border border-border transition-all duration-200 no-underline hover:border-primary hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1">
							<h3 class="text-primary mb-3 text-xl font-semibold">The Faculty</h3>
							<p class="text-text m-0 text-base leading-relaxed">Meet the renowned scholars who teach at IOEA.</p>
						</a>
						<a href="/community/organizers" class="bg-white p-8 rounded-lg border border-border transition-all duration-200 no-underline hover:border-primary hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1">
							<h3 class="text-primary mb-3 text-xl font-semibold">The Organizers</h3>
							<p class="text-text m-0 text-base leading-relaxed">The team behind the IOEA summer school.</p>
						</a>
						<a href="/community/alumni" class="bg-white p-8 rounded-lg border border-border transition-all duration-200 no-underline hover:border-primary hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1">
							<h3 class="text-primary mb-3 text-xl font-semibold">Alumni Network</h3>
							<p class="text-text m-0 text-base leading-relaxed">Connect with former IOEA participants.</p>
						</a>
						<a href="/community/testimonials" class="bg-white p-8 rounded-lg border border-border transition-all duration-200 no-underline hover:border-primary hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1">
							<h3 class="text-primary mb-3 text-xl font-semibold">Testimonials</h3>
							<p class="text-text m-0 text-base leading-relaxed">Hear from past participants about their experience.</p>
						</a>
					</div>

					<div class="mt-16 p-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl text-white text-center shadow-lg">
						<h2 class="text-white mt-0 mb-6 text-3xl font-bold">Join the Community</h2>
						<p class="text-white/95 max-w-[640px] mx-auto mb-8 text-lg leading-relaxed">
							Stay connected with the IOEA community by subscribing to our mailing list.
							You'll receive updates about upcoming sessions, community news, and opportunities
							for collaboration.
						</p>
						<a href="/community/join" class="inline-flex items-center justify-center bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 no-underline">Subscribe Now</a>
					</div>
				</article>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


