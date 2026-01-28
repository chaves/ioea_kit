<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SEO
	title="Lectures - IOEA {data.year}"
	description="Explore the lectures and academic program of the IOEA {data.year} session."
/>

<PageHeader title="Lectures - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				{#if data.themeGroups.length > 0}
					<div class="flex flex-col gap-0">
						{#each data.themeGroups as theme, index}
							<section class="mb-12 relative {index < data.themeGroups.length - 1 ? `after:content-[''] after:absolute after:bottom-[-1.5rem] after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-border after:to-transparent` : ''}">
								<header class="bg-gradient-to-br from-primary-light via-primary to-secondary text-white px-8 py-6 rounded-[0.875rem] mb-6 shadow-[0_6px_20px_rgba(93,74,120,0.25),0_2px_8px_rgba(112,186,190,0.15)] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative overflow-hidden border-2 border-white/20 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-accent-pink/15 before:via-secondary-light/10 before:to-accent-lime/8 before:pointer-events-none after:content-[''] after:absolute after:top-[-50%] after:right-[-10%] after:w-[200px] after:h-[200px] after:bg-radial-gradient after:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] after:rounded-full after:pointer-events-none">
									<h2 class="m-0 text-[1.35rem] font-bold text-white relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] tracking-[0.02em] sm:text-xl">{theme.name}</h2>
									{#if theme.dateFormatted}
										<p class="text-white/95 font-semibold text-[0.95rem] relative z-10 whitespace-nowrap sm:text-sm">{theme.dateFormatted}</p>
									{/if}
								</header>

								<div class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
									{#each theme.lectures as lecture}
										<a href="/{data.year}/presentation/{lecture.id}" class="no-underline text-inherit block group">
											<div class="bg-white rounded-xl border border-border overflow-hidden flex flex-col h-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] group-hover:border-primary">
												<div class="flex gap-4 p-5 bg-gradient-to-br from-bg-alt to-white/80 border-b border-border relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-300">
													{#if lecture.author.photo}
														<img
															src={`/images/lec/${lecture.author.photo}`}
															alt="{lecture.author.firstName} {lecture.author.lastName}"
															class="max-w-[100px] w-18 h-18 rounded-full object-cover border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 flex-shrink-0 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
															onerror={(e) => {
																const img = e.currentTarget as HTMLImageElement;
																img.style.display = 'none';
															}}
														/>
													{/if}
													<div class="flex-1 min-w-0">
														<h3 class="mb-1 text-[1.1rem] font-semibold">
															{lecture.author.firstName} {lecture.author.lastName}
														</h3>
														{#if lecture.author.institution}
															<p class="text-text-light text-sm m-0 leading-snug">{lecture.author.institution}</p>
														{/if}
													</div>
												</div>
												<div class="p-5 flex flex-col gap-3 flex-1">
													{#if lecture.title}
														<h4 class="text-primary m-0 text-[1.05rem] font-semibold leading-snug">{lecture.title}</h4>
													{/if}
													{#if lecture.abstract}
														<p class="text-text leading-relaxed m-0 text-[0.95rem]">{@html lecture.abstract}</p>
													{/if}
													{#if lecture.link}
														<button
															type="button"
															onclick={(e) => {
																e.stopPropagation();
																e.preventDefault();
																if (lecture.link) {
																	window.open(lecture.link, '_blank', 'noopener');
																}
															}}
															class="bg-transparent border-0 p-0 text-secondary font-semibold text-sm mt-auto inline-flex items-center gap-1 transition-all duration-200 no-underline cursor-pointer font-inherit hover:text-secondary-dark hover:gap-2"
														>
															View materials →
														</button>
													{/if}
												</div>
											</div>
										</a>
									{/each}
								</div>
							</section>
						{/each}
					</div>
				{:else}
					<div class="text-center py-12 bg-bg-alt rounded-lg text-text-light">
						<p>Lecture information for IOEA {data.year} will be available soon.</p>
					</div>
				{/if}
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


