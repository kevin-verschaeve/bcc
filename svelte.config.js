import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// Use Node.js runtime with optimal memory settings
			runtime: 'nodejs20.x',
			// Reduce cold start by limiting memory (smaller = faster boot)
			memory: 1024,
			// Set max duration for serverless functions
			maxDuration: 10
		})
	}
};

export default config;
