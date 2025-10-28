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
	},
	build: {
		// Optimize chunk sizes for faster cold starts
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					// Only chunk client-side vendor libraries
					if (id.includes('node_modules')) {
						if (id.includes('@event-calendar')) return 'calendar';
						if (id.includes('luxon')) return 'luxon';
						if (id.includes('svelecte')) return 'svelecte';
						if (id.includes('svelte-sonner')) return 'toast';
					}
				}
			}
		},
		// Optimize minification
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true, // Remove console.logs in production
				passes: 2
			}
		},
		// Reduce chunk size warnings threshold
		chunkSizeWarningLimit: 600
	}
}));
