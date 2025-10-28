import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit(),
		// Only include devtools in development
		...(mode === 'development' ? [devtoolsJson()] : [])
	],
	resolve: {
		conditions: ['svelte', 'browser']
	}
}));
