<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { WINNING_SCORE } from '$lib/scoreUtils';
	import type { ComptageGame } from './comptage.svelte.js';

	let { game }: { game: ComptageGame } = $props();
</script>

<form
	method="POST"
	action="?/saveScore"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				game.resetAll(false);
			}
			await applyAction(result);
		};
	}}
>
	<input type="hidden" name="score_team1" value={game.team1Total} />
	<input type="hidden" name="score_team2" value={game.team2Total} />
	<div class="winner-section">
		<p class="winner-text">
			<strong
				>{game.team1Total >= WINNING_SCORE
					? game.match.team1.name
					: game.match.team2.name}</strong
			> remportent la manche
			<span class="winner-scores">
				<span class="team1-color">{game.team1Total}</span> - <span class="team2-color"
					>{game.team2Total}</span
				>
			</span>
		</p>
		<button type="submit">Valider et nouvelle manche</button>
	</div>
</form>

<style>
	.winner-section {
		text-align: center;
		margin-top: 1rem;
	}

	.winner-text {
		margin: 0 0 1rem 0;
	}

	.winner-scores {
		font-weight: bold;
		margin-left: 0.5rem;
	}

	.winner-section button {
		margin: 0;
	}
</style>
