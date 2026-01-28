<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { testimonials } from '$lib/data/testimonials';
</script>

<svelte:head>
	<title>Testimonials | IOEA Community</title>
	<meta name="description" content="Testimonials from IOEA alumni and faculty members." />
</svelte:head>

<PageHeader title="Testimonials" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<div class="flex flex-col gap-8">
					{#each testimonials as testimonial}
						<div class="flex gap-6 bg-white p-8 rounded-lg border border-border flex-col text-center sm:flex-row sm:text-left">
							<div class="flex-shrink-0 w-[120px] h-[120px] rounded-full overflow-hidden mx-auto sm:mx-0">
								<img
									src={testimonial.photo}
									alt={testimonial.name}
									class="w-full h-full object-cover"
									onerror={(e) => {
										const img = e.currentTarget as HTMLImageElement;
										img.src = '/images/placeholder-person.jpg';
									}}
								/>
							</div>
							<div class="flex-1">
								<blockquote class="italic text-text text-base sm:text-lg leading-relaxed mb-6 m-0 p-0">
									"{testimonial.quote}"
								</blockquote>
								<div class="flex flex-col gap-1.5">
									<strong class="text-primary text-lg">
										{#if testimonial.website}
											<a href={testimonial.website} target="_blank" rel="noopener" class="text-primary no-underline hover:text-secondary hover:underline">
												{testimonial.name}
											</a>
										{:else}
											{testimonial.name}
										{/if}
									</strong>
									<span class="text-base text-text-light font-medium">{testimonial.position}</span>
									<span class="text-sm text-text-light">{testimonial.institution}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


