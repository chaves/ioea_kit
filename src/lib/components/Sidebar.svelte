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
			<a href={`/pdf/${config.program.pdfName}`} target="_blank" class="program-preview">
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
					onerror={(e) => {
						(e.currentTarget as HTMLImageElement).src = '/images/placeholder-photo.jpg';
					}}
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
						const img = e.currentTarget as HTMLImageElement;
						// Hide the widget if image doesn't exist
						const widget = img.closest('.brochure-widget');
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
		border-radius: 1rem;
		padding: 1.75rem;
		margin-bottom: 2rem;
		border: 1px solid var(--color-border);
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	}

	.sidebar-widget h3 {
		font-size: 1.1rem;
		font-weight: 800;
		margin: 0 0 1.25rem 0;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid var(--color-secondary);
		color: var(--color-primary);
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.program-preview {
		display: block;
		position: relative;
		border-radius: 0.5rem;
		overflow: hidden;
		transition: all 0.3s ease;
		width: 100%;
		max-width: 100%;
	}

	.program-preview:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
	}

	.program-image {
		width: 100%;
		height: auto;
		max-width: 100%;
		display: block;
		object-fit: contain;
		transition: transform 0.5s ease;
	}

	.program-preview:hover .program-image {
		transform: scale(1.05);
	}

	.photos-preview {
		display: block;
		position: relative;
		border-radius: 0.5rem;
		overflow: hidden;
		margin-bottom: 1rem;
		transition: all 0.3s ease;
	}

	.photos-thumb {
		width: 100%;
		height: 160px;
		object-fit: cover;
		transition: transform 0.5s ease;
	}

	.photos-preview:hover .photos-thumb {
		transform: scale(1.1);
	}

	.photos-label {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
		color: white;
		padding: 1.5rem 1rem 0.75rem;
		font-weight: 700;
		font-size: 1rem;
	}

	.view-all-link {
		display: block;
		text-align: right;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-secondary);
		text-decoration: none;
		transition: color 0.2s;
	}

	.view-all-link:hover {
		color: var(--color-primary);
		text-decoration: underline;
	}

	.brochure-preview {
		display: block;
		position: relative;
		border-radius: 0.5rem;
		overflow: hidden;
		transition: all 0.3s ease;
		width: 100%;
		max-width: 100%;
	}

	.brochure-preview:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
	}

	.brochure-image {
		width: 100%;
		height: auto;
		max-width: 100%;
		display: block;
		object-fit: contain;
		transition: transform 0.5s ease;
	}

	.brochure-preview:hover .brochure-image {
		transform: scale(1.05);
	}

	.subscribe-widget p {
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-text);
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.btn-block {
		display: block;
		width: 100%;
		text-align: center;
		padding: 0.875rem;
		font-weight: 800;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}
</style>
