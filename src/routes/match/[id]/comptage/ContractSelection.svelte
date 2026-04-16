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

<div class="points-container">
	{#each pointOptions as points}
		<button
			type="button"
			class="point-btn"
			class:selected={game.selectedPoints === points}
			onclick={() => game.selectPoints(points)}
		>{points}</button>
	{/each}
</div>

<div class="suits-container">
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

<div class="players-selection">
	{#each teams as team}
		<div class="player-group">
			<span class="team-label {team.key}-color">{team.name}</span>
			<div class="player-buttons">
				{#each team.players as player}
					<button
						type="button"
						class="player-btn"
						class:selected={game.taker === player.name}
						onclick={() => game.selectTaker(player.name, team.key)}
					>
						{player.name}
						{#if game.currentDealer === player.name}
							<span class="dealer-badge">D</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.points-container {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.point-btn {
		font-size: 0.9rem;
		padding: 0.4rem 0.3rem;
		background: var(--pico-card-background-color);
		border: 2px solid var(--pico-muted-border-color);
		border-radius: 6px;
		cursor: pointer;
		margin: 0;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		color: var(--pico-contrast);
	}

	.point-btn:hover {
		border-color: var(--pico-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.point-btn.selected {
		border-width: 3px;
		border-color: var(--pico-primary);
		background: var(--pico-card-background-color);
		box-shadow:
			0 0 0 3px var(--pico-primary-background),
			0 4px 12px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	@media (min-width: 768px) {
		.points-container {
			display: flex;
			justify-content: center;
			gap: 0.5rem;
			flex-wrap: wrap;
		}

		.point-btn {
			font-size: 1rem;
			padding: 0.5rem 0.8rem;
			min-width: 4rem;
		}
	}

	.suits-container {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.suit-btn {
		font-size: 1.3rem;
		padding: 0.4rem 0.5rem;
		background: var(--pico-card-background-color);
		border: 2px solid var(--pico-muted-border-color);
		border-radius: 6px;
		cursor: pointer;
		margin: 0;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		color: #000000;
	}

	.suit-btn:hover {
		border-color: var(--pico-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.suit-btn.selected {
		border-width: 3px;
		border-color: var(--pico-primary);
		background: var(--pico-card-background-color);
		box-shadow:
			0 0 0 3px var(--pico-primary-background),
			0 4px 12px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	.suit-btn.red {
		color: #e53935;
	}

	@media (min-width: 768px) {
		.suits-container {
			display: flex;
			justify-content: center;
			gap: 1rem;
		}

		.suit-btn {
			font-size: 2rem;
			padding: 0.5rem 1rem;
			min-width: 3.5rem;
		}
	}

	.players-selection {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	@media (min-width: 768px) {
		.players-selection {
			flex-direction: row;
			gap: 2rem;
		}
	}

	.player-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	@media (min-width: 768px) {
		.player-group {
			flex: 1;
		}
	}

	.team-label {
		font-weight: 600;
		font-size: 0.9em;
	}

	.player-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.player-btn {
		background: var(--pico-card-background-color);
		border: 2px solid var(--pico-muted-border-color);
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: inherit;
		color: var(--pico-contrast);
		margin: 0;
		transition: all 0.2s ease;
		flex: 1;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.3em;
	}

	.player-btn:hover {
		border-color: var(--pico-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.player-btn.selected {
		border-width: 3px;
		border-color: var(--pico-primary);
		background: var(--pico-card-background-color);
		box-shadow:
			0 0 0 3px var(--pico-primary-background),
			0 4px 12px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	.dealer-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--pico-primary);
		color: var(--pico-primary-inverse, #fff);
		border-radius: 50%;
		width: 1.3em;
		height: 1.3em;
		font-size: 0.72em;
		font-weight: bold;
		vertical-align: middle;
		line-height: 1;
		flex-shrink: 0;
	}
</style>
