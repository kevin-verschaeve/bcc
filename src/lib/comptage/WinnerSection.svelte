<script lang="ts">
	import type { Snippet } from 'svelte';
	import { WINNING_SCORE } from '$lib/scoreUtils';
	import type { ComptageGame } from './comptage.svelte.js';

	// Purely presentational: what happens once a team wins (saving a tournament
	// score, starting another one-off game…) is left to the caller's snippet.
	let { game, children }: { game: ComptageGame; children?: Snippet } = $props();

	const team1Won = $derived(game.team1Total >= WINNING_SCORE);
</script>

<div class="winner-block">
	<div class="winner-stamp">VICTOIRE</div>
	<div class="winner-team">{game.winnerTeamName}</div>
	<div class="winner-score-line">
		<span class:winner-color={team1Won} class:loser-color={!team1Won}>{game.team1Total}</span>
		<span class="winner-sep">·</span>
		<span class:winner-color={!team1Won} class:loser-color={team1Won}>{game.team2Total}</span>
	</div>
	{@render children?.()}
</div>
