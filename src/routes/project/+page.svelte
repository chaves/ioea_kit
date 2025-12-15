<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
	<title>Goals of the IOEA | Institutional and Organizational Economics Academy</title>
	<meta name="description" content="The IOEA aims to promote advanced and original research on institutional and organizational economics." />
</svelte:head>

<PageHeader title="Goals of the IOEA" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<article>
					<p class="text-xl text-text-light leading-relaxed mb-6">
						The IOEA aims to promote advanced and original research on institutional and
						organizational economics. Institutional and organizational economics (IOE) has
						been one of the most prolific fields of research during the past forty years.
					</p>

					<p class="text-[1.05rem] leading-relaxed mb-5">
						It combines theoretical and empirical analyses of the diversity of mechanisms,
						formal and informal, allowing coordination between agents, interaction between
						these different mechanisms and their consequences on economic performances and dynamics.
					</p>

					<h2 class="text-primary mt-10 mb-4 pb-2 border-b-2 border-secondary">Two Strong Traditions</h2>
					<p class="text-[1.05rem] leading-relaxed mb-5">IOE is characterized by two strong traditions:</p>

					<div class="flex flex-col gap-6 my-6">
						<div class="bg-bg-alt p-6 rounded-lg border-l-4 border-secondary">
							<h3 class="text-secondary-dark mb-3 text-lg">Operationalization</h3>
							<p class="text-sm mb-3">
								Its constant attention to operationalization. This research program aims at
								developing analyses leading to empirically refutable propositions. The continuous
								round trip between theoretical developments and empirical analyses result into
								operational propositions for both researchers, and public and private decision-makers.
							</p>
							<p class="text-sm mb-0">
								It explains why today IOEA alumni hold positions not only in the academia,
								but also in governmental or international agencies, and even in businesses.
							</p>
						</div>

						<div class="bg-bg-alt p-6 rounded-lg border-l-4 border-secondary">
							<h3 class="text-secondary-dark mb-3 text-lg">Interdisciplinary Approach</h3>
							<p class="text-sm mb-0">
								The research community in IOE has always been aware of the importance of developing
								interactions between numerous social sciences in order to make advances. The community
								of researchers who form the IOEA is composed not only of economists but also of
								political scientists, lawyers, sociologists and management scientists who work on
								intricate matters such as contracts, organizations and institutions.
							</p>
						</div>
					</div>

					<h2 class="text-primary mt-10 mb-4 pb-2 border-b-2 border-secondary">Fostering Young Researchers</h2>
					<p class="text-[1.05rem] leading-relaxed mb-5">
						Beyond the will to promote IOE research, another major target of the academy is to
						foster its development among young researchers, to identify promising talents, and
						to spread their work within the community.
					</p>
					<p class="text-[1.05rem] leading-relaxed mb-0">
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


