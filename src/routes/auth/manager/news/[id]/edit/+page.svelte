<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { refreshAll } from '$app/navigation';
	import TipTapEditor from '#lib/components/TipTapEditor.svelte';
	import ImageCropper from '#lib/components/ImageCropper.svelte';
	import { ArrowLeft, Save, Eye, Upload, X, ImagePlus, FileText, Trash2 } from '@lucide/svelte';
	import { clampPercent, normalizeImageFit } from '#lib/utils/newsImage.js';

	let { data, form } = $props();
	let saving = $state(false);

	// Image handling
	let fileInput = $state<HTMLInputElement | undefined>();
	let cropperSrc = $state<string | null>(null);
	// Initial values only: the effects below re-sync them after a failed save or a navigation
	let currentImage = $state<string | null>(untrack(() => data.article.image ?? null));
	let uploading = $state(false);
	let uploadError = $state<string | null>(null);
	let uploadSuccess = $state<string | null>(null);
	let imageFit = $state<'cover' | 'contain'>(
		untrack(() => normalizeImageFit(form?.imageFit ?? data.article.imageFit ?? 'cover'))
	);
	let imageFocusX = $state(untrack(() => clampPercent(form?.imageFocusX ?? data.article.imageFocusX, 50)));
	let imageFocusY = $state(untrack(() => clampPercent(form?.imageFocusY ?? data.article.imageFocusY, 28)));

	// File handling
	type NewsFile = { id: number; filename: string; label: string | null; size: number; createdAt: string | Date };
	let pdfInput = $state<HTMLInputElement | undefined>();
	let files = $state<NewsFile[]>(untrack(() => data.article.files ?? []));
	let uploadingFile = $state(false);
	let fileError = $state<string | null>(null);
	let confirmDeleteFile = $state<number | null>(null);

	let syncedArticleId = untrack(() => data.article.id);

	// Repopulate image display settings only after a failed save
	$effect(() => {
		if (!form?.error) return;
		imageFit = normalizeImageFit(form.imageFit ?? data.article.imageFit ?? 'cover');
		imageFocusX = clampPercent(form.imageFocusX ?? data.article.imageFocusX, 50);
		imageFocusY = clampPercent(form.imageFocusY ?? data.article.imageFocusY, 28);
	});

	// Re-sync when navigating to a different article
	$effect(() => {
		if (data.article.id !== syncedArticleId) {
			syncedArticleId = data.article.id;
			currentImage = data.article.image ?? null;
			files = data.article.files ?? [];
			imageFit = normalizeImageFit(data.article.imageFit ?? 'cover');
			imageFocusX = clampPercent(data.article.imageFocusX, 50);
			imageFocusY = clampPercent(data.article.imageFocusY, 28);
		}
	});

	function handleFile(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => { cropperSrc = reader.result as string; };
		reader.readAsDataURL(file);
		(e.target as HTMLInputElement).value = ''; // allow re-selecting same file
	}

	async function handleCrop(blob: Blob) {
		cropperSrc = null;
		uploading = true;
		uploadError = null;
		uploadSuccess = null;
		try {
			const fd = new FormData();
			fd.append('image', blob, 'image.jpg');
			const res = await fetch(`/auth/manager/news/${data.article.id}/image`, { method: 'POST', body: fd });
			if (!res.ok) {
				const msg = await res.text();
				throw new Error(msg || 'Upload failed');
			}
			const json = await res.json();
			currentImage = json.image; // versioned filename — no cache-bust needed
			uploadSuccess = 'Image uploaded successfully.';
		} catch (err: unknown) {
			uploadError = err instanceof Error ? err.message : 'Upload failed. Please try again.';
		} finally {
			uploading = false;
		}
	}

	async function removeImage() {
		if (!confirm('Remove the image from this article?')) return;
		uploadError = null;
		uploadSuccess = null;
		const res = await fetch(`/auth/manager/news/${data.article.id}/image`, { method: 'DELETE' });
		if (res.ok) {
			currentImage = null;
		} else {
			uploadError = 'Failed to remove image. Please try again.';
		}
	}

	const imagePositionStyle = $derived(`object-position: ${imageFocusX}% ${imageFocusY}%`);

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	async function handlePdfUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		(e.target as HTMLInputElement).value = '';
		if (!file.name.toLowerCase().endsWith('.pdf')) {
			fileError = 'Only PDF files are allowed.';
			return;
		}
		uploadingFile = true;
		fileError = null;
		try {
			const fd = new FormData();
			fd.append('file', file);
			const res = await fetch(`/auth/manager/news/${data.article.id}/files`, { method: 'POST', body: fd });
			if (!res.ok) {
				const msg = await res.text();
				throw new Error(msg || 'Upload failed');
			}
			const newFile = await res.json();
			files = [newFile, ...files];
			await refreshAll();
		} catch (err: unknown) {
			fileError = err instanceof Error ? err.message : 'Upload failed. Please try again.';
		} finally {
			uploadingFile = false;
		}
	}

	async function deleteFile(fileId: number) {
		const fd = new FormData();
		fd.append('fileId', String(fileId));
		const res = await fetch(`/auth/manager/news/${data.article.id}/files`, { method: 'DELETE', body: fd });
		if (res.ok) {
			files = files.filter(f => f.id !== fileId);
			confirmDeleteFile = null;
			await refreshAll();
		}
	}
