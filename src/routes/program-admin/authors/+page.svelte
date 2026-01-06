<script lang="ts">
	import { enhance } from '$app/forms';

	interface Author {
		id: number;
		prenom: string;
		nom: string;
		instit: string;
		home: string;
		email: string;
		photo: string;
	}

	interface Props {
		data: {
			authors: Author[];
		};
		form?: {
			error?: string;
			success?: boolean;
			message?: string;
		};
	}

	let { data, form }: Props = $props();
	let showCreateForm = $state(false);
	let editingAuthor = $state<Author | null>(null);
	let deleteConfirm = $state<number | null>(null);
</script>

<svelte:head>
	<title>Manage Authors | Program Admin</title>
</svelte:head>

<div class="p-8">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-3xl font-bold mb-2">Authors</h1>
			<p class="text-text-light">Manage presentation authors and speakers</p>
		</div>
		<button
			onclick={() => {
				showCreateForm = !showCreateForm;
				editingAuthor = null;
			}}
			class="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
		>
			{showCreateForm ? 'Cancel' : '+ Add Author'}
		</button>
	</div>

	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
			{form.error}
		</div>
	{/if}

	{#if form?.success && form?.message}
		<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
			{form.message}
		</div>
	{/if}

	{#if showCreateForm || editingAuthor}
		<div class="bg-white rounded-lg border border-border p-6 shadow-sm mb-6">
			<h2 class="text-xl font-bold mb-4">{editingAuthor ? 'Edit Author' : 'Create New Author'}</h2>
			<form
				method="POST"
				action="?/{editingAuthor ? 'update' : 'create'}"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							showCreateForm = false;
							editingAuthor = null;
						}
					};
				}}
			>
				{#if editingAuthor}
					<input type="hidden" name="id" value={editingAuthor.id} />
				{/if}

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label for="prenom" class="block text-sm font-semibold mb-2">First Name *</label>
						<input
							type="text"
							id="prenom"
							name="prenom"
							value={editingAuthor?.prenom || ''}
							required
							class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="nom" class="block text-sm font-semibold mb-2">Last Name *</label>
						<input
							type="text"
							id="nom"
							name="nom"
							value={editingAuthor?.nom || ''}
							required
							class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>

				<div class="mb-4">
					<label for="instit" class="block text-sm font-semibold mb-2">Institution</label>
					<input
						type="text"
						id="instit"
						name="instit"
						value={editingAuthor?.instit || ''}
						class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label for="email" class="block text-sm font-semibold mb-2">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={editingAuthor?.email || ''}
							class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="home" class="block text-sm font-semibold mb-2">Website</label>
						<input
							type="url"
							id="home"
							name="home"
							value={editingAuthor?.home || ''}
							placeholder="https://..."
							class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>

				<div class="mb-6">
					<label for="photo" class="block text-sm font-semibold mb-2">Photo Filename</label>
					<input
						type="text"
						id="photo"
						name="photo"
						value={editingAuthor?.photo || ''}
						placeholder="author-photo.jpg"
						class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					<p class="text-sm text-text-light mt-1">Upload photos to /static/images/lec/ directory</p>
				</div>

				<div class="flex gap-3">
					<button
						type="submit"
						class="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
					>
						{editingAuthor ? 'Update Author' : 'Create Author'}
					</button>
					<button
						type="button"
						onclick={() => {
							showCreateForm = false;
							editingAuthor = null;
						}}
						class="bg-border text-text px-6 py-2.5 rounded-lg font-semibold hover:bg-border/80 transition-colors duration-200"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
		<table class="w-full">
			<thead class="bg-bg border-b border-border">
				<tr>
					<th class="text-left px-6 py-4 font-semibold text-sm">Name</th>
					<th class="text-left px-6 py-4 font-semibold text-sm">Institution</th>
					<th class="text-left px-6 py-4 font-semibold text-sm">Email</th>
					<th class="text-left px-6 py-4 font-semibold text-sm">Photo</th>
					<th class="text-right px-6 py-4 font-semibold text-sm">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.authors.length === 0}
					<tr>
						<td colspan="5" class="text-center px-6 py-8 text-text-light">
							No authors found. Add your first author to get started.
						</td>
					</tr>
				{:else}
					{#each data.authors as author}
						<tr class="border-b border-border hover:bg-bg transition-colors duration-150">
							<td class="px-6 py-4">
								<div class="font-semibold">{author.prenom} {author.nom}</div>
								{#if author.home}
									<a href={author.home} target="_blank" rel="noopener noreferrer" class="text-sm text-primary hover:underline">
										Website →
									</a>
								{/if}
							</td>
							<td class="px-6 py-4 text-text-light">{author.instit || '—'}</td>
							<td class="px-6 py-4 text-text-light">{author.email || '—'}</td>
							<td class="px-6 py-4 text-text-light text-sm">{author.photo || '—'}</td>
							<td class="px-6 py-4">
								<div class="flex items-center justify-end gap-2">
									<button
										onclick={() => {
											editingAuthor = author;
											showCreateForm = false;
										}}
										class="text-primary hover:text-primary-dark font-semibold px-3 py-1.5 rounded hover:bg-primary/10 transition-colors duration-150"
									>
										Edit
									</button>
									{#if deleteConfirm === author.id}
										<form
											method="POST"
											action="?/delete"
											use:enhance={() => {
												return async ({ result, update }) => {
													await update();
													deleteConfirm = null;
												};
											}}
											class="inline"
										>
											<input type="hidden" name="id" value={author.id} />
											<button
												type="submit"
												class="text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded hover:bg-red-50 transition-colors duration-150"
											>
												Confirm Delete
											</button>
										</form>
										<button
											onclick={() => deleteConfirm = null}
											class="text-text-light hover:text-text font-semibold px-3 py-1.5 rounded hover:bg-bg transition-colors duration-150"
										>
											Cancel
										</button>
									{:else}
										<button
											onclick={() => deleteConfirm = author.id}
											class="text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded hover:bg-red-50 transition-colors duration-150"
										>
											Delete
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
