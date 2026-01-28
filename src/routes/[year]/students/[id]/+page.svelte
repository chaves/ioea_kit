<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';

	interface Props {
		data: {
			year: number;
			student: {
				id: number;
				firstName: string;
				lastName: string;
				email: string | null;
				university: string | null;
				country: string | null;
				nationality: string | null;
				photo: string | null;
			};
			paper: {
				title: string | null;
				abstract: string | null;
				file: string | null;
			} | null;
			groupId: number | null;
		};
	}

	let { data }: Props = $props();

	const fullName = `${data.student.firstName} ${data.student.lastName}`;
	const seoDescription = $derived(data.paper?.abstract ? data.paper.abstract.substring(0, 160) : `Profile of ${fullName}, participant at IOEA ${data.year}.`);
</script>

<SEO
	title="{fullName} - IOEA {data.year}"
	description={seoDescription}
	ogType="article"
	ogImage={data.student.photo ? `/images/students/${data.student.photo}` : '/site-logo.png'}
/>

<PageHeader title={fullName} />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<nav class="flex items-center gap-2 mb-8 text-sm">
					<a href="/{data.year}" class="text-primary no-underline hover:underline">IOEA {data.year}</a>
					<span class="text-text-light">/</span>
					<a href="/{data.year}/students" class="text-primary no-underline hover:underline">Participants</a>
					<span class="text-text-light">/</span>
					<span class="text-text">{data.student.lastName}, {data.student.firstName}</span>
				</nav>

				<div class="bg-white rounded-lg border border-border overflow-hidden">
					<div class="flex flex-col sm:flex-row gap-8 p-8 border-b border-border">
						<div class="flex-shrink-0 w-[180px] h-[180px] sm:w-[180px] sm:h-[180px] rounded-lg overflow-hidden bg-bg-alt mx-auto sm:mx-0">
							{#if data.student.photo}
								<img
									src={`/images/students/${data.student.photo}`}
									alt={fullName}
									class="w-full h-full object-cover"
									onerror={(e) => { e.currentTarget.src = '/images/placeholder-person.jpg'; }}
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center bg-primary text-white text-5xl font-semibold">
									{data.student.firstName[0]}{data.student.lastName[0]}
								</div>
							{/if}
						</div>

						<div class="flex-1 text-center sm:text-left">
							<h2 class="text-primary mb-6 text-3xl">{fullName}</h2>

							{#if data.student.university}
								<div class="mb-3">
									<span class="block text-xs uppercase tracking-wide text-text-light mb-1">University / Institution</span>
									<span class="text-base text-text">{data.student.university}</span>
								</div>
							{/if}

							{#if data.student.country}
								<div class="mb-3">
									<span class="block text-xs uppercase tracking-wide text-text-light mb-1">Country</span>
									<span class="text-base text-text">{data.student.country}</span>
								</div>
							{/if}

							{#if data.student.nationality}
								<div class="mb-3">
									<span class="block text-xs uppercase tracking-wide text-text-light mb-1">Nationality</span>
									<span class="text-base text-text">{data.student.nationality}</span>
								</div>
							{/if}

							{#if data.groupId}
								<div class="mb-3">
									<span class="block text-xs uppercase tracking-wide text-text-light mb-1">Seminar Group</span>
									<a href="/{data.year}/students" class="inline-block px-3 py-1 bg-secondary text-white text-sm font-semibold rounded no-underline hover:bg-primary">
										Group {data.groupId}
									</a>
								</div>
							{/if}
						</div>
					</div>

					{#if data.paper}
						<div class="p-8">
							<h3 class="text-primary mb-4 pb-2 border-b-2 border-secondary">Paper / Research Project</h3>
							{#if data.paper.title}
								<h4 class="text-xl text-text mb-6 leading-relaxed">{data.paper.title}</h4>
							{/if}

							{#if data.paper.abstract}
								<div class="mb-6">
									<h5 class="text-sm uppercase tracking-wide text-text-light mb-2">Abstract</h5>
									<p class="leading-loose text-text text-justify">{data.paper.abstract}</p>
								</div>
							{/if}

							{#if data.paper.file}
								<a href="/uploads/papers/{data.paper.file}" class="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-white rounded-md no-underline font-medium transition-colors duration-200 hover:bg-secondary" download>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="7 10 12 15 17 10" />
										<line x1="12" y1="15" x2="12" y2="3" />
									</svg>
									Download Paper
								</a>
							{/if}
						</div>
					{:else}
						<div class="p-8 bg-bg-alt">
							<h3 class="text-primary mb-4 pb-2 border-b-2 border-secondary">Paper / Research Project</h3>
							<p class="text-text-light italic">Paper details have not been uploaded yet.</p>
						</div>
					{/if}
				</div>

				<div class="mt-8">
					<a href="/{data.year}/students" class="inline-flex items-center px-6 py-3 bg-bg-alt text-primary rounded-md no-underline font-medium transition-all duration-200 hover:bg-primary hover:text-white">
						← Back to Participants
					</a>
				</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>


