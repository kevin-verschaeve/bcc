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

<style>
	.history-section {
		background: var(--b-bg);
		border: var(--b-border-thick);
		box-shadow: var(--b-shadow);
		margin-bottom: 1rem;
	}
	.history-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 14px;
		background: var(--b-ink);
		color: var(--b-bg);
	}
	.history-title {
		font-family: var(--font-display);
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin: 0;
		color: var(--b-bg);
	}
	.history-count {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 1.2px;
		color: var(--b-yellow);
	}
	.history-table {
		width: 100%;
		border-collapse: collapse;
		margin: 0;
		border-radius: 0;
		border: none;
		background: transparent;
	}
	.hist-th {
		font-family: var(--font-mono) !important;
		font-size: 0.78rem !important;
		font-weight: 700 !important;
		letter-spacing: 1.2px !important;
		text-transform: uppercase !important;
		padding: 10px !important;
		text-align: center;
		background: var(--b-ink) !important;
		background-color: var(--b-ink) !important;
		border-bottom: 2px solid var(--b-ink) !important;
		color: inherit;
	}
	.history-table tbody tr {
		border-bottom: 1.5px dashed var(--b-ink);
		background: transparent !important;
	}
	.history-table tbody tr:last-child {
		border-bottom: none;
	}
	.history-table tbody tr:hover {
		background: transparent !important;
	}
	.hist-cell {
		padding: 10px !important;
		text-align: center;
		width: 50%;
		position: relative;
		border-bottom: none !important;
	}
	.hist-cell:first-child {
		border-right: 1.5px dashed var(--b-ink);
	}
	.hist-point {
		font-family: var(--font-display);
		font-size: 1.3rem;
		line-height: 1;
		letter-spacing: -0.5px;
		margin-right: 0.5rem;
		color: var(--b-ink);
	}
	.hist-del {
		background: transparent !important;
		border: 1.5px solid var(--b-ink) !important;
		color: var(--b-ink) !important;
		font-family: var(--font-display) !important;
		font-size: 0.95rem !important;
		line-height: 1;
		padding: 0 !important;
		margin: 0 !important;
		cursor: pointer;
		width: 24px;
		height: 24px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		vertical-align: middle;
		box-shadow: none !important;
	}
	.hist-del:hover {
		background: var(--b-red) !important;
		color: var(--b-bg) !important;
		border-color: var(--b-red) !important;
		transform: none !important;
		box-shadow: none !important;
	}
	.hist-empty {
		text-align: center;
		padding: 1.5rem !important;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 1.5px;
		color: var(--b-ink-soft);
	}
</style>
