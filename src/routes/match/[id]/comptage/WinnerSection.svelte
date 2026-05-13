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

<style>
	.winner-block {
		background: var(--b-yellow);
		border: var(--b-border-thick);
		box-shadow: var(--b-shadow);
		padding: 1.5rem 1rem;
		text-align: center;
		margin-top: 1rem;
		position: relative;
		overflow: hidden;
	}
	.winner-block::before {
		content: '';
		position: absolute;
		inset: 8px;
		border: 2px dashed var(--b-ink);
		pointer-events: none;
	}
	.winner-stamp {
		font-family: var(--font-display);
		font-size: 0.95rem;
		letter-spacing: 4px;
		color: var(--b-ink);
		text-transform: uppercase;
		margin-bottom: 6px;
		position: relative;
	}
	.winner-team {
		font-family: var(--font-display);
		font-size: 2rem;
		line-height: 1;
		text-transform: uppercase;
		letter-spacing: -1px;
		color: var(--b-ink);
		margin-bottom: 12px;
		position: relative;
	}
	.winner-score-line {
		font-family: var(--font-display);
		font-size: 2.5rem;
		line-height: 1;
		letter-spacing: -2px;
		margin-bottom: 1.25rem;
		position: relative;
	}
	.winner-score-line .winner-color {
		color: var(--b-ink);
	}
	.winner-score-line .loser-color {
		color: var(--b-ink-soft);
		opacity: 0.5;
	}
	.winner-sep {
		color: var(--b-ink);
		margin: 0 8px;
		opacity: 0.4;
	}
	.winner-submit {
		font-family: var(--font-mono) !important;
		font-size: 0.85rem !important;
		font-weight: 700;
		letter-spacing: 1.5px;
		padding: 12px 18px !important;
		background: var(--b-ink) !important;
		color: var(--b-yellow) !important;
		border: 2px solid var(--b-ink) !important;
		margin: 0 !important;
		width: 100%;
		box-shadow: none !important;
		cursor: pointer;
		text-transform: uppercase;
		position: relative;
	}
	.winner-submit:hover {
		background: var(--b-red) !important;
		color: var(--b-bg) !important;
		transform: none !important;
		box-shadow: none !important;
	}

	@media (max-width: 380px) {
		.winner-team { font-size: 1.6rem; }
		.winner-score-line { font-size: 2rem; }
	}
</style>
