<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { WINNING_SCORE } from '$lib/scoreUtils';
	import type { ComptageGame } from './comptage.svelte.js';

	let { game }: { game: ComptageGame } = $props();

	const winnerTeam = $derived(
		game.team1Total >= WINNING_SCORE ? game.match.team1.name : game.match.team2.name
	);
	const team1Won = $derived(game.team1Total >= WINNING_SCORE);
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

	<div class="winner-block">
		<div class="winner-stamp">VICTOIRE</div>
		<div class="winner-team">{winnerTeam}</div>
		<div class="winner-score-line">
			<span class:winner-color={team1Won} class:loser-color={!team1Won}>{game.team1Total}</span>
			<span class="winner-sep">·</span>
			<span class:winner-color={!team1Won} class:loser-color={team1Won}>{game.team2Total}</span>
		</div>
		<button type="submit" class="winner-submit">
			VALIDER & NOUVELLE MANCHE →
		</button>
	</div>
</form>
