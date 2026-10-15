import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			// Consult https://svelte.dev/docs/kit/integrations
			// for more information about preprocessors
			preprocess: vitePreprocess(),
			adapter: adapter({ out: 'build' }),
			// Replaces adapter-node's ORIGIN env var (removed in adapter-node 6), and
			// is now baked in at build time. Form actions are rejected as CSRF when
			// the browser's Origin differs, so a local build needs ORIGIN set to it.
			paths: { origin: process.env.ORIGIN || 'https://www.ioea.eu' }
		})
	],
	define: { __BUILD_ID__: JSON.stringify(Date.now().toString()) }
});
