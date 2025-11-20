<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	const WINNING_SCORE = 1000;

	let { data }: PageProps = $props();

	const team1Wins = $derived(data.scores.filter(s => s.score_team1 >= WINNING_SCORE	).length);
	const team2Wins = $derived(data.scores.filter(s => s.score_team2 >= WINNING_SCORE).length);
	const canAddScore = $derived(team1Wins < 2 && team2Wins < 2);
</script>

<a href="/tournois/{data.match.tournament.year}/jour/{data.match.number}" class="secondary">← Retour</a>

<div class="match-header">
	<hgroup class="m-0">
		<h2 class="mb-sm">Résultat du match</h2>
		<div class="match-vs-container">
			<div class="match-team-box">
				<span class="team1-color match-team-name">{data.match.team1.name}</span>
				<div class="match-team-score">
					{team1Wins}
				</div>
			</div>
			<strong class="match-vs-text">VS</strong>
			<div class="match-team-box">
				<span class="team2-color match-team-name">{data.match.team2.name}</span>
				<div class="match-team-score">
					{team2Wins}
				</div>
			</div>
		</div>
	</hgroup>
</div>

{#if data.scores.length > 0}
	<h3 class="section-title">Manches jouées</h3>
{/if}

{#each data.scores as score, index}
	<article class="score-card">
		<div class="score-card-header">
			<h4 class="m-0 table-cell-muted">Manche {index + 1}</h4>
			<form method="POST" action="?/deleteScore" use:enhance class="delete-btn">
				<input type="hidden" name="score_id" value={score.id} />
				<button type="submit" title="Supprimer cette manche" class="secondary outline" aria-label="Supprimer">✕</button>
			</form>
		</div>

		<form method="POST" action="?/updateScore" use:enhance>
			<input type="hidden" name="score_id" value={score.id} />

			<div class="score-form-grid">
				<label for="score_team1_{score.id}">
					<span class="team1-color">{data.match.team1.name}</span>
					<input
						type="number"
						name="score_team1"
						id="score_team1_{score.id}"
						value={score.score_team1}
						min="0"
						required
						class="score-input-large"
					/>
				</label>

				<label for="score_team2_{score.id}">
					<span class="team2-color">{data.match.team2.name}</span>
					<input
						type="number"
						name="score_team2"
						id="score_team2_{score.id}"
						value={score.score_team2}
						min="0"
						required
						class="score-input-large"
					/>
				</label>

				<div class="flex-row">
					<button type="submit" class="m-0">Modifier</button>
				</div>
			</div>

			{#if score.score_team1 >= WINNING_SCORE || score.score_team2 >= WINNING_SCORE}
				<div class="score-winner-badge">
					{score.score_team1 >= WINNING_SCORE ? data.match.team1.name : data.match.team2.name} remportent la manche !
				</div>
			{/if}
		</form>
	</article>
{/each}

{#if canAddScore}
	<article class="score-add-section">
		<h3 class="section-title">Ajouter un nouveau score</h3>

		<form method="POST" action="?/addScore" use:enhance>
			<div class="score-form-grid">
				<label for="new_score_team1">
					<span class="team1-color">{data.match.team1.name}</span>
					<input
						type="number"
						name="score_team1"
						id="new_score_team1"
						min="0"
						required
						placeholder="0"
						class="score-input-large"
					/>
				</label>

				<label for="new_score_team2">
					<span class="team2-color">{data.match.team2.name}</span>
					<input
						type="number"
						name="score_team2"
						id="new_score_team2"
						min="0"
						required
						placeholder="0"
						class="score-input-large"
					/>
				</label>

				<div class="flex-row">
					<button type="submit" class="m-0">Ajouter</button>
				</div>
			</div>
		</form>
	</article>
{:else}
	<article class="score-completed-section">
		<p class="score-completed-text">
			<strong>Match terminé !</strong><br>
			<span class="score-completed-subtext">
				{team1Wins ? data.match.team1.name : data.match.team2.name} ont remporté 2 manches
			</span>
		</p>
	</article>
{/if}
