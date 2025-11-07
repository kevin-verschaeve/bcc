import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit(),
		...(mode === 'development' ? [devtoolsJson()] : []),
		SvelteKitPWA({
			strategies: 'generateSW',
			registerType: 'autoUpdate',
			injectRegister: null, // Disable auto-injection, we'll register manually
			manifest: {
				name: 'BCC - Coinche',
				short_name: 'BCC Coinche',
				description: 'Belote tournament management application',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				orientation: 'any',
				icons: [
					{
						src: '/bcc_full_192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/bcc_full_512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/bcc_full_512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico,txt,woff2}'],
				// Don't use NavigationRoute - let SvelteKit handle navigation
				navigateFallback: null,
				runtimeCaching: [
					{
						// Cache navigation requests (SvelteKit pages)
						urlPattern: ({ request }) => request.mode === 'navigate',
						handler: 'NetworkFirst',
						options: {
							cacheName: 'pages-cache',
							expiration: {
								maxEntries: 20,
								maxAgeSeconds: 60 * 60 // 1 hour
							}
						}
					},
					{
						urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'supabase-cache',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 5 // 5 minutes
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			},
			devOptions: {
				enabled: false,
				type: 'module'
			}
		})
	],
	resolve: {
		conditions: ['svelte', 'browser']
	}
}));
