<script lang="ts">
	interface Props {
		src: string;
		onConfirm: (blob: Blob) => void;
		onCancel: () => void;
	}

	let { src, onConfirm, onCancel }: Props = $props();

	const MAX_DISPLAY = 480; // max display size in modal (px)
	const OUTPUT_SIZE = 400; // exported square size (matches server max)

	let imgEl = $state<HTMLImageElement | null>(null);
	let displayW = $state(0);
	let displayH = $state(0);

	// Crop box in display-space coordinates
	let cropX = $state(0);
	let cropY = $state(0);
	let cropSize = $state(0);

	type DragMode = 'move' | 'tl' | 'tr' | 'bl' | 'br';
	let drag: { mode: DragMode; startX: number; startY: number; initX: number; initY: number; initSize: number } | null =
		null;

	function onImageLoad() {
		if (!imgEl) return;
		const nw = imgEl.naturalWidth;
		const nh = imgEl.naturalHeight;
		const scale = Math.min(MAX_DISPLAY / nw, MAX_DISPLAY / nh, 1);
		displayW = Math.round(nw * scale);
		displayH = Math.round(nh * scale);

		// Initial crop: centered square filling the shorter dimension
		const size = Math.min(displayW, displayH);
		cropSize = size;
		cropX = Math.round((displayW - size) / 2);
		cropY = Math.round((displayH - size) / 2);
	}

	function clamp(x: number, y: number, size: number) {
		const minSize = 40;
		size = Math.max(minSize, Math.min(size, displayW, displayH));
		x = Math.max(0, Math.min(x, displayW - size));
		y = Math.max(0, Math.min(y, displayH - size));
		return { x, y, size };
	}

	function startDrag(e: MouseEvent | TouchEvent, mode: DragMode) {
		e.preventDefault();
		const pt = 'touches' in e ? e.touches[0] : e;
		drag = { mode, startX: pt.clientX, startY: pt.clientY, initX: cropX, initY: cropY, initSize: cropSize };
	}

	function onMove(e: MouseEvent | TouchEvent) {
		if (!drag) return;
		const pt = 'touches' in e ? e.touches[0] : e;
		const dx = pt.clientX - drag.startX;
		const dy = pt.clientY - drag.startY;

		if (drag.mode === 'move') {
			const c = clamp(drag.initX + dx, drag.initY + dy, cropSize);
			cropX = c.x;
			cropY = c.y;
		} else {
			// Compute delta based on corner dragged
			let delta = 0;
			let nx = drag.initX;
			let ny = drag.initY;

			if (drag.mode === 'br') { delta = (dx + dy) / 2; }
			else if (drag.mode === 'bl') { delta = (-dx + dy) / 2; nx = drag.initX - delta; }
			else if (drag.mode === 'tr') { delta = (dx - dy) / 2; ny = drag.initY - delta; }
			else if (drag.mode === 'tl') { delta = (-dx - dy) / 2; nx = drag.initX - delta; ny = drag.initY - delta; }

			const c = clamp(nx, ny, drag.initSize + delta);
			cropX = c.x;
			cropY = c.y;
			cropSize = c.size;
		}
	}

	function stopDrag() {
		drag = null;
	}

	async function confirm() {
		if (!imgEl) return;
		const scale = imgEl.naturalWidth / displayW;
		const sx = cropX * scale;
		const sy = cropY * scale;
		const sSize = cropSize * scale;

		const canvas = document.createElement('canvas');
		canvas.width = OUTPUT_SIZE;
		canvas.height = OUTPUT_SIZE;
		const ctx = canvas.getContext('2d')!;
		ctx.drawImage(imgEl, sx, sy, sSize, sSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

		canvas.toBlob((blob) => { if (blob) onConfirm(blob); }, 'image/jpeg', 0.92);
	}

	// Overlay rectangles around the crop square
	const overlays = $derived([
		// top
		{ x: 0, y: 0, w: displayW, h: cropY },
		// bottom
		{ x: 0, y: cropY + cropSize, w: displayW, h: displayH - cropY - cropSize },
		// left
		{ x: 0, y: cropY, w: cropX, h: cropSize },
		// right
		{ x: cropX + cropSize, y: cropY, w: displayW - cropX - cropSize, h: cropSize },
	]);
</script>

<svelte:window onmousemove={onMove} onmouseup={stopDrag} ontouchmove={onMove} ontouchend={stopDrag} />

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="modal-backdrop" onclick={onCancel}>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="modal-box" onclick={(e) => e.stopPropagation()}>
		<h3 class="modal-title">Crop photo</h3>

		<div class="crop-area" style="width:{displayW}px; height:{displayH}px;">
			<img
				bind:this={imgEl}
				{src}
				alt="Crop preview"
				class="crop-img"
				style="width:{displayW}px; height:{displayH}px;"
				onload={onImageLoad}
				draggable="false"
			/>

			<!-- Dark overlays outside crop box -->
			{#each overlays as o}
				{#if o.w > 0 && o.h > 0}
					<div
						class="overlay-dark"
						style="left:{o.x}px; top:{o.y}px; width:{o.w}px; height:{o.h}px;"
					></div>
				{/if}
			{/each}

			<!-- Crop box -->
			<div
				class="crop-box"
				style="left:{cropX}px; top:{cropY}px; width:{cropSize}px; height:{cropSize}px;"
				onmousedown={(e) => startDrag(e, 'move')}
				ontouchstart={(e) => startDrag(e, 'move')}
				role="slider"
				aria-label="Crop area"
				aria-valuenow={cropSize}
				tabindex="0"
			>
				<!-- Grid lines -->
				<div class="grid-line grid-h" style="top:33.33%"></div>
				<div class="grid-line grid-h" style="top:66.66%"></div>
				<div class="grid-line grid-v" style="left:33.33%"></div>
				<div class="grid-line grid-v" style="left:66.66%"></div>

				<!-- Circle preview ring -->
				<div class="circle-ring"></div>

				<!-- Corner handles -->
				{#each (['tl', 'tr', 'bl', 'br'] as const) as corner}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="handle handle-{corner}"
						onmousedown={(e) => { e.stopPropagation(); startDrag(e, corner); }}
						ontouchstart={(e) => { e.stopPropagation(); startDrag(e, corner); }}
					></div>
				{/each}
			</div>
		</div>

		<!-- Preview -->
		<div class="preview-row">
			<div
				class="preview-circle"
				style="background-image: url('{src}');
					background-size: {displayW}px {displayH}px;
					background-position: -{cropX}px -{cropY}px;
					width: {Math.round(cropSize * 0.5)}px;
					height: {Math.round(cropSize * 0.5)}px;
					max-width: 80px; max-height: 80px; min-width: 40px; min-height: 40px;"
			></div>
			<span class="preview-label">Preview</span>
		</div>

		<div class="modal-actions">
			<button type="button" class="btn btn-primary" onclick={confirm}>Apply crop</button>
			<button type="button" class="btn btn-secondary" onclick={onCancel}>Cancel</button>
		</div>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.65);
		z-index: 200;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.modal-box {
		background: white;
		border-radius: 0.75rem;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		max-width: 95vw;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
	}

	.modal-title {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--color-primary);
		align-self: flex-start;
	}

	.crop-area {
		position: relative;
		overflow: hidden;
		cursor: default;
		border-radius: 0.25rem;
		flex-shrink: 0;
	}

	.crop-img {
		display: block;
		user-select: none;
		-webkit-user-drag: none;
	}

	.overlay-dark {
		position: absolute;
		background: rgba(0, 0, 0, 0.55);
		pointer-events: none;
	}

	.crop-box {
		position: absolute;
		border: 2px solid white;
		cursor: move;
		box-sizing: border-box;
	}

	.circle-ring {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 1px dashed rgba(255, 255, 255, 0.5);
		pointer-events: none;
	}

	.grid-line {
		position: absolute;
		background: rgba(255, 255, 255, 0.3);
		pointer-events: none;
	}

	.grid-h { left: 0; right: 0; height: 1px; }
	.grid-v { top: 0; bottom: 0; width: 1px; }

	.handle {
		position: absolute;
		width: 14px;
		height: 14px;
		background: white;
		border: 2px solid var(--color-primary);
		border-radius: 2px;
	}

	.handle-tl { top: -7px; left: -7px; cursor: nwse-resize; }
	.handle-tr { top: -7px; right: -7px; cursor: nesw-resize; }
	.handle-bl { bottom: -7px; left: -7px; cursor: nesw-resize; }
	.handle-br { bottom: -7px; right: -7px; cursor: nwse-resize; }

	.preview-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.preview-circle {
		border-radius: 50%;
		border: 2px solid var(--color-border);
		background-repeat: no-repeat;
		flex-shrink: 0;
	}

	.preview-label {
		font-size: 0.8rem;
		color: var(--color-text-light);
	}

	.modal-actions {
		display: flex;
		gap: 0.75rem;
		align-self: flex-end;
	}

	.btn-secondary {
		background: var(--color-bg-alt);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		cursor: pointer;
		padding: 0.5rem 1.25rem;
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.btn-secondary:hover { background: var(--color-border); }
</style>
