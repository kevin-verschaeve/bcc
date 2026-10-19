<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Erreur {page.status}</title>
</svelte:head>

<article class="empty-state">
	<h1 class="empty-state-title">{page.status === 404 ? 'Page introuvable' : 'Une erreur est survenue'}</h1>
	<p class="empty-state-with-action">
		{page.status === 404
			? "La page que vous cherchez n'existe pas."
			: (page.error?.message ?? 'Veuillez réessayer dans un instant.')}
	</p>
	<a href="/" role="button">Retour à l'accueil</a>
</article>
