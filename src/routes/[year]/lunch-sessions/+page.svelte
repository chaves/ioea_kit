<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';

	interface Props {
		data: {
			year: number;
		};
	}

	let { data }: Props = $props();

	const sessions = [
		{
			number: 'I',
			title: 'Dissertation',
			content: `The dissertation process implies that you can successfully write up in a limited time. Your dissertation might be the longest piece of writing you have ever had to do, so you might see the process as endless. You could lose your motivation or be confused at different points of your dissertation or be unable to manage your writing time. This session goes through these different points. It seeks to answer the following questions: how to manage time? Should we write a little bit every day or plan an overall work schedule including readings, testing and writing? What should the structure of the dissertation look like? How often should I meet with my supervisor? When is a chapter ready for a seminar?`
		},
		{
			number: 'II',
			title: 'Publication Process',
			content: `Publication is a key element of succeeding in academia — not only a tenure requirement, but increasingly prominent even at the job market stage. It takes a lot of time to polish a paper for submission: building up the motivation, clearly stating the contribution, laying out the methodology and presenting the results. With other duties like finishing a dissertation, applying for jobs, teaching and administrative tasks, finding the optimal balance between research and other commitments remains a challenge throughout one's career.`,
			items: [
				'How to polish the final draft for submission?',
				'When can we consider a paper is ready for submission?',
				'How to select a journal?',
				'How to address an R&R?',
				'If a paper gets rejected, how to incorporate comments?',
				'After rejection — how to choose the next journal?',
				'How to balance research along with academic and non-academic job requirements?'
			]
		},
		{
			number: 'III',
			title: 'Being on the Job Market',
			content: `The job market process is extremely stressful. Two dimensions are particularly critical: the application file (CV, cover letters, teaching statement, research statement, and recommendation letters) and the job talk. Senior scholars will provide useful tips on polishing CVs and cover letters, writing research or teaching statements, and preparing the job talk. Issues like how to schedule interviews, whether to start with your best interviews or not, and how to handle too many invitations will also be addressed.`
		},
		{
			number: 'IV',
			title: 'Funding Research',
			content: `Research requires funding: many agencies are willing to help. Getting a post-doc or grants available to travel and build new research networks is one of the key challenges. Where should you investigate these opportunities? When should you apply? How should you apply? These questions and more will be discussed in this fourth session.`
		}
	];
</script>

<SEO
	title="Lunch Sessions - IOEA {data.year}"
	description="Short sessions focused on the practical aspects of the Ph.D. process and academic career at IOEA {data.year}."
/>

<PageHeader title="Lunch Sessions - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">

				<div class="bg-bg-alt p-6 rounded-xl border border-border mb-10">
					<p class="text-base leading-relaxed text-text m-0">
						<strong>Mission:</strong> The purpose of these short sessions is to focus on the practical aspects of the Ph.D. process and more broadly on the academic career. Unlike other sessions at IOEA (lectures, workshops and seminars), these sessions are much shorter and do not focus on research issues. Rather, they are devoted to discussing answers to questions that Ph.D. students and young scholars face all the time. Close interactions between participants and faculty are one of the characterizing features. Since the sessions aim to find answers to questions that participants most likely have, participant involvement is sought a week before IOEA starts.
					</p>
				</div>

				<p class="text-base leading-relaxed text-text mb-10">
					The sessions address four main dimensions: (1) managing the dissertation; (2) the publication process; (3) the job market; and (4) careers for academics outside academia.
				</p>

				<div class="flex flex-col gap-6">
					{#each sessions as session}
						<div class="border border-border rounded-xl overflow-hidden">
							<div class="bg-primary px-6 py-4 flex items-center gap-4">
								<span class="text-white/60 text-sm font-bold uppercase tracking-widest">Session {session.number}</span>
								<h2 class="text-white text-xl font-bold m-0">{session.title}</h2>
							</div>
							<div class="p-6">
								<p class="text-base leading-relaxed text-text m-0 mb-0">{session.content}</p>
								{#if session.items}
									<ul class="mt-4 space-y-2 pl-0 list-none">
										{#each session.items as item}
											<li class="flex items-start gap-2 text-base text-text leading-relaxed">
												<span class="text-secondary font-bold flex-shrink-0 mt-0.5">→</span>
												{item}
											</li>
										{/each}
									</ul>
								{/if}
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
