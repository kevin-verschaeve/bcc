import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// Use Node.js runtime (latest stable version)
			runtime: 'nodejs20.x'
			// Note: memory and maxDuration require Vercel Pro plan
		})
	}
};

export default config;