</script>

<svelte:head><title>Edit: {data.article.title} – IOEA Admin</title></svelte:head>

<div class="p-6 md:p-8 max-w-4xl">
	<div class="flex items-center gap-4 mb-6">
		<a href="/auth/manager/news" class="text-slate-400 hover:text-slate-600 transition-colors"><ArrowLeft size={20} /></a>
		<h1 class="text-2xl font-bold text-slate-800 truncate">Edit: {data.article.title}</h1>
		{#if data.article.published}
			<a href="/news/{data.article.slug}" target="_blank" class="ml-auto p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100 transition-colors" title="View published">
				<Eye size={18} />
			</a>
		{/if}
	</div>

	{#if data.saved}
		<div class="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm mb-5">Article saved successfully.</div>
	{/if}
	{#if form?.error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-5">{form.error}</div>
	{/if}

	<form method="POST" use:enhance={() => {
		saving = true;
		return async ({ update }) => { saving = false; await update(); };
	}} class="space-y-5">
		<div class="bg-white rounded-xl border border-slate-100 p-6 space-y-5">

			<!-- Image -->
			<div>
				<p class="block text-sm font-medium text-slate-700 mb-2">Image</p>

				{#if uploading}
					<div class="aspect-[3/1] rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm gap-2">
						<div class="w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full animate-spin"></div>
						Uploading and resizing…
					</div>
				{:else if currentImage}
					<div class="relative group rounded-xl overflow-hidden">
						<!-- Mirrors the public NewsCard (aspect-[3/1] + fit/focus) so this is a true preview -->
						<div class="relative w-full aspect-[3/1] overflow-hidden bg-slate-100">
							{#if imageFit === 'contain'}
								<img src={currentImage} alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45" style={imagePositionStyle} />
								<img src={currentImage} alt="" class="relative z-10 w-full h-full object-contain p-2" style={imagePositionStyle} />
							{:else}
								<img src={currentImage} alt="" class="w-full h-full object-cover" style={imagePositionStyle} />
							{/if}
						</div>
						<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
							<button type="button" onclick={() => fileInput?.click()}
								class="px-3 py-1.5 text-sm bg-white text-slate-800 rounded-lg font-medium hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5">
								<Upload size={13} /> Change
							</button>
							<button type="button" onclick={removeImage}
								class="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors inline-flex items-center gap-1.5">
								<X size={13} /> Remove
							</button>
						</div>
					</div>
				{:else}
					<button
						type="button"
						onclick={() => fileInput?.click()}
						class="w-full h-36 border-2 border-dashed border-slate-200 rounded-xl hover:border-primary-light hover:bg-primary-faded transition-colors flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary"
					>
						<ImagePlus size={22} />
						<span class="text-sm font-medium">Upload image</span>
						<span class="text-xs">JPEG, PNG, WebP · resized for web · original proportions kept</span>
					</button>
				{/if}

				{#if uploadSuccess}
					<p class="text-green-600 text-xs mt-1.5">{uploadSuccess}</p>
				{/if}
				{#if uploadError}
					<p class="text-red-600 text-xs mt-1.5">{uploadError}</p>
				{/if}

				<input bind:this={fileInput} type="file" accept="image/*" class="hidden" onchange={handleFile} />
			</div>

			<div class="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-3">
				<div class="flex items-center justify-between gap-3">
					<p class="text-sm font-medium text-slate-700">News Card Image Behavior</p>
					{#if currentImage}
						<p class="text-xs text-slate-500">
							Preview: {imageFit} · {imageFocusX}% / {imageFocusY}%
						</p>
					{/if}
				</div>
				<p class="text-xs text-slate-500">Applied on public news cards for featured and fallback images extracted from article content. Save the article to apply on the public site.</p>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div>
						<label for="imageFit" class="block text-xs font-medium text-slate-600 mb-1">Fit mode</label>
						<select
							id="imageFit"
							name="imageFit"
							bind:value={imageFit}
							class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						>
							<option value="cover">Cover (fill card)</option>
							<option value="contain">Contain (preserve full image)</option>
						</select>
					</div>
					<div>
						<label for="imageFocusX" class="block text-xs font-medium text-slate-600 mb-1">Focus X (%)</label>
						<input
							type="number"
							id="imageFocusX"
							name="imageFocusX"
							min="0"
							max="100"
							value={imageFocusX}
							oninput={(e) => { imageFocusX = clampPercent(e.currentTarget.value, 50); }}
							class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>
					<div>
						<label for="imageFocusY" class="block text-xs font-medium text-slate-600 mb-1">Focus Y (%)</label>
						<input
							type="number"
							id="imageFocusY"
							name="imageFocusY"
							min="0"
							max="100"
							value={imageFocusY}
							oninput={(e) => { imageFocusY = clampPercent(e.currentTarget.value, 28); }}
							class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			<div>
				<label for="title" class="block text-sm font-medium text-slate-700 mb-1">Title <span class="text-red-500">*</span></label>
				<input type="text" id="title" name="title" value={form?.title ?? data.article.title} required
					class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
			</div>

			<div>
				<label for="excerpt" class="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
				<textarea id="excerpt" name="excerpt" rows="2"
					class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y">{form?.excerpt ?? data.article.excerpt ?? ''}</textarea>
			</div>

			<div>
				<p class="block text-sm font-medium text-slate-700 mb-1">Content <span class="text-red-500">*</span></p>
				<TipTapEditor name="content" content={form?.content ?? data.article.content} placeholder="Write the article content…" />
			</div>

			<div>
				<label for="author" class="block text-sm font-medium text-slate-700 mb-1">Author</label>
				<input type="text" id="author" name="author" value={form?.author ?? data.article.author ?? ''}
					class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
			</div>
		</div>

		<!-- Attached Files -->
		<div class="bg-white rounded-xl border border-slate-100 p-6">
			<div class="flex items-center justify-between mb-3">
				<p class="text-sm font-medium text-slate-700">Attached Files (PDF)</p>
				<button
					type="button"
					onclick={() => pdfInput?.click()}
					class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary-faded rounded-lg hover:bg-primary/15 transition-colors"
				>
					<Upload size={13} /> Add PDF
				</button>
			</div>

			{#if fileError}
				<p class="text-red-600 text-xs mb-2">{fileError}</p>
			{/if}

			{#if uploadingFile}
				<div class="flex items-center gap-2 text-slate-500 text-sm py-2">
					<div class="w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full animate-spin"></div>
					Uploading…
				</div>
			{/if}

			{#if files.length === 0 && !uploadingFile}
				<p class="text-sm text-slate-400 py-2">No files attached.</p>
			{:else}
				<div class="space-y-1.5">
					{#each files as file (file.id)}
						<div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 group">
							<FileText size={16} class="text-red-500 flex-shrink-0" />
							<a
								href="/files/news/{file.filename}"
								target="_blank"
								class="text-sm text-slate-700 hover:text-primary truncate flex-1"
							>
								{file.label || file.filename}
							</a>
							<span class="text-xs text-slate-400 flex-shrink-0">{formatFileSize(file.size)}</span>
							{#if confirmDeleteFile === file.id}
								<button type="button" onclick={() => deleteFile(file.id)} class="px-2 py-1 text-xs bg-red-600 text-white rounded font-medium hover:bg-red-700">Delete</button>
								<button type="button" onclick={() => (confirmDeleteFile = null)} class="px-2 py-1 text-xs text-slate-600 bg-slate-200 rounded font-medium hover:bg-slate-300">Cancel</button>
							{:else}
								<button type="button" onclick={() => (confirmDeleteFile = file.id)} class="p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all" title="Delete">
									<Trash2 size={14} />
								</button>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			<input bind:this={pdfInput} type="file" accept=".pdf,application/pdf" class="hidden" onchange={handlePdfUpload} />
		</div>

		<div class="bg-white rounded-xl border border-slate-100 p-5 flex items-center justify-between">
			<label class="flex items-center gap-2.5 cursor-pointer">
				<input type="checkbox" name="published" checked={data.article.published} class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
				<span class="text-sm font-medium text-slate-700">Published</span>
			</label>
			<button type="submit" disabled={saving} class="btn btn-primary {saving ? 'opacity-70' : ''}">
				<Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
			</button>
		</div>
	</form>
</div>

<!-- Upload & crop modal -->
{#if cropperSrc}
	{#key cropperSrc}
		<ImageCropper src={cropperSrc} onconfirm={handleCrop} oncancel={() => (cropperSrc = null)} />
	{/key}
{/if}
