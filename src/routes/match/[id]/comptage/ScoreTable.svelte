<script lang="ts">
	import type { ComptageGame } from './comptage.svelte.js';

	let { game }: { game: ComptageGame } = $props();
</script>

<table class="score-table striped">
	<thead>
		<tr>
			<th class="team1-color">{game.match.team1.name}</th>
			<th class="team2-color">{game.match.team2.name}</th>
		</tr>
	</thead>
	<tbody>
		{#each Array.from({ length: Math.max(game.team1Points.length, game.team2Points.length) }) as _, index}
			<tr>
				<td class="team-cell">
					{#if index < game.team1Points.length}
						<span class="point-value">{game.team1Points[index]}</span>
						<button
							type="button"
							class="delete-btn"
							onclick={() => game.removePointTeam1(index)}
							aria-label="Supprimer"
						>×</button>
					{/if}
				</td>
				<td class="team-cell">
					{#if index < game.team2Points.length}
						<span class="point-value">{game.team2Points[index]}</span>
						<button
							type="button"
							class="delete-btn"
							onclick={() => game.removePointTeam2(index)}
							aria-label="Supprimer"
						>×</button>
					{/if}
				</td>
			</tr>
		{/each}
		{#if game.team1Points.length === 0 && game.team2Points.length === 0}
			<tr>
				<td colspan="2" class="empty-cell">Aucun point enregistré</td>
			</tr>
		{/if}
	</tbody>
</table>

<style>
	.score-table {
		width: 100%;
		margin: 0;
		border-collapse: collapse;
	}

	.score-table thead th {
		padding: 0.75rem;
		font-weight: 600;
		font-size: 1em;
		text-align: center;
		border-bottom: 2px solid var(--pico-muted-border-color);
	}

	.score-table tbody tr {
		border-bottom: 1px solid var(--pico-muted-border-color);
	}

	.team-cell {
		padding: 0.5rem;
		text-align: center;
		width: 50%;
		position: relative;
	}

	.team-cell .point-value {
		font-weight: 600;
		font-size: 1.1em;
		margin-right: 0.5rem;
	}

	.empty-cell {
		text-align: center;
		opacity: 0.6;
		font-style: italic;
		padding: 1.5rem 0.5rem;
	}

	.delete-btn {
		background: transparent;
		border: none;
		color: var(--pico-del-color);
		font-size: 1.3em;
		line-height: 1;
		padding: 0;
		margin: 0;
		cursor: pointer;
		width: 1.75rem;
		height: 1.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.15s ease;
		vertical-align: middle;
	}

	.delete-btn:hover {
		background: var(--pico-del-color);
		color: white;
	}
</style>
