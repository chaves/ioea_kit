<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { config } from '$lib/config';
</script>

<svelte:head>
	<title>Application Submitted | IOEA {config.currentYear}</title>
</svelte:head>

<PageHeader title="Application Submitted" />

<section class="section-space">
	<div class="container">
		<div class="success-content">
			<div class="success-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
					<polyline points="22 4 12 14.01 9 11.01"></polyline>
				</svg>
			</div>

			<h2>Thank You for Your Application!</h2>

			<p class="lead">
				Your application for IOEA {config.currentYear} has been successfully submitted.
			</p>

			<div class="info-card">
				<h3>What Happens Next?</h3>
				<ul>
					<li>
						<strong>Confirmation Email:</strong> You will receive a confirmation email shortly
						at the address you provided.
					</li>
					<li>
						<strong>Review Process:</strong> Your application will be reviewed by our selection
						committee.
					</li>
					<li>
						<strong>Notification:</strong> You will be notified about the outcome of your
						application {config.deadlines.notification}.
					</li>
				</ul>
			</div>

			<div class="contact-info">
				<p>
					If you have any questions, please don't hesitate to contact us at
					<a href="mailto:{config.emails.coordination}">{config.emails.coordination}</a>.
				</p>
			</div>

			<div class="actions">
				<a href="/" class="btn btn-primary">Return to Home</a>
				<a href="/{config.currentYear}" class="btn btn-secondary">Learn More About IOEA {config.currentYear}</a>
			</div>
		</div>
	</div>
</section>

<style>
	.success-content {
		max-width: 700px;
		margin: 0 auto;
		text-align: center;
	}

	.success-icon {
		color: var(--color-accent);
		margin: 0 auto 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80px;
		height: 80px;
	}

	h2 {
		margin-bottom: 1rem;
	}

	.lead {
		font-size: 1.2rem;
		color: var(--color-text-light);
		margin-bottom: 2rem;
	}

	.info-card {
		background: var(--color-bg-alt);
		padding: 2rem;
		border-radius: 0.5rem;
		text-align: left;
		margin-bottom: 2rem;
	}

	.info-card h3 {
		margin-bottom: 1rem;
	}

	.info-card ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.info-card li {
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
		line-height: 1.6;
	}

	.info-card li:last-child {
		border-bottom: none;
	}

	.contact-info {
		margin-bottom: 2rem;
	}

	.contact-info p {
		color: var(--color-text-light);
	}

	.contact-info a {
		color: var(--color-secondary);
		font-weight: 500;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	@media (max-width: 500px) {
		.actions {
			flex-direction: column;
		}
	}
</style>

