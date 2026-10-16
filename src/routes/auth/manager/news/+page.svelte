<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { formatDate } from '#lib/utils/news.js';
	import { Plus, Trash2, Eye, Image } from '@lucide/svelte';

	let { data } = $props();
	let confirmDelete = $state<number | null>(null);

	function handleRowClick(e: MouseEvent, articleId: number) {
		// Don't navigate if clicking on action buttons
		if ((e.target as HTMLElement).closest('[data-actions]')) return;
		goto(`/auth/manager/news/${articleId}/edit`);
	}
</script>

<svelte:head><title>News – IOEA Admin</title></svelte:head>

<div class="p-6 md:p-8">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">News Articles</h1>
			<p class="text-slate-500 text-sm mt-0.5">{data.articles.length} article{data.articles.length !== 1 ? 's' : ''}</p>
		</div>
		<a href="/auth/manager/news/new" class="btn btn-primary"><Plus size={16} /> New article</a>
	</div>

	{#if data.articles.length === 0}
		<div class="bg-white rounded-xl border border-slate-100 p-12 text-center text-slate-400">No articles yet. <a href="/auth/manager/news/new" class="text-primary hover:underline">Create one</a>.</div>
	{:else}
		<div class="space-y-2">
			{#each data.articles as article}
				<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
				<div
					role="presentation"
					class="bg-white rounded-xl border border-slate-100 hover:shadow-sm transition-shadow overflow-hidden cursor-pointer"
					onclick={(e) => handleRowClick(e, article.id)}
				>
					<div class="flex items-center gap-4 p-4">
						<!-- Thumbnail -->
						<div class="w-20 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
							{#if article.image}
								<img src={article.image} alt="" class="w-full h-full object-cover" />
							{:else}
								<Image size={18} class="text-slate-300" />
							{/if}
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-slate-700 truncate">{article.title}</p>
							<div class="flex items-center gap-3 text-xs text-slate-400 mt-1">
								<span>{formatDate(article.displayDate)}</span>
								{#if article.author}<span>{article.author}</span>{/if}
								<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {article.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}">
									{article.published ? 'Published' : 'Draft'}
								</span>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex items-center gap-2 flex-shrink-0" data-actions>
							{#if article.published}
								<a href="/news/{article.slug}" target="_blank" class="px-3 py-2 text-slate-500 hover:text-primary rounded-lg hover:bg-slate-100 transition-colors" title="View">
									<Eye size={18} />
								</a>
							{/if}
							{#if confirmDelete === article.id}
								<form method="POST" action="?/delete" use:enhance class="flex gap-1">
									<input type="hidden" name="id" value={article.id} />
									<button type="submit" class="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">Delete</button>
								</form>
								<button onclick={() => (confirmDelete = null)} class="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg font-medium hover:bg-slate-200 transition-colors">Cancel</button>
							{:else}
								<button onclick={() => (confirmDelete = article.id)} class="px-3 py-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
									<Trash2 size={18} />
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
