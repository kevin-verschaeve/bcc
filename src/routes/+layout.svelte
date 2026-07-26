<script lang="ts">
	import './../pico.css';
	import baseCssUrl from '../base.css?url';
	import appThemeUrl from '../theme-app.css?url';
	import brutalistThemeUrl from '../theme-brutalist.css?url';
	import skeuomorpheThemeUrl from '../theme-skeuomorphe.css?url';
	import favicon from '$lib/assets/favicon.ico';
	import { getFlash } from 'sveltekit-flash-message';
	import { Toaster, toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { children } = $props();

	type Theme = 'app' | 'brutalist' | 'skeuomorphe';
	const themes: Theme[] = ['brutalist', 'app', 'skeuomorphe'];
	let theme = $state<Theme>('brutalist');

	const themeUrls: Record<Theme, string> = {
		app: appThemeUrl,
		brutalist: brutalistThemeUrl,
		skeuomorphe: skeuomorpheThemeUrl
	};
	const themeIcons: Record<Theme, string> = {
		brutalist: '🔲',
		app: '🎨',
		skeuomorphe: '♠️'
	};
	const themeLabels: Record<Theme, string> = {
		brutalist: 'brutal',
		app: 'classique',
		skeuomorphe: 'skeuomorphe'
	};

	const themeUrl = $derived(themeUrls[theme]);
	const nextTheme = $derived(themes[(themes.indexOf(theme) + 1) % themes.length]);

	const cycleTheme = () => {
		const next = themes[(themes.indexOf(theme) + 1) % themes.length];
		theme = next;
		localStorage.setItem('bcc-theme', theme);
	};

	// Register service worker for PWA - only once on mount
	onMount(() => {
		theme = (localStorage.getItem('bcc-theme') as Theme) || 'brutalist';

		if ('serviceWorker' in navigator) {
			// Always register from root scope
			navigator.serviceWorker
				.register('/sw.js', { scope: '/' })
				.then((registration) => {
					console.log('✅ Service Worker registered:', registration.scope);
				})
				.catch((error) => {
					console.error('❌ Service Worker registration error:', error);
				});
		}
	});

	const flash = getFlash(page);

	$effect(() => {
		const currentFlash = $flash;
		if (currentFlash) {
			if (currentFlash.type === 'success') {
				toast.success(currentFlash.message);
			} else if (currentFlash.type === 'error') {
				toast.error(currentFlash.message);
			}
			flash.set(undefined);
		}
	});

	const isActive = (path: string) => {
		return page.url.pathname.startsWith(path);
	};

	const getNavLinkClass = (path: string) => {
		const isCurrentActive = isActive(path);
		return isCurrentActive ? 'nav-link nav-link-active' : 'nav-link nav-link-outline';
	};

	let mobileMenuOpen = $state(false);

	const toggleMobileMenu = () => {
		mobileMenuOpen = !mobileMenuOpen;
	};

	const closeMobileMenu = () => {
		mobileMenuOpen = false;
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>BCC - Coinche</title>
	<link rel="stylesheet" href={baseCssUrl} />
	<link rel="stylesheet" href={themeUrl} />
</svelte:head>

<div class="container">
	<div class="toast-container">
		<Toaster position="top-center" richColors />
	</div>
	<header class="header-main">
		<nav class="header-nav">
			<div>
				<strong class="header-logo">
					<a href="/" class="header-logo-link">
						<span class="header-logo-icon">♠</span>
						<span class="header-logo-text">Coinche me if you can</span>
					</a>
				</strong>
			</div>

			<!-- Burger menu button for mobile -->
			<button class="burger-menu" class:burger-open={mobileMenuOpen} onclick={toggleMobileMenu} aria-label="Toggle menu">
				<span class="burger-line"></span>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
			</button>

			<!-- Navigation menu -->
			<ul class="header-nav-list" class:mobile-menu-open={mobileMenuOpen}>
				<li>
					<a href="https://www.notion.so/BCC-Tournament-bddfd1ac300c40bd9c41deec65a15bba" target="_blank" class="nav-link nav-link-secondary" onclick={closeMobileMenu}>
						Règles
					</a>
				</li>
				<li>
					<a href="/tournois" class={getNavLinkClass('/tournois')} onclick={closeMobileMenu}>
						Tournois
					</a>
				</li>
				<li>
					<a href="/equipes" class={getNavLinkClass('/equipes')} onclick={closeMobileMenu}>
						Équipes
					</a>
				</li>
				<li>
					<a href="/joueurs" class={getNavLinkClass('/joueurs')} onclick={closeMobileMenu}>
						Joueurs
					</a>
				</li>
				<li>
					<button class="theme-toggle" onclick={cycleTheme} aria-label="Changer le thème" title={`Passer au thème ${themeLabels[nextTheme]}`}>
						{themeIcons[nextTheme]}
					</button>
				</li>
			</ul>
		</nav>
	</header>

	{#if mobileMenuOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div class="menu-overlay" onclick={closeMobileMenu}></div>
	{/if}

	<main>
		{@render children?.()}
	</main>
</div>
