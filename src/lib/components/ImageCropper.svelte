<script lang="ts">
	import { tick } from 'svelte';
	import { Check, X } from '@lucide/svelte';

	interface Props {
		src: string;
		onconfirm: (blob: Blob) => void;
		oncancel: () => void;
		embedded?: boolean;
		/** Locks crop ratio (e.g. 3/2 for slider). Omit to allow ratio selection / free resize. */
		aspectRatio?: number;
	}
	let { src, onconfirm, oncancel, embedded = false, aspectRatio }: Props = $props();

	type RatioPreset = 'free' | 'original' | '3:1' | '3:2' | '16:9' | '4:3' | '1:1';
	type Handle = 'nw' | 'ne' | 'se' | 'sw';

	const MAX_DISPLAY_W = 540;
	const MAX_DISPLAY_H = 480;
	const MIN_CROP = 48;
	const HANDLE_SIZE = 12;
	const SLIDER_OUTPUT_W = 900;
	const SLIDER_OUTPUT_H = 600;
	const FREE_MAX_OUTPUT = 1200;

	const PRESET_RATIOS: Record<Exclude<RatioPreset, 'free' | 'original'>, number> = {
		'3:1': 3,
		'3:2': 3 / 2,
		'16:9': 16 / 9,
		'4:3': 4 / 3,
		'1:1': 1
	};

	let viewportEl = $state<HTMLDivElement | undefined>();
	let imgEl = $state<HTMLImageElement | undefined>();
	let naturalW = $state(0);
	let naturalH = $state(0);
	let imageReady = $state(false);
	let cropError = $state<string | null>(null);
	let imgScale = $state(1);
	let imgDisplayW = $state(0);
	let imgDisplayH = $state(0);
	let cropX = $state(0);
	let cropY = $state(0);
	let cropW = $state(0);
	let cropH = $state(0);
	// Default to a centered, clearly-adjustable selection rather than the full
	// frame — opening on 'original' let a quick "Apply" produce an uncropped image.
	let selectedPreset = $state<RatioPreset>('free');
	let activeDrag = $state<'move' | Handle | null>(null);
	let dragStart = { px: 0, py: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 };

	const showRatioSelector = $derived(aspectRatio == null);

	const activeRatio = $derived.by((): number | null => {
		if (aspectRatio != null) return aspectRatio;
		if (selectedPreset === 'free') return null;
		if (selectedPreset === 'original' && naturalW > 0 && naturalH > 0) {
			return naturalW / naturalH;
		}
		if (selectedPreset in PRESET_RATIOS) {
			return PRESET_RATIOS[selectedPreset as keyof typeof PRESET_RATIOS];
		}
		return null;
	});

	const ratioLabel = $derived.by(() => {
		if (aspectRatio != null) {
			if (Math.abs(aspectRatio - 3 / 2) < 0.02) return '3:2 (locked)';
			return `${aspectRatio.toFixed(2)}:1 (locked)`;
		}
		if (selectedPreset === 'free') return 'free';
		if (selectedPreset === 'original') return 'original';
		return selectedPreset;
	});

	function lockedRatio(): number | null {
		return activeRatio;
	}

	function computeImageDisplay() {
		if (!naturalW || !naturalH) return;
		const s = Math.min(MAX_DISPLAY_W / naturalW, MAX_DISPLAY_H / naturalH, 1);
		imgScale = s;
		imgDisplayW = Math.round(naturalW * s);
		imgDisplayH = Math.round(naturalH * s);
	}

	function clampCrop(x: number, y: number, w: number, h: number) {
		let nw = Math.max(MIN_CROP, Math.min(w, imgDisplayW));
		let nh = Math.max(MIN_CROP, Math.min(h, imgDisplayH));
		const ratio = lockedRatio();

		if (ratio) {
			if (nw / nh > ratio) nw = nh * ratio;
			else nh = nw / ratio;
			nw = Math.min(nw, imgDisplayW);
			nh = Math.min(nh, imgDisplayH);
			if (nw / nh > ratio) nw = nh * ratio;
			else nh = nw / ratio;
		}

		nw = Math.max(MIN_CROP, nw);
		nh = Math.max(MIN_CROP, nh);
		let nx = Math.max(0, Math.min(x, imgDisplayW - nw));
		let ny = Math.max(0, Math.min(y, imgDisplayH - nh));

		if (nx + nw > imgDisplayW) nx = imgDisplayW - nw;
		if (ny + nh > imgDisplayH) ny = imgDisplayH - nh;

		return { x: nx, y: ny, w: nw, h: nh };
	}

	function setCrop(x: number, y: number, w: number, h: number) {
		const c = clampCrop(x, y, w, h);
		cropX = c.x;
		cropY = c.y;
		cropW = c.w;
		cropH = c.h;
	}

	function maxCropForRatio(ratio: number | null) {
		if (!ratio) {
			return {
				w: Math.max(MIN_CROP, imgDisplayW * 0.85),
				h: Math.max(MIN_CROP, imgDisplayH * 0.85)
			};
		}
		if (imgDisplayW / imgDisplayH >= ratio) {
			const h = imgDisplayH * 0.92;
			return { w: h * ratio, h };
		}
		const w = imgDisplayW * 0.92;
		return { w, h: w / ratio };
	}

	function initCropBox() {
		if (selectedPreset === 'original' && aspectRatio == null) {
			setCrop(0, 0, imgDisplayW, imgDisplayH);
			return;
		}
		const ratio = lockedRatio();
		const size = maxCropForRatio(ratio);
		setCrop(
			(imgDisplayW - size.w) / 2,
			(imgDisplayH - size.h) / 2,
			size.w,
			size.h
		);
	}

	function onImgLoad() {
		if (!imgEl) return;
		naturalW = imgEl.naturalWidth;
		naturalH = imgEl.naturalHeight;
		imageReady = naturalW > 0 && naturalH > 0;
		cropError = null;
		computeImageDisplay();
		initCropBox();
	}

	function initImage(node: HTMLImageElement) {
		imgEl = node;
		void tick().then(() => {
			if (node.complete && node.naturalWidth > 0) onImgLoad();
		});
	}

	function applyPreset(preset: RatioPreset) {
		selectedPreset = preset;
		initCropBox();
	}

	function localPoint(e: PointerEvent) {
		const rect = viewportEl!.getBoundingClientRect();
		return { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

	function hitHandle(px: number, py: number): 'move' | Handle | null {
		const hs = HANDLE_SIZE;
		const near = (ax: number, ay: number) =>
			Math.abs(px - ax) <= hs && Math.abs(py - ay) <= hs;

		if (near(cropX, cropY)) return 'nw';
		if (near(cropX + cropW, cropY)) return 'ne';
		if (near(cropX + cropW, cropY + cropH)) return 'se';
		if (near(cropX, cropY + cropH)) return 'sw';

		if (px >= cropX && px <= cropX + cropW && py >= cropY && py <= cropY + cropH) {
			return 'move';
		}
		return null;
	}

	function onPointerDown(e: PointerEvent) {
		if (!imageReady || e.button !== 0 || !viewportEl) return;
		const { x, y } = localPoint(e);
		const hit = hitHandle(x, y);
		if (!hit) return;

		activeDrag = hit;
		dragStart = { px: x, py: y, cropX, cropY, cropW, cropH };
		viewportEl.setPointerCapture(e.pointerId);
		e.preventDefault();
		e.stopPropagation();
	}

	function resizeFromHandle(handle: Handle, dx: number, dy: number) {
		const ratio = lockedRatio();
		let x = dragStart.cropX;
		let y = dragStart.cropY;
		let w = dragStart.cropW;
		let h = dragStart.cropH;

		if (ratio) {
			if (handle === 'se') {
				w = dragStart.cropW + dx;
				h = w / ratio;
			} else if (handle === 'nw') {
				w = dragStart.cropW - dx;
				h = w / ratio;
				x = dragStart.cropX + dragStart.cropW - w;
				y = dragStart.cropY + dragStart.cropH - h;
			} else if (handle === 'ne') {
				w = dragStart.cropW + dx;
				h = w / ratio;
				y = dragStart.cropY + dragStart.cropH - h;
			} else {
				w = dragStart.cropW - dx;
				h = w / ratio;
				x = dragStart.cropX + dragStart.cropW - w;
			}
		} else if (handle === 'se') {
			w = dragStart.cropW + dx;
			h = dragStart.cropH + dy;
		} else if (handle === 'nw') {
			x = dragStart.cropX + dx;
			y = dragStart.cropY + dy;
			w = dragStart.cropW - dx;
			h = dragStart.cropH - dy;
		} else if (handle === 'ne') {
			y = dragStart.cropY + dy;
			w = dragStart.cropW + dx;
			h = dragStart.cropH - dy;
		} else {
			x = dragStart.cropX + dx;
			w = dragStart.cropW - dx;
			h = dragStart.cropH + dy;
		}

		setCrop(x, y, w, h);
	}

	function onPointerMove(e: PointerEvent) {
		if (!activeDrag || !viewportEl) return;
		const { x, y } = localPoint(e);
		const dx = x - dragStart.px;
		const dy = y - dragStart.py;

		if (activeDrag === 'move') {
			setCrop(dragStart.cropX + dx, dragStart.cropY + dy, dragStart.cropW, dragStart.cropH);
		} else {
			resizeFromHandle(activeDrag, dx, dy);
		}
		e.preventDefault();
	}

	function onPointerUp(e: PointerEvent) {
		activeDrag = null;
		if (viewportEl?.hasPointerCapture(e.pointerId)) {
			viewportEl.releasePointerCapture(e.pointerId);
		}
	}

	function confirmCrop() {
		if (!imgEl || !imageReady || cropW < MIN_CROP || cropH < MIN_CROP) {
			cropError = 'Image is still loading. Please wait a moment.';
			return;
		}
		cropError = null;

		const srcX = cropX / imgScale;
		const srcY = cropY / imgScale;
		const srcW = cropW / imgScale;
		const srcH = cropH / imgScale;
		const cropAspect = cropW / cropH;

		let outW: number;
		let outH: number;
		if (aspectRatio != null && Math.abs(aspectRatio - 3 / 2) < 0.02) {
			outW = SLIDER_OUTPUT_W;
			outH = SLIDER_OUTPUT_H;
		} else if (cropW >= cropH) {
			outW = FREE_MAX_OUTPUT;
			outH = Math.round(FREE_MAX_OUTPUT / cropAspect);
		} else {
			outH = FREE_MAX_OUTPUT;
			outW = Math.round(FREE_MAX_OUTPUT * cropAspect);
		}

		const canvas = document.createElement('canvas');
		canvas.width = outW;
		canvas.height = outH;
		const ctx = canvas.getContext('2d')!;
		ctx.drawImage(imgEl, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
		canvas.toBlob((blob) => {
			if (blob) onconfirm(blob);
			else cropError = 'Could not process image. Try another file.';
		}, 'image/jpeg', 0.88);
	}
</script>

{#snippet cropPanel()}
	<div class="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-[620px]">
		<div class="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
			<div class="min-w-0">
				<span class="font-semibold text-slate-800 text-sm">Crop image</span>
				<span class="text-xs text-slate-400 ml-2">{ratioLabel}</span>
			</div>
			<button type="button" onclick={oncancel} class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0">
				<X size={16} />
			</button>
		</div>

		{#if showRatioSelector}
			<div class="px-5 py-2.5 border-b border-slate-100 bg-slate-50/80 flex flex-wrap items-center gap-2">
				<span class="text-xs font-medium text-slate-600">Ratio</span>
				{#each ['free', 'original', '3:1', '3:2', '16:9', '4:3', '1:1'] as preset (preset)}
					<button
						type="button"
						onclick={() => applyPreset(preset as RatioPreset)}
						class="px-2.5 py-1 text-xs rounded-md border transition-colors
							{selectedPreset === preset
								? 'bg-primary text-white border-primary'
								: 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}"
					>
						{preset === 'free' ? 'Free' : preset === 'original' ? 'Original' : preset}
					</button>
				{/each}
			</div>
		{/if}

		<div class="flex justify-center bg-slate-100 p-4">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				bind:this={viewportEl}
				class="relative select-none bg-slate-900 rounded-lg shadow-lg touch-none"
				style="width:{imgDisplayW}px;height:{imgDisplayH}px;cursor:{activeDrag === 'move' ? 'grabbing' : activeDrag ? 'nwse-resize' : 'default'}"
				role="presentation"
				onpointerdown={onPointerDown}
				onpointermove={onPointerMove}
				onpointerup={onPointerUp}
				onpointercancel={onPointerUp}
			>
				{#key src}
					<img
						use:initImage
						{src}
						alt=""
						draggable="false"
						onload={onImgLoad}
						class="block w-full h-full pointer-events-none select-none transition-opacity duration-150"
						style="opacity:{imageReady ? 1 : 0}"
					/>
				{/key}

				{#if imageReady}
					<!-- Dimmed mask outside crop -->
					<div class="absolute inset-0 pointer-events-none" aria-hidden="true">
						<div class="absolute bg-black/55" style="left:0;top:0;width:{imgDisplayW}px;height:{cropY}px"></div>
						<div class="absolute bg-black/55" style="left:0;top:{cropY + cropH}px;width:{imgDisplayW}px;height:{imgDisplayH - cropY - cropH}px"></div>
						<div class="absolute bg-black/55" style="left:0;top:{cropY}px;width:{cropX}px;height:{cropH}px"></div>
						<div class="absolute bg-black/55" style="left:{cropX + cropW}px;top:{cropY}px;width:{imgDisplayW - cropX - cropW}px;height:{cropH}px"></div>
					</div>

					<!-- Crop selection -->
					<div
						class="absolute border-2 border-white shadow-[0_0_0_1px_rgba(69,54,89,0.8)] pointer-events-none"
						style="left:{cropX}px;top:{cropY}px;width:{cropW}px;height:{cropH}px"
					>
						<div class="absolute inset-0" style="
							background-image:
								linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px),
								linear-gradient(90deg, rgba(255,255,255,.22) 1px, transparent 1px);
							background-size:{cropW / 3}px {cropH / 3}px;
						"></div>
						<!-- Corner handles -->
						<div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary-dark rounded-sm"></div>
						<div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary-dark rounded-sm"></div>
						<div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary-dark rounded-sm"></div>
						<div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary-dark rounded-sm"></div>
					</div>
				{/if}

				{#if !imageReady}
					<div class="absolute inset-0 flex items-center justify-center text-white/70 text-sm gap-2">
						<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
						Loading image…
					</div>
				{/if}
			</div>
		</div>

		<p class="px-5 -mt-1 pb-2 text-xs text-slate-500 text-center">
			Drag inside the selection to move it. Drag corners to resize{showRatioSelector ? ' — pick a ratio or use Free' : ''}.
		</p>

		<div class="px-4 py-3 flex items-center justify-end gap-2 flex-wrap bg-slate-50">
			{#if cropError}
				<p class="text-red-600 text-xs mr-auto">{cropError}</p>
			{/if}
			<button type="button" onclick={oncancel} class="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
			<button type="button" onclick={confirmCrop} disabled={!imageReady} class="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
				<Check size={14} /> Apply crop
			</button>
		</div>
	</div>
{/snippet}

{#if embedded}
	{@render cropPanel()}
{:else}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
		role="dialog"
		aria-modal="true"
		aria-label="Crop image"
		tabindex="-1"
	>
		<button
			type="button"
			class="absolute inset-0"
			aria-label="Close crop dialog"
			onclick={oncancel}
		></button>
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div role="presentation" class="relative z-10 w-full flex justify-center pointer-events-auto" onclick={(e) => e.stopPropagation()}>
			{@render cropPanel()}
		</div>
	</div>
{/if}
