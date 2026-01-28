<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
	title="Goals of the IOEA"
	description="The IOEA aims to promote advanced and original research on institutional and organizational economics."
/>

<PageHeader title="Goals of the IOEA" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<article>
					<p class="mb-8 text-lg font-medium leading-relaxed sm:text-xl text-text">
						The IOEA aims to promote advanced and original research on institutional and
						organizational economics. Institutional and organizational economics (IOE) has
						been one of the most prolific fields of research during the past forty years.
					</p>

					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-6 text-text">
						It combines theoretical and empirical analyses of the diversity of mechanisms,
						formal and informal, allowing coordination between agents, interaction between
						these different mechanisms and their consequences on economic performances and dynamics.
					</p>

					<h2 class="pb-2 mt-12 mb-6 text-2xl border-b-2 text-primary border-secondary">Two Strong Traditions</h2>
					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-6 text-text">IOE is characterized by two strong traditions:</p>

					<div class="flex flex-col gap-6 my-8">
						<div class="p-8 rounded-lg border-l-4 shadow-sm bg-bg-alt border-secondary">
							<h3 class="mb-4 text-xl font-semibold text-secondary-dark">Operationalization</h3>
							<p class="mb-4 text-base leading-relaxed">
								Its constant attention to operationalization. This research program aims at
								developing analyses leading to empirically refutable propositions. The continuous
								round trip between theoretical developments and empirical analyses result into
								operational propositions for both researchers, and public and private decision-makers.
							</p>
							<p class="mb-0 text-base leading-relaxed">
								It explains why today IOEA alumni hold positions not only in the academia,
								but also in governmental or international agencies, and even in businesses.
							</p>
						</div>

						<div class="p-8 rounded-lg border-l-4 shadow-sm bg-bg-alt border-secondary">
							<h3 class="mb-4 text-xl font-semibold text-secondary-dark">Interdisciplinary Approach</h3>
							<p class="mb-0 text-base leading-relaxed">
								The research community in IOE has always been aware of the importance of developing
								interactions between numerous social sciences in order to make advances. The community
								of researchers who form the IOEA is composed not only of economists but also of
								political scientists, lawyers, sociologists and management scientists who work on
								intricate matters such as contracts, organizations and institutions.
							</p>
						</div>
					</div>

					<h2 class="pb-2 mt-12 mb-6 text-2xl border-b-2 text-primary border-secondary">Fostering Young Researchers</h2>
					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-6 text-text">
						Beyond the will to promote IOE research, another major target of the academy is to
						foster its development among young researchers, to identify promising talents, and
						to spread their work within the community.
					</p>
					<p class="text-base sm:text-[1.05rem] leading-relaxed mb-0 text-text">
						PhD candidates, Post-doc., as well as young professors, benefit from both a high-level
						training and a chance to fit into the international network of the IOE. Moreover, the
						academy enables an international network of researchers able to work together to be
						built up gradually.
					</p>
				</article>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


