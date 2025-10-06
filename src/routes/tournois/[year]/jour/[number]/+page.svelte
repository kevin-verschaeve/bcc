<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const matchScores = $state(data.scores);
</script>

<a href="/tournois/{data.tournament.year}" class="secondary">← Retour</a>

<hgroup>
	<h1>Jour {page.params.number}</h1>
	<p>Tournoi {data.tournament.year}</p>
</hgroup>

<table role="grid">
	<thead>
		<tr>
			<th scope="col">Match</th>
			<th scope="col">Scores</th>
			<th scope="col">Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each data.matchs as match}
			<tr>
				<td>
					<span class="team1-color">{match.team1.name}</span>
					<strong>VS</strong>
					<span class="team2-color">{match.team2.name}</span>
				</td>
				<td>
					{#each matchScores[match.id] ?? [] as score}
						<p>
							<span class="team1-color">{score.score_team1}</span>
							-
							<span class="team2-color">{score.score_team2}</span>
						</p>
					{:else}
						<p><em>En attente</em></p>
					{/each}
				</td>
				<td>
					<a href="/match/{match.id}/scores">Modifier</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
