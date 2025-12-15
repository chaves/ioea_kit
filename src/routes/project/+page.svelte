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
		<div class="main-grid">
			<div class="main-content">
				<article class="content">
					<p class="lead">
						The IOEA aims to promote advanced and original research on institutional and
						organizational economics. Institutional and organizational economics (IOE) has
						been one of the most prolific fields of research during the past forty years.
					</p>

					<p>
						It combines theoretical and empirical analyses of the diversity of mechanisms,
						formal and informal, allowing coordination between agents, interaction between
						these different mechanisms and their consequences on economic performances and dynamics.
					</p>

					<h2>Two Strong Traditions</h2>
					<p>IOE is characterized by two strong traditions:</p>

					<div class="traditions">
						<div class="tradition-card">
							<h3>Operationalization</h3>
							<p>
								Its constant attention to operationalization. This research program aims at
								developing analyses leading to empirically refutable propositions. The continuous
								round trip between theoretical developments and empirical analyses result into
								operational propositions for both researchers, and public and private decision-makers.
							</p>
							<p>
								It explains why today IOEA alumni hold positions not only in the academia,
								but also in governmental or international agencies, and even in businesses.
							</p>
						</div>

						<div class="tradition-card">
							<h3>Interdisciplinary Approach</h3>
							<p>
								The research community in IOE has always been aware of the importance of developing
								interactions between numerous social sciences in order to make advances. The community
								of researchers who form the IOEA is composed not only of economists but also of
								political scientists, lawyers, sociologists and management scientists who work on
								intricate matters such as contracts, organizations and institutions.
							</p>
						</div>
					</div>

					<h2>Fostering Young Researchers</h2>
					<p>
						Beyond the will to promote IOE research, another major target of the academy is to
						foster its development among young researchers, to identify promising talents, and
						to spread their work within the community.
					</p>
					<p>
						PhD candidates, Post-doc., as well as young professors, benefit from both a high-level
						training and a chance to fit into the international network of the IOE. Moreover, the
						academy enables an international network of researchers able to work together to be
						built up gradually.
					</p>
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
		line-height: 1.7;
		margin-bottom: 1.5rem;
	}

	.content h2 {
		color: var(--color-primary);
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.content p {
		font-size: 1.05rem;
		line-height: 1.7;
		margin-bottom: 1.25rem;
	}

	.traditions {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin: 1.5rem 0;
	}

	.tradition-card {
		background: var(--color-bg-alt);
		padding: 1.5rem;
		border-radius: 0.5rem;
		border-left: 4px solid var(--color-secondary);
	}

	.tradition-card h3 {
		color: var(--color-secondary-dark);
		margin-bottom: 0.75rem;
		font-size: 1.1rem;
	}

	.tradition-card p {
		font-size: 0.95rem;
		margin-bottom: 0.75rem;
	}

	.tradition-card p:last-child {
		margin-bottom: 0;
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
</style>

