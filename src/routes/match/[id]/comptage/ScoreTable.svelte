<script lang="ts">
	import type { ComptageGame } from './comptage.svelte.js';

	let { game }: { game: ComptageGame } = $props();

	const rows = $derived(
		Math.max(game.team1Points.length, game.team2Points.length)
	);
</script>

<section class="history-section">
	<div class="history-head">
		<h3 class="history-title">HISTORIQUE</h3>
		<span class="history-count">{rows} ligne{rows > 1 ? 's' : ''}</span>
	</div>
	<table class="history-table">
		<thead>
			<tr>
				<th class="hist-th team1-color">{game.match.team1.name}</th>
				<th class="hist-th team2-color">{game.match.team2.name}</th>
			</tr>
		</thead>
		<tbody>
			{#each Array.from({ length: rows }) as _, index}
				<tr>
					<td class="hist-cell">
						{#if index < game.team1Points.length}
							<span class="hist-point">{game.team1Points[index]}</span>
							<button
								type="button"
								class="hist-del"
								onclick={() => game.removePointTeam1(index)}
								aria-label="Supprimer"
							>×</button>
						{/if}
					</td>
					<td class="hist-cell">
						{#if index < game.team2Points.length}
							<span class="hist-point">{game.team2Points[index]}</span>
							<button
								type="button"
								class="hist-del"
								onclick={() => game.removePointTeam2(index)}
								aria-label="Supprimer"
							>×</button>
						{/if}
					</td>
				</tr>
			{/each}
			{#if game.team1Points.length === 0 && game.team2Points.length === 0}
				<tr>
					<td colspan="2" class="hist-empty">— AUCUNE MANCHE —</td>
				</tr>
			{/if}
		</tbody>
	</table>
</section>
