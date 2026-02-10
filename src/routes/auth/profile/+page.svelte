<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		data: {
			user: {
				name: string;
				email: string;
			};
		};
		form?: {
			error?: string;
			profileSuccess?: boolean;
			passwordSuccess?: boolean;
			passwordError?: string;
			name?: string;
			email?: string;
		};
	}

	let { data, form }: Props = $props();
	let loadingProfile = $state(false);
	let loadingPassword = $state(false);
</script>

<svelte:head>
	<title>My Profile | IOEA</title>
</svelte:head>

<div class="admin-page">
	<header class="auth-header">
		<h1>My Profile</h1>
	</header>

	<div class="profile-sections">
		<section class="profile-card">
			<h2>Personal Information</h2>

			{#if form?.profileSuccess}
				<div class="alert alert-success">Profile updated successfully.</div>
			{/if}

			{#if form?.error}
				<div class="alert alert-error">{form.error}</div>
			{/if}

			<form
				method="POST"
				action="?/updateProfile"
				use:enhance={() => {
					loadingProfile = true;
					return async ({ update }) => {
						loadingProfile = false;
						await update();
					};
				}}
			>
				<div class="form-group">
					<label for="name" class="form-label">Name</label>
					<input
						type="text"
						id="name"
						name="name"
						class="form-input"
						required
						value={form?.name ?? data.user.name}
					/>
				</div>

				<div class="form-group">
					<label for="email" class="form-label">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						class="form-input"
						required
						value={form?.email ?? data.user.email}
					/>
				</div>

				<button type="submit" class="btn btn-primary" disabled={loadingProfile}>
					{#if loadingProfile}
						Saving...
					{:else}
						Save Changes
					{/if}
				</button>
			</form>
		</section>

		<section class="profile-card">
			<h2>Change Password</h2>

			{#if form?.passwordSuccess}
				<div class="alert alert-success">Password changed successfully.</div>
			{/if}

			{#if form?.passwordError}
				<div class="alert alert-error">{form.passwordError}</div>
			{/if}

			<form
				method="POST"
				action="?/changePassword"
				use:enhance={() => {
					loadingPassword = true;
					return async ({ update }) => {
						loadingPassword = false;
						await update();
					};
				}}
			>
				<div class="form-group">
					<label for="currentPassword" class="form-label">Current Password</label>
					<input
						type="password"
						id="currentPassword"
						name="currentPassword"
						class="form-input"
						required
					/>
				</div>

				<div class="form-group">
					<label for="password" class="form-label">New Password</label>
					<input
						type="password"
						id="password"
						name="password"
						class="form-input"
						required
						minlength="8"
						placeholder="Minimum 8 characters"
					/>
				</div>

				<div class="form-group">
					<label for="confirmPassword" class="form-label">Confirm New Password</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						class="form-input"
						required
						minlength="8"
					/>
				</div>

				<button type="submit" class="btn btn-primary" disabled={loadingPassword}>
					{#if loadingPassword}
						Changing...
					{:else}
						Change Password
					{/if}
				</button>
			</form>
		</section>
	</div>
</div>

<style>
	.admin-page {
		padding: 2rem;
	}

	.profile-sections {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		max-width: 900px;
	}

	.profile-card {
		background: white;
		border-radius: 0.75rem;
		padding: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.profile-card h2 {
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--color-border);
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.alert-success {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #166534;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.25rem;
		font-size: 0.9rem;
	}

	.alert-error {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #991b1b;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.25rem;
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		.profile-sections {
			grid-template-columns: 1fr;
		}
	}
</style>
