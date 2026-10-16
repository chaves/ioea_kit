<script lang="ts">
	import { enhance } from '$app/forms';
	import TipTapEditor from '#lib/components/TipTapEditor.svelte';
	import { ArrowLeft, Save } from '@lucide/svelte';

	let { form } = $props();
	let saving = $state(false);
</script>

<svelte:head><title>New Article – IOEA Admin</title></svelte:head>

<div class="p-6 md:p-8 max-w-4xl">
	<div class="flex items-center gap-4 mb-6">
		<a href="/auth/manager/news" class="text-slate-400 hover:text-slate-600 transition-colors"><ArrowLeft size={20} /></a>
		<h1 class="text-2xl font-bold text-slate-800">New Article</h1>
	</div>

	{#if form?.error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-5">{form.error}</div>
	{/if}

	<form method="POST" use:enhance={() => {
		saving = true;
		return async ({ update }) => { saving = false; await update(); };
	}} class="space-y-5">
		<div class="bg-white rounded-xl border border-slate-100 p-6 space-y-5">
			<div>
				<label for="title" class="block text-sm font-medium text-slate-700 mb-1">Title <span class="text-red-500">*</span></label>
				<input type="text" id="title" name="title" value={form?.title ?? ''} required
					class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
					placeholder="Article title" />
			</div>

			<div>
				<label for="excerpt" class="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
				<textarea id="excerpt" name="excerpt" rows="2"
					class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
					placeholder="Short summary shown in news cards…">{form?.excerpt ?? ''}</textarea>
			</div>

			<div class="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-3">
				<p class="text-sm font-medium text-slate-700">News Card Image Behavior</p>
				<p class="text-xs text-slate-500">Used on public news cards. Works with featured images and automatic fallback images from article content.</p>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div>
						<label for="imageFit" class="block text-xs font-medium text-slate-600 mb-1">Fit mode</label>
						<select
							id="imageFit"
							name="imageFit"
							class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						>
							<option value="cover" selected={(form?.imageFit ?? 'cover') === 'cover'}>Cover (fill card)</option>
							<option value="contain" selected={form?.imageFit === 'contain'}>Contain (preserve full image)</option>
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
							value={form?.imageFocusX ?? 50}
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
							value={form?.imageFocusY ?? 28}
							class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			<div>
				<p class="block text-sm font-medium text-slate-700 mb-1">Content <span class="text-red-500">*</span></p>
				<TipTapEditor name="content" content={form?.content ?? ''} placeholder="Write the article content…" />
			</div>

			<div>
				<label for="author" class="block text-sm font-medium text-slate-700 mb-1">Author</label>
				<input type="text" id="author" name="author" value={form?.author ?? ''}
					class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
					placeholder="e.g. IOEA Organizing Committee" />
			</div>
		</div>

		<div class="bg-white rounded-xl border border-slate-100 p-5 flex items-center justify-between">
			<label class="flex items-center gap-2.5 cursor-pointer">
				<input type="checkbox" name="published" class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
				<span class="text-sm font-medium text-slate-700">Publish immediately</span>
			</label>
			<button type="submit" disabled={saving} class="btn btn-primary {saving ? 'opacity-70' : ''}">
				<Save size={16} /> {saving ? 'Saving…' : 'Save article'}
			</button>
		</div>
	</form>
</div>
