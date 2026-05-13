<script lang="ts">
	import type { ComptageGame } from './comptage.svelte.js';
	import { suits, pointOptions } from './comptage.svelte.js';

	let { game }: { game: ComptageGame } = $props();

	const teams = $derived([
		{
			key: 'team1' as const,
			name: game.match.team1.name,
			players: [game.match.team1.player1, game.match.team1.player2]
		},
		{
			key: 'team2' as const,
			name: game.match.team2.name,
			players: [game.match.team2.player1, game.match.team2.player2]
		}
	]);
</script>

<div class="contract-step">
	<div class="step-header">
		<span class="step-num">1</span>
		<span class="step-label">CONTRAT</span>
	</div>
	<div class="points-grid">
		{#each pointOptions as points}
			<button
				type="button"
				class="contract-btn"
				class:special={points === 'Capot' || points === 'Générale'}
				class:selected={game.selectedPoints === points}
				onclick={() => game.selectPoints(points)}
			>{points}</button>
		{/each}
	</div>
</div>

<div class="contract-step">
	<div class="step-header">
		<span class="step-num">2</span>
		<span class="step-label">ATOUT</span>
	</div>
	<div class="suits-grid">
		{#each suits as suit}
			<button
				type="button"
				class="suit-btn"
				class:selected={game.selectedSuit === suit}
				class:red={suit === '♥' || suit === '♦'}
				onclick={() => game.selectSuit(suit)}
			>{suit}</button>
		{/each}
	</div>
</div>

<div class="contract-step">
	<div class="step-header">
		<span class="step-num">3</span>
		<span class="step-label">PRENEUR</span>
	</div>
	<div class="players-row">
		{#each teams as team}
			<div class="players-team">
				<span class="players-team-label {team.key}-color">{team.name}</span>
				{#each team.players as player}
					<button
						type="button"
						class="player-btn"
						class:selected={game.taker === player.name}
						onclick={() => game.selectTaker(player.name, team.key)}
					>
						<span class="player-name">{player.name}</span>
						{#if game.currentDealer === player.name}
							<span class="dealer-badge-mini" title="Donneur">D</span>
						{/if}
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.contract-step {
		margin-bottom: 1.25rem;
	}
	.contract-step:last-child {
		margin-bottom: 0;
	}
	.step-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}
	.step-num {
		font-family: var(--font-display);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: var(--b-ink);
		color: var(--b-yellow);
		font-size: 0.95rem;
		line-height: 1;
	}
	.step-label {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 1.5px;
		color: var(--b-ink);
	}

	/* --- Points (contrat) --- */
	.points-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
	}
	.contract-btn {
		font-family: var(--font-display) !important;
		font-size: 1.05rem !important;
		padding: 10px 4px !important;
		background: var(--b-bg) !important;
		color: var(--b-ink) !important;
		border: 2px solid var(--b-ink) !important;
		margin: 0 !important;
		box-shadow: none !important;
		cursor: pointer;
		min-height: 44px;
		text-transform: uppercase;
		letter-spacing: 0.3px;
	}
	.contract-btn:hover {
		background: var(--b-ink) !important;
		color: var(--b-yellow) !important;
		transform: none !important;
		box-shadow: 2px 2px 0 var(--b-ink) !important;
	}
	.contract-btn.special {
		background: var(--b-ink) !important;
		color: var(--b-bg) !important;
		font-size: 0.85rem !important;
		grid-column: span 2;
	}
	.contract-btn.special:hover {
		background: var(--b-red) !important;
		color: var(--b-bg) !important;
	}
	.contract-btn.selected {
		background: var(--b-yellow) !important;
		color: var(--b-ink) !important;
		transform: translate(-1px, -1px) !important;
		box-shadow: 3px 3px 0 var(--b-ink) !important;
	}

	/* --- Suits --- */
	.suits-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 6px;
	}
	.suit-btn {
		font-family: var(--font-display) !important;
		font-size: 1.5rem !important;
		padding: 8px 4px !important;
		background: var(--b-bg) !important;
		color: var(--b-ink) !important;
		border: 2px solid var(--b-ink) !important;
		margin: 0 !important;
		box-shadow: none !important;
		cursor: pointer;
		min-height: 52px;
	}
	.suit-btn.red { color: var(--b-red) !important; }
	.suit-btn:hover {
		background: var(--b-ink) !important;
		color: var(--b-yellow) !important;
		transform: none !important;
		box-shadow: 2px 2px 0 var(--b-ink) !important;
	}
	.suit-btn.red:hover { color: var(--b-red) !important; }
	.suit-btn.selected {
		background: var(--b-yellow) !important;
		transform: translate(-1px, -1px) !important;
		box-shadow: 3px 3px 0 var(--b-ink) !important;
	}
	.suit-btn.red.selected { color: var(--b-red) !important; }

	/* --- Players (preneur) --- */
	.players-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.players-team {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.players-team-label {
		font-family: var(--font-mono) !important;
		font-size: 0.7rem !important;
		font-weight: 700;
		letter-spacing: 1.2px;
		text-transform: uppercase;
		margin-bottom: 2px;
	}
	.player-btn {
		font-family: var(--font-mono) !important;
		font-size: 0.85rem !important;
		font-weight: 700;
		padding: 10px 8px !important;
		background: var(--b-bg) !important;
		color: var(--b-ink) !important;
		border: 2px solid var(--b-ink) !important;
		margin: 0 !important;
		box-shadow: none !important;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		min-height: 44px;
		text-transform: uppercase;
	}
	.player-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
		flex: 1;
		text-align: left;
	}
	.player-btn:hover {
		background: var(--b-ink) !important;
		color: var(--b-yellow) !important;
		transform: none !important;
		box-shadow: 2px 2px 0 var(--b-ink) !important;
	}
	.player-btn.selected {
		background: var(--b-yellow) !important;
		color: var(--b-ink) !important;
		transform: translate(-1px, -1px) !important;
		box-shadow: 3px 3px 0 var(--b-ink) !important;
	}
	.dealer-badge-mini {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--b-red);
		color: var(--b-bg);
		font-family: var(--font-display);
		font-size: 0.68rem;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	@media (max-width: 380px) {
		.contract-btn { font-size: 0.95rem !important; padding: 8px 2px !important; }
		.contract-btn.special { font-size: 0.78rem !important; }
		.suit-btn { font-size: 1.3rem !important; }
	}
</style>
