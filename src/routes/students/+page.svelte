<script lang="ts">
	import { config } from '$lib/config';

	interface Props {
		data: {
			session: { name: string };
			student: {
				id: number;
				firstName: string;
				lastName: string;
				email: string;
				university: string | null;
				department: string | null;
				photo: string | null;
				paper: { title: string | null; abstract: string | null } | null;
				group: number | null;
				travel: {
					arrivalDate: Date | null;
					departureDate: Date | null;
					arrivalTransfer: number | null;
					departureTransfer: number | null;
				} | null;
			} | null;
		};
	}

	let { data }: Props = $props();

	function formatDate(date: Date | null): string {
		if (!date) return 'Not set';
		return new Date(date).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getTransferLabel(transfer: number | null): string {
		const labels = config.transfer.arrival;
		return transfer ? labels[transfer] ?? 'Unknown' : 'Not set';
	}
</script>

<svelte:head>
	<title>Student Dashboard | IOEA {config.currentYear}</title>
</svelte:head>

<div class="container">
	<div class="welcome-section">
		<h1>Welcome, {data.student?.firstName ?? 'Student'}!</h1>
		<p>Manage your IOEA {config.currentYear} participation details.</p>
	</div>

	{#if data.student}
		<div class="dashboard-grid">
			<!-- Profile Card -->
			<div class="card profile-card">
				<div class="card-header">
					<h2>Your Profile</h2>
				</div>
				<div class="card-body">
					<div class="profile-info">
						{#if data.student.photo}
							<img
								src={`/images/students/${data.student.photo}`}
								alt="{data.student.firstName} {data.student.lastName}"
								class="profile-photo"
							/>
						{:else}
							<div class="profile-photo-placeholder">
								{data.student.firstName[0]}{data.student.lastName[0]}
							</div>
						{/if}
						<div class="profile-details">
							<h3>{data.student.firstName} {data.student.lastName}</h3>
							<p>{data.student.email}</p>
							<p>{data.student.university ?? 'University not set'}</p>
							{#if data.student.group}
								<span class="group-badge">Group {data.student.group}</span>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Paper Card -->
			<div class="card">
				<div class="card-header">
					<h2>Your Paper</h2>
				</div>
				<div class="card-body">
					{#if data.student.paper}
						<h3 class="paper-title">{data.student.paper.title ?? 'No title'}</h3>
						{#if data.student.paper.abstract}
							<p class="paper-abstract">{data.student.paper.abstract}</p>
						{/if}
					{:else}
						<p class="no-data">No paper information yet.</p>
					{/if}
				</div>
			</div>

			<!-- Travel Card -->
			<div class="card">
				<div class="card-header">
					<h2>Travel Information</h2>
				</div>
				<div class="card-body">
					{#if data.student.travel}
						<div class="travel-info">
							<div class="travel-item">
								<span class="label">Arrival</span>
								<span class="value">{formatDate(data.student.travel.arrivalDate)}</span>
								<span class="sub">{getTransferLabel(data.student.travel.arrivalTransfer)}</span>
							</div>
							<div class="travel-item">
								<span class="label">Departure</span>
								<span class="value">{formatDate(data.student.travel.departureDate)}</span>
								<span class="sub">{getTransferLabel(data.student.travel.departureTransfer)}</span>
							</div>
						</div>
					{:else}
						<p class="no-data">No travel information yet. Please complete the survey.</p>
						<a href="/students/survey" class="btn btn-primary">Complete Survey</a>
					{/if}
				</div>
			</div>

			<!-- Quick Links -->
			<div class="card">
				<div class="card-header">
					<h2>Quick Links</h2>
				</div>
				<div class="card-body">
					<div class="quick-links">
						<a href="/students/survey" class="quick-link">
							<span class="icon">📋</span>
							<span>Participant Survey</span>
						</a>
						<a href="/ioea/{config.currentYear}" class="quick-link">
							<span class="icon">📅</span>
							<span>Program</span>
						</a>
						<a href="/ioea/{config.currentYear}/students" class="quick-link">
							<span class="icon">👥</span>
							<span>All Participants</span>
						</a>
						<a href="/ioea/{config.currentYear}/informations" class="quick-link">
							<span class="icon">ℹ️</span>
							<span>Practical Info</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="alert alert-error">
			Unable to load your profile. Please contact support.
		</div>
	{/if}
</div>

<style>
	.welcome-section {
		margin-bottom: 2rem;
	}

	.welcome-section h1 {
		margin-bottom: 0.5rem;
	}

	.welcome-section p {
		color: var(--color-text-light);
		font-size: 1.1rem;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.card {
		background: white;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		overflow: hidden;
	}

	.card-header {
		padding: 1rem 1.5rem;
		background: var(--color-bg-alt);
		border-bottom: 1px solid var(--color-border);
	}

	.card-header h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.card-body {
		padding: 1.5rem;
	}

	.profile-card {
		grid-column: span 2;
	}

	.profile-info {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.profile-photo {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		object-fit: cover;
	}

	.profile-photo-placeholder {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: var(--color-primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: 600;
	}

	.profile-details h3 {
		margin: 0 0 0.5rem 0;
	}

	.profile-details p {
		margin: 0 0 0.25rem 0;
		color: var(--color-text-light);
	}

	.group-badge {
		display: inline-block;
		margin-top: 0.5rem;
		padding: 0.25rem 0.75rem;
		background: var(--color-secondary);
		color: white;
		border-radius: 1rem;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.paper-title {
		margin: 0 0 1rem 0;
		font-size: 1.1rem;
	}

	.paper-abstract {
		color: var(--color-text-light);
		line-height: 1.6;
		margin: 0;
	}

	.travel-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.travel-item {
		padding: 1rem;
		background: var(--color-bg-alt);
		border-radius: 0.375rem;
	}

	.travel-item .label {
		display: block;
		font-size: 0.85rem;
		color: var(--color-text-light);
		margin-bottom: 0.25rem;
	}

	.travel-item .value {
		display: block;
		font-weight: 600;
	}

	.travel-item .sub {
		display: block;
		font-size: 0.9rem;
		color: var(--color-text-light);
	}

	.no-data {
		color: var(--color-text-light);
		margin-bottom: 1rem;
	}

	.quick-links {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.quick-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--color-bg-alt);
		border-radius: 0.375rem;
		color: var(--color-text);
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.quick-link:hover {
		background: var(--color-primary);
		color: white;
	}

	.quick-link .icon {
		font-size: 1.25rem;
	}

	@media (max-width: 767px) {
		.dashboard-grid {
			grid-template-columns: 1fr;
		}

		.profile-card {
			grid-column: span 1;
		}

		.profile-info {
			flex-direction: column;
			text-align: center;
		}

		.quick-links {
			grid-template-columns: 1fr;
		}
	}
</style>

