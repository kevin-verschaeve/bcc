<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
  <header>
    <h1>BCC</h1>

    <nav>
      <div>
        <ul>
          <li>
            <a href="/tournois">Tournois</a>
          </li>
          <li>
            <a href="/equipes">Équipes</a>
          </li>
        </ul>
      </div>
  </nav>
  </header>

  <main>
    {@render children?.()}
  </main>

  <footer>

  </footer>
</div>
