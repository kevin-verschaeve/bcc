<script lang="ts">
	import '@picocss/pico/css/pico.min.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { getFlash } from 'sveltekit-flash-message';
	import { Toaster, toast } from 'svelte-sonner';
	import { page } from '$app/state';

	let { children } = $props();

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
						<span class="header-logo-icon">&#x2660;</span>
						<span class="header-logo-text">Coinche me if you can</span>
					</a>
				</strong>
			</div>

			<!-- Burger menu button for mobile -->
			<button class="burger-menu" onclick={toggleMobileMenu} aria-label="Toggle menu">
				<span class="burger-line"></span>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
			</button>

			<!-- Navigation menu -->
			<ul class="header-nav-list" class:mobile-menu-open={mobileMenuOpen}>
				<li>
					<a href="https://www.notion.so/BCC-Tournament-bddfd1ac300c40bd9c41deec65a15bba" target="_blank" class="nav-link nav-link-secondary" onclick={closeMobileMenu}>
						📖 Règles
					</a>
				</li>
				<li>
					<a href="/tournois" class={getNavLinkClass('/tournois')} onclick={closeMobileMenu}>
						🏆 Tournois
					</a>
				</li>
				<li>
					<a href="/equipes" class={getNavLinkClass('/equipes')} onclick={closeMobileMenu}>
						👥 Équipes
					</a>
				</li>
				<li>
					<a href="/joueurs" class={getNavLinkClass('/joueurs')} onclick={closeMobileMenu}>
						🃏 Joueurs
					</a>
				</li>
			</ul>
		</nav>
	</header>

	<main>
		{@render children?.()}
	</main>
</div>
