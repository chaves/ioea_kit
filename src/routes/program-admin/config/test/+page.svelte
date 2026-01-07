<script lang="ts">
	interface Props {
		data: {
			configsByCategory: Record<string, Array<{ key: string; value: string; updated: string }>>;
			testMessage: string;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Config Test</title>
</svelte:head>

<div class="p-8">
	<h1 class="text-2xl font-bold mb-4">Config Test Page</h1>
	<p class="mb-4">{data.testMessage}</p>
	<pre class="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(
			data.configsByCategory,
			null,
			2
		)}</pre>
</div>
