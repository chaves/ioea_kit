<script lang="ts">
	let { data } = $props();

	const profileValidated = $derived(data.validatedSections.includes('profile'));
	const paperValidated = $derived(data.validatedSections.includes('paper'));
	const travelValidated = $derived(data.validatedSections.includes('travel'));

	const allValidated = $derived(
		profileValidated && (data.paper === null || paperValidated) && travelValidated
	);

	const photoUrl = $derived(
		data.profile.photo ? `/student-photos/${data.profile.photo}` : null
	);

	const initials = $derived(
		`${data.profile.firstName[0] ?? ''}${data.profile.lastName[0] ?? ''}`.toUpperCase()
	);
</script>

<svelte:head>
	<title>Student Area | IOEA {data.year}</title>
</svelte:head>

<div class="admin-page">
	<header class="page-header-inner">
		<div>
			<h1>Student Area — IOEA {data.year}</h1>
			<p class="subtitle">Complete and validate each section before the deadline.</p>
		</div>
		{#if allValidated}
			<span class="badge-all-done">
				<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
				All sections validated
			</span>
		{/if}
	</header>

	{#if !data.hasSubmission}
		<div class="notice-card">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="8" x2="12" y2="12"></line>
				<line x1="12" y1="16" x2="12.01" y2="16"></line>
			</svg>
			<div>
				<strong>No accepted submission found for {data.year}</strong>
				<p>If you believe this is an error, please contact the coordinator.</p>
			</div>
		</div>
	{/if}

	<div class="cards">
		<!-- Profile -->
		<a href="/auth/student/profile" class="card {profileValidated ? 'card-validated' : ''}">
			<div class="card-icon">
				{#if photoUrl}
					<img src={photoUrl} alt="" class="avatar" />
				{:else}
					<div class="avatar-placeholder">{initials}</div>
				{/if}
			</div>
			<div class="card-body">
				<div class="card-title">
					Profile
					{#if profileValidated}
						<span class="badge-ok">
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
							Validated
						</span>
					{:else}
						<span class="badge-todo">To complete</span>
					{/if}
				</div>
				<p class="card-desc">
					{data.profile.firstName} {data.profile.lastName}
					{#if data.profile.university} · {data.profile.university}{/if}
					{#if !data.profile.photo}<span class="missing"> · Photo missing</span>{/if}
				</p>
			</div>
			<div class="card-arrow">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
			</div>
		</a>

		<!-- Paper -->
		{#if data.paper !== null}
			<a href="/auth/student/paper" class="card {paperValidated ? 'card-validated' : ''}">
				<div class="card-icon">
					<div class="icon-wrap {paperValidated ? 'icon-green' : 'icon-gray'}">
						<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
							<polyline points="14 2 14 8 20 8"></polyline>
						</svg>
					</div>
				</div>
				<div class="card-body">
					<div class="card-title">
						Paper / Project
						{#if paperValidated}
							<span class="badge-ok">
								<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
								Validated
							</span>
						{:else}
							<span class="badge-todo">To complete</span>
						{/if}
					</div>
					<p class="card-desc">
						{#if data.paper.title}{data.paper.title}{:else}<span class="missing">No title yet</span>{/if}
						{#if !data.paper.hasFile}<span class="missing"> · No file uploaded</span>{/if}
					</p>
				</div>
				<div class="card-arrow">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
				</div>
			</a>
		{/if}

		<!-- Travel -->
		<a href="/auth/student/travel" class="card {travelValidated ? 'card-validated' : ''}">
			<div class="card-icon">
				<div class="icon-wrap {travelValidated ? 'icon-green' : 'icon-gray'}">
					<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16v.92"></path>
					</svg>
				</div>
			</div>
			<div class="card-body">
				<div class="card-title">
					Travel
					{#if travelValidated}
						<span class="badge-ok">
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
							Validated
						</span>
					{:else}
						<span class="badge-todo">To complete</span>
					{/if}
				</div>
				<p class="card-desc">
					{#if data.travel?.arrivalDate}
						Arrival {data.travel.arrivalDate}
						{#if data.travel.departureDate} · Departure {data.travel.departureDate}{/if}
					{:else}
						<span class="missing">No travel info yet</span>
					{/if}
				</p>
			</div>
			<div class="card-arrow">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
			</div>
		</a>
	</div>
</div>

<style>
	.admin-page {
		padding: 2rem 2.5rem;
		max-width: 700px;
	}

	.page-header-inner {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-primary);
		margin: 0 0 0.25rem;
	}

	.subtitle {
		font-size: 0.875rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0;
	}

	.badge-all-done {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 1rem;
		background: #dcfce7;
		color: #166534;
		border-radius: 9999px;
		font-size: 0.8rem;
		font-weight: 700;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.notice-card {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		background: #fefce8;
		border: 1px solid #fde047;
		border-radius: 0.5rem;
		color: #854d0e;
		margin-bottom: 1.5rem;
	}

	.notice-card p { margin: 0.25rem 0 0; font-size: 0.9rem; }

	/* Cards */
	.cards {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.card {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.25rem 1.5rem;
		background: white;
		border: 2px solid var(--color-border);
		border-radius: 0.625rem;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(93, 74, 120, 0.12);
	}

	.card.card-validated {
		border-color: #86efac;
		background: #f0fdf4;
	}

	.card.card-validated:hover {
		border-color: #4ade80;
	}

	.card-icon { flex-shrink: 0; }

	.avatar {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--color-border);
	}

	.avatar-placeholder {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--color-primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.3rem;
		font-weight: 700;
	}

	.icon-wrap {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-green { background: #dcfce7; color: #166534; }
	.icon-gray { background: #f3f4f6; color: #6b7280; }

	.card-body { flex: 1; min-width: 0; }

	.card-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-text, #111827);
		margin-bottom: 0.2rem;
	}

	.card-desc {
		font-size: 0.875rem;
		color: var(--color-text-muted, #6b7280);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.missing { color: #dc2626; font-style: italic; }

	.badge-ok {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.15rem 0.55rem;
		background: #dcfce7;
		color: #166534;
		border-radius: 9999px;
		font-size: 0.72rem;
		font-weight: 700;
	}

	.badge-todo {
		display: inline-flex;
		align-items: center;
		padding: 0.15rem 0.55rem;
		background: #f3f4f6;
		color: #6b7280;
		border-radius: 9999px;
		font-size: 0.72rem;
		font-weight: 600;
	}

	.card-arrow {
		flex-shrink: 0;
		color: var(--color-text-muted, #9ca3af);
	}

	@media (max-width: 640px) {
		.admin-page { padding: 1.25rem; }
		.page-header-inner { flex-direction: column; align-items: flex-start; }
	}
</style>
