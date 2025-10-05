<script lang="ts">
	import '@picocss/pico/css/pico.min.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>BCC - Coinche</title>
</svelte:head>

<div class="container">
	<header>
		<nav>
			<ul>
				<li><strong><a href="/">BCC</a></strong></li>
			</ul>
			<ul>
				<li><a href="/tournois">Tournois</a></li>
				<li><a href="/equipes">Équipes</a></li>
			</ul>
		</nav>
	</header>

	<main>
		{@render children?.()}
	</main>

	<footer>
		<small>Belote Card Championship</small>
	</footer>
</div>
