<script lang="ts">
	import './../pico.css';
	import '../base.css';
	// All themes ship in one bundle and are scoped by [data-bcc-theme];
	// switching is an attribute flip, so there is no stylesheet fetch and
	// no flash. app.html sets the attribute before first paint.
	import '../assets/css/themes/app.css';
	import '../assets/css/themes/brutalist.css';
	import '../assets/css/themes/skeuomorphe.css';
	import ThemePicker, { type Theme } from '$lib/components/ThemePicker.svelte';
	import favicon from '$lib/assets/favicon.ico';
	import { getFlash } from 'sveltekit-flash-message';
	import { Toaster, toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { children } = $props();

	const themes: Theme[] = ['brutalist', 'app', 'skeuomorphe'];
	const DEFAULT_THEME: Theme = 'app';

	// Read back what the app.html bootstrap already applied, so hydration
	// agrees with the painted DOM instead of resetting to the default.
	const readTheme = (): Theme => {
		if (typeof document === 'undefined') return DEFAULT_THEME;
		const applied = document.documentElement.dataset.bccTheme as Theme | undefined;
		return applied && themes.includes(applied) ? applied : DEFAULT_THEME;
	};

	let theme = $state<Theme>(readTheme());

	const setTheme = (next: Theme) => {
		theme = next;
		document.documentElement.dataset.bccTheme = next;
		try {
			localStorage.setItem('bcc-theme', next);
		} catch {
			// Private mode / storage disabled — the theme still applies for this session.
		}
	};

	// Register service worker for PWA - only once on mount
	onMount(() => {
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
			<button
				class="burger-menu"
				class:burger-open={mobileMenuOpen}
				onclick={toggleMobileMenu}
				aria-label="Toggle menu"
			>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
			</button>

			<!-- Navigation menu -->
			<ul class="header-nav-list" class:mobile-menu-open={mobileMenuOpen}>
				<li>
					<a
						href="https://www.notion.so/BCC-Tournament-bddfd1ac300c40bd9c41deec65a15bba"
						target="_blank"
						class="nav-link nav-link-secondary"
						onclick={closeMobileMenu}
					>
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
					<ThemePicker {theme} {setTheme} />
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
