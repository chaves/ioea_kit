<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
	<title>Organization | IOEA</title>
	<meta name="description" content="Learn about how the IOEA is organized: lectures, workshops, seminars, and networking opportunities." />
</svelte:head>

<PageHeader title="Organization" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<article>
					<div class="mt-0 pt-0 border-t-0">
						<h2 class="text-primary mb-4 pb-2 border-b-2 border-secondary">Lectures</h2>
						<p class="text-[1.05rem] leading-relaxed mb-4">
							Each morning features two lectures by internationally renowned researchers,
							covering broad subjects within IOE. Lecturers provide summaries of existing
							literature, discuss main research questions, and explore implications for
							public policies.
						</p>
						<p class="text-[1.05rem] leading-relaxed mb-0">
							Topics include institutions and economic growth, economics of formal and
							informal contracts, economics of organizations, and theories of institutional changes.
						</p>
					</div>

					<div class="mt-10 pt-8 border-t border-border">
						<h2 class="text-primary mb-4 pb-2 border-b-2 border-secondary">Workshops</h2>
						<p class="text-[1.05rem] leading-relaxed mb-6">
							Afternoon sessions consist of two parallel workshops, allowing participants
							to choose based on their interests:
						</p>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
							<div class="bg-bg-alt p-6 rounded-lg border-l-4 border-secondary">
								<h3 class="text-lg mb-3">Thematic Workshops</h3>
								<p class="text-sm m-0">
									Focus on specific research questions, presenting recent developments,
									controversies, and debates within a single theme, such as the economics
									of relational contracts. These workshops facilitate in-depth discussions
									and knowledge sharing.
								</p>
							</div>

							<div class="bg-bg-alt p-6 rounded-lg border-l-4 border-secondary">
								<h3 class="text-lg mb-3">Methodology Workshops</h3>
								<p class="text-sm m-0">
									Concentrate on particular techniques, aiming to familiarize students
									with specific methods applicable to their research. Examples include
									experimental economics, econometrics of contracts, and qualitative
									case study techniques.
								</p>
							</div>
						</div>
					</div>

					<div class="mt-10 pt-8 border-t border-border">
						<h2 class="text-primary mb-4 pb-2 border-b-2 border-secondary">Thesis Seminars</h2>
						<p class="text-[1.05rem] leading-relaxed mb-0">
							Evening sessions are dedicated to seminars where participants present their
							research projects or working papers. These sessions foster collective discussions,
							with feedback from peers and faculty members, enhancing the quality and direction
							of individual research.
						</p>
					</div>

					<div class="mt-10 pt-8 border-t border-border">
						<h2 class="text-primary mb-4 pb-2 border-b-2 border-secondary">Lunch Sessions</h2>
						<p class="text-[1.05rem] leading-relaxed mb-0">
							Introduced in 2012, these short sessions from Tuesday to Friday address key
							aspects of academic life, such as journal submission processes, job markets,
							and non-academic careers. Participants engage in discussions with experienced
							scholars, gaining valuable insights into professional development.
						</p>
					</div>

					<div class="mt-10 pt-8 border-t border-border">
						<h2 class="text-primary mb-4 pb-2 border-b-2 border-secondary">Informal Interactions</h2>
						<p class="text-[1.05rem] leading-relaxed mb-4">
							Beyond formal sessions, IOEA emphasizes informal interactions between participants
							and faculty. The academy organizes events to encourage networking, fostering
							collaborations that often lead to joint research projects and publications.
						</p>
						<p class="text-[1.05rem] leading-relaxed mb-0">
							This network effect has resulted in numerous scientific collaborations among participants.
						</p>
					</div>

					<div class="mt-10 pt-8 border-t border-border text-center">
						<a href="/sponsors" class="btn btn-secondary no-underline">View Our Sponsors</a>
					</div>
				</article>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


