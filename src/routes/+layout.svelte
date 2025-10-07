<script lang="ts">
	import '@picocss/pico/css/pico.min.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { getFlash } from 'sveltekit-flash-message';
  import { Toaster, toast } from 'svelte-sonner';
	import { page } from '$app/state';

	let { children } = $props();

	const flash = getFlash(page);

    flash.subscribe(($flash) => {
        if (!$flash) return;
        if ($flash.type === 'success') {
            toast.success($flash.message);
        } else {
            toast.error($flash.message);
        }
        flash.set(undefined);
    });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>BCC - Coinche</title>
</svelte:head>

<div class="container">
    <Toaster position="top-center" richColors />
	<header>
		<nav>
			<ul>
				<li><strong><a href="/">BCC</a></strong></li>
			</ul>
			<ul>
				<li>
					<a href="https://www.notion.so/BCC-Tournament-bddfd1ac300c40bd9c41deec65a15bba" target="_blank" class="secondary" role="button">
						&#x2660; Règles du jeu
					</a>
				</li>
				<li><a href="/tournois">Tournois</a></li>
				<li><a href="/equipes">Équipes</a></li>
				<li><a href="/joueurs">Joueurs</a></li>
			</ul>
		</nav>
	</header>

	<main>
		{@render children?.()}
	</main>

	<footer>
	</footer>
</div>
