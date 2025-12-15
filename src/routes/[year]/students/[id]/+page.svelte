<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

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
</script>

<svelte:head>
	<title>{fullName} - IOEA {data.year}</title>
	<meta name="description" content="Profile of {fullName}, participant at IOEA {data.year}." />
</svelte:head>

<PageHeader title={fullName} />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<nav class="breadcrumb">
					<a href="/{data.year}">IOEA {data.year}</a>
					<span>/</span>
					<a href="/{data.year}/students">Participants</a>
					<span>/</span>
					<span class="current">{data.student.lastName}, {data.student.firstName}</span>
				</nav>

				<div class="student-profile">
					<div class="profile-header">
						<div class="profile-photo">
							{#if data.student.photo}
								<img
									src={`/images/students/${data.student.photo}`}
									alt={fullName}
									onerror={(e) => { e.currentTarget.src = '/images/placeholder-person.jpg'; }}
								/>
							{:else}
								<div class="photo-placeholder">
									{data.student.firstName[0]}{data.student.lastName[0]}
								</div>
							{/if}
						</div>

						<div class="profile-info">
							<h2>{fullName}</h2>

							{#if data.student.university}
								<div class="info-item">
									<span class="label">University / Institution</span>
									<span class="value">{data.student.university}</span>
								</div>
							{/if}

							{#if data.student.country}
								<div class="info-item">
									<span class="label">Country</span>
									<span class="value">{data.student.country}</span>
								</div>
							{/if}

							{#if data.student.nationality}
								<div class="info-item">
									<span class="label">Nationality</span>
									<span class="value">{data.student.nationality}</span>
								</div>
							{/if}

							{#if data.groupId}
								<div class="info-item">
									<span class="label">Seminar Group</span>
									<a href="/{data.year}/students" class="group-badge">
										Group {data.groupId}
									</a>
								</div>
							{/if}
						</div>
					</div>

					{#if data.paper}
						<div class="paper-section">
							<h3>Paper / Research Project</h3>
							{#if data.paper.title}
								<h4 class="paper-title">{data.paper.title}</h4>
							{/if}

							{#if data.paper.abstract}
								<div class="paper-abstract">
									<h5>Abstract</h5>
									<p>{data.paper.abstract}</p>
								</div>
							{/if}

							{#if data.paper.file}
								<a href="/uploads/papers/{data.paper.file}" class="download-btn" download>
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
						<div class="paper-section empty">
							<h3>Paper / Research Project</h3>
							<p class="no-paper">Paper details have not been uploaded yet.</p>
						</div>
					{/if}
				</div>

				<div class="actions">
					<a href="/{data.year}/students" class="btn-back">
						← Back to Participants
					</a>
				</div>
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

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
		font-size: 0.9rem;
	}

	.breadcrumb a {
		color: var(--color-primary);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.breadcrumb span {
		color: var(--color-text-light);
	}

	.breadcrumb .current {
		color: var(--color-text);
	}

	.student-profile {
		background: white;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		overflow: hidden;
	}

	.profile-header {
		display: flex;
		gap: 2rem;
		padding: 2rem;
		border-bottom: 1px solid var(--color-border);
	}

	.profile-photo {
		flex-shrink: 0;
		width: 180px;
		height: 180px;
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--color-bg-alt);
	}

	.profile-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.photo-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-primary);
		color: white;
		font-size: 3rem;
		font-weight: 600;
	}

	.profile-info {
		flex: 1;
	}

	.profile-info h2 {
		color: var(--color-primary);
		margin-bottom: 1.5rem;
		font-size: 1.75rem;
	}

	.info-item {
		margin-bottom: 0.75rem;
	}

	.info-item .label {
		display: block;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-light);
		margin-bottom: 0.25rem;
	}

	.info-item .value {
		color: var(--color-text);
		font-size: 1rem;
	}

	.group-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: var(--color-secondary);
		color: white;
		font-size: 0.9rem;
		font-weight: 600;
		border-radius: 0.25rem;
		text-decoration: none;
	}

	.group-badge:hover {
		background: var(--color-primary);
	}

	.paper-section {
		padding: 2rem;
	}

	.paper-section h3 {
		color: var(--color-primary);
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-secondary);
	}

	.paper-title {
		font-size: 1.25rem;
		color: var(--color-text);
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}

	.paper-abstract h5 {
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-light);
		margin-bottom: 0.5rem;
	}

	.paper-abstract p {
		line-height: 1.7;
		color: var(--color-text);
		text-align: justify;
	}

	.download-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--color-primary);
		color: white;
		border-radius: 0.375rem;
		text-decoration: none;
		font-weight: 500;
		transition: background 0.2s ease;
	}

	.download-btn:hover {
		background: var(--color-secondary);
	}

	.paper-section.empty {
		background: var(--color-bg-alt);
	}

	.no-paper {
		color: var(--color-text-light);
		font-style: italic;
	}

	.actions {
		margin-top: 2rem;
	}

	.btn-back {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background: var(--color-bg-alt);
		color: var(--color-primary);
		border-radius: 0.375rem;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.btn-back:hover {
		background: var(--color-primary);
		color: white;
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

	@media (max-width: 600px) {
		.profile-header {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.profile-photo {
			width: 150px;
			height: 150px;
		}

		.info-item .label {
			text-align: center;
		}
	}
</style>

