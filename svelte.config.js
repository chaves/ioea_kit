import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			out: 'build',
			// Allow larger body for file uploads (CV + paper, max 5MB each)
			bodySize: 12 * 1024 * 1024 // 12MB
		})
	}
};

export default config;
