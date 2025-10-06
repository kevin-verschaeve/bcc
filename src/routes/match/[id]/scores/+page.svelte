<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

    const team1Wins = data.scores.filter(s => s.score_team1 > 1000).length;
	const team2Wins = data.scores.filter(s => s.score_team2 > 1000).length;
	const canAddScore = team1Wins < 2 && team2Wins < 2;
</script>

<a href="/tournois/{data.match.tournament.year}/jour/{data.match.number}" class="secondary">← Retour</a>

<hgroup>
	<h2>Scores du match</h2>
	<p>
		<span class="team1-color">{data.match.team1.name}</span>
		<strong>VS</strong>
		<span class="team2-color">{data.match.team2.name}</span>
	</p>
</hgroup>

{#each data.scores as score}
	<article style="position: relative;">
		<form method="POST" action="?/deleteScore" use:enhance style="position: absolute; top: 0.5rem; right: 0.5rem;">
			<input type="hidden" name="score_id" value={score.id} />
			<button type="submit" data-tooltip="Supprimer cette manche" class="secondary outline" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" aria-label="Supprimer">✕</button>
		</form>

		<form method="POST" action="?/updateScore" use:enhance>
			<input type="hidden" name="score_id" value={score.id} />

			<div class="grid">
				<label for="score_team1_{score.id}">
					Score {data.match.team1.name}
					<input
						type="number"
						name="score_team1"
						id="score_team1_{score.id}"
						value={score.score_team1}
						required
					/>
				</label>

				<label for="score_team2_{score.id}">
					Score {data.match.team2.name}
					<input
						type="number"
						name="score_team2"
						id="score_team2_{score.id}"
						value={score.score_team2}
						required
					/>
				</label>

				<div style="display: flex; align-items: flex-end;">
					<button type="submit">Modifier</button>
				</div>
			</div>
		</form>
	</article>
{/each}

{#if canAddScore}
	<h2>Ajouter un nouveau score</h2>

	<form method="POST" action="?/addScore" use:enhance>
		<div class="grid">
			<label for="new_score_team1">
				Score {data.match.team1.name}
				<input
					type="number"
					name="score_team1"
					id="new_score_team1"
					required
				/>
			</label>

			<label for="new_score_team2">
				Score {data.match.team2.name}
				<input
					type="number"
					name="score_team2"
					id="new_score_team2"
					required
				/>
			</label>

			<div style="display: flex; align-items: flex-end;">
				<button type="submit">Ajouter</button>
			</div>
		</div>
	</form>
{:else}
	<p><em>Le match est terminé - une équipe a déjà gagné 2 manches.</em></p>
{/if}
