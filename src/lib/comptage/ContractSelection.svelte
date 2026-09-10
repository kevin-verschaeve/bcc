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
