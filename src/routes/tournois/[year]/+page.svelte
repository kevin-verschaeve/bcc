<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<a href="/tournois" class="secondary">← Retour</a>

<hgroup>
	<h1>Tournoi {data.tournament.year}</h1>
	<p>{data.tournament.name || 'Saison ' + data.tournament.year}</p>
</hgroup>

<nav>
	<ul>
		<li>
			<a href="/tournois/{data.tournament.year}/equipes" role="button" class="outline">
				Équipes du tournois
			</a>
		</li>
		{#if data.tournament.status === 'not_started'}
			<li>
				<form method="POST" action="?/startTournament">
					<input type="hidden" name="tournament" value={data.tournament.id} />
					<button type="submit" class="contrast">Démarrer le tournoi</button>
				</form>
			</li>
		{/if}
	</ul>
</nav>

<div class="grid">
	{#each Object.entries(data.days) as [number, day]}
		<article>
			<header>
				<strong>Jour {number}</strong>
			</header>
			<a href="/tournois/{data.tournament.year}/jour/{number}">Voir les matchs →</a>
		</article>
	{/each}
</div>
