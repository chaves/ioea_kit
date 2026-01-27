<script lang="ts">
	import { config } from '$lib/config';
	import { page } from '$app/stores';

	interface Props {
		showBrochure?: boolean;
		showPhotos?: boolean;
		showProgram?: boolean;
	}

	let { showBrochure = true, showPhotos = true, showProgram }: Props = $props();

	// Get random photo from layout data (server-loaded)
	const randomPhoto = $page.data.randomPhoto as { year: number; filename: string } | null;
	const programPDFExists = $page.data.programPDFExists as boolean | undefined;

	const randomPhotoYear = randomPhoto?.year ?? null;
	const randomPhotoFilename = randomPhoto?.filename ?? null;

	// Show program if PDF exists (unless explicitly disabled via prop)
	const shouldShowProgram = $derived(
		showProgram !== undefined ? showProgram : (programPDFExists ?? false)
	);

	// Use the actual photo from server, or fallback to placeholder
	const imageSrc = $derived(
		randomPhotoYear && randomPhotoFilename
			? `/images/photos/${randomPhotoYear}/${randomPhotoFilename}`
			: '/images/placeholder-photo.jpg'
	);
</script>

	{#if shouldShowProgram}
		<div class="sidebar-widget">
			<h3>Program {config.currentYear}</h3>
			<a href="/{config.currentYear}" class="program-preview">
				<img
					src={`/images/${config.program.imageName}`}
					alt="IOEA {config.currentYear} Program"
					class="program-image"
				/>
			</a>
		</div>
	{/if}

{#if showPhotos && randomPhotoYear}
	<div class="sidebar-widget">
		<h3>Photos</h3>
		<a href="/photos/{randomPhotoYear}" class="photos-preview">
			<img
				src={imageSrc}
				alt="IOEA {randomPhotoYear}"
				class="photos-thumb"
				onerror={(e) => e.currentTarget.src = '/images/placeholder-photo.jpg'}
			/>
			<span class="photos-label">IOEA {randomPhotoYear}</span>
		</a>
		<a href="/community/photos" class="view-all-link">View all photos →</a>
	</div>
{/if}

{#if showBrochure}
	<div class="sidebar-widget brochure-widget">
		<h3>Brochure</h3>
		<a href={`/pdf/${config.brochure.name}`} target="_blank" class="brochure-preview">
			<img
				src={`/images/${config.brochure.imageName}`}
				alt="IOEA Brochure {config.currentYear}"
				class="brochure-image"
				onerror={(e) => {
					// Hide the widget if image doesn't exist
					const widget = e.currentTarget.closest('.brochure-widget');
					if (widget) {
						(widget as HTMLElement).style.display = 'none';
					}
				}}
			/>
		</a>
	</div>
{/if}

<div class="sidebar-widget subscribe-widget">
	<h3>Stay Updated</h3>
	<p>Join our mailing list for updates on upcoming sessions.</p>
	<a href="/community/join" class="btn btn-secondary btn-block">
		Subscribe
	</a>
</div>

<style>
	.sidebar-widget {
		background: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		border: 1px solid var(--color-border);
	}

	.sidebar-widget h3 {
		font-size: 1rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid var(--color-secondary);
		color: var(--color-primary);
	}

	.program-preview {
		display: block;
		position: relative;
		border-radius: 0.375rem;
		overflow: hidden;
		transition: transform 0.3s ease;
		width: 100%;
		max-width: 100%;
	}

	.program-preview:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.program-image {
		width: 100%;
		height: auto;
		max-width: 100%;
		display: block;
		object-fit: contain;
		transition: transform 0.3s ease;
	}

	.program-preview:hover .program-image {
		transform: scale(1.02);
	}

	.photos-preview {
		display: block;
		position: relative;
		border-radius: 0.375rem;
		overflow: hidden;
		margin-bottom: 0.75rem;
	}

	.photos-thumb {
		width: 100%;
		height: 150px;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.photos-preview:hover .photos-thumb {
		transform: scale(1.05);
	}

	.photos-label {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		color: white;
		padding: 1rem 0.75rem 0.5rem;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.view-all-link {
		display: block;
		text-align: right;
		font-size: 0.85rem;
		color: var(--color-secondary);
	}

	.brochure-preview {
		display: block;
		position: relative;
		border-radius: 0.375rem;
		overflow: hidden;
		transition: transform 0.3s ease;
		width: 100%;
		max-width: 100%;
	}

	.brochure-preview:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.brochure-image {
		width: 100%;
		height: auto;
		max-width: 100%;
		display: block;
		object-fit: contain;
		transition: transform 0.3s ease;
	}

	.brochure-preview:hover .brochure-image {
		transform: scale(1.02);
	}

	.subscribe-widget p {
		font-size: 0.9rem;
		color: var(--color-text-light);
		margin-bottom: 1rem;
	}

	.btn-block {
		display: block;
		width: 100%;
		text-align: center;
	}
</style>

