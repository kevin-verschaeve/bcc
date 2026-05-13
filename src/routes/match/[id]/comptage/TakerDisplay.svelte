<script lang="ts">
	import type { ComptageGame } from './comptage.svelte.js';

	let { game }: { game: ComptageGame } = $props();
</script>

{#if game.taker || game.selectedSuit || game.selectedPoints}
	<div class="contract-recap" class:recap-edge={!game.showSelection}>
		<div class="recap-cells">
			<div class="recap-cell">
				<span class="recap-label">CONTRAT</span>
				<span class="recap-value">{game.selectedPoints ?? '—'}</span>
			</div>
			<div class="recap-cell">
				<span class="recap-label">ATOUT</span>
				<span
					class="recap-value suit-display"
					class:red={game.selectedSuit === '♥' || game.selectedSuit === '♦'}
				>{game.selectedSuit ?? '—'}</span>
			</div>
			<div class="recap-cell recap-cell-name">
				<span class="recap-label">PRENEUR</span>
				<span class="recap-value recap-name">{game.taker ?? '—'}</span>
			</div>
		</div>
		{#if !game.showSelection}
			<button
				type="button"
				class="recap-edit"
				onclick={() => (game.showSelection = true)}
				aria-label="Modifier"
			>✎ MODIFIER</button>
		{/if}
	</div>
{/if}

<style>
	.contract-recap {
		background: var(--b-ink);
		color: var(--b-bg);
		padding: 0.75rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}
	/* When taking up the full bottom of the contract panel after edits */
	.recap-edge {
		margin: -1rem -1rem -1rem;
	}
	.recap-cells {
		display: flex;
		gap: 1rem;
		flex: 1;
		flex-wrap: wrap;
		min-width: 0;
	}
	.recap-cell {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.recap-cell-name {
		flex: 1;
	}

	@media (max-width: 480px) {
		.recap-cell-name {
			max-width: 160px;
		}
	}
	.recap-label {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 1.2px;
		color: var(--b-yellow);
	}
	.recap-value {
		font-family: var(--font-display);
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: -0.3px;
		color: var(--b-bg);
	}
	.recap-value.suit-display {
		font-size: 1.4rem;
		line-height: 1;
	}
	.recap-value.suit-display.red {
		color: var(--b-red);
	}
	.recap-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.recap-edit {
		font-family: var(--font-mono) !important;
		font-size: 0.7rem !important;
		font-weight: 700;
		letter-spacing: 1px;
		padding: 6px 10px !important;
		background: var(--b-yellow) !important;
		color: var(--b-ink) !important;
		border: 2px solid var(--b-yellow) !important;
		margin: 0 !important;
		box-shadow: none !important;
		text-transform: uppercase;
		cursor: pointer;
	}
	.recap-edit:hover {
		background: var(--b-bg) !important;
		border-color: var(--b-bg) !important;
		transform: none !important;
		box-shadow: none !important;
	}

	@media (max-width: 480px) {
		.contract-recap {
			padding: 0.75rem;
		}
		.recap-cells {
			width: 100%;
			justify-content: space-between;
			gap: 0.5rem;
		}
		.recap-edit {
			width: 100%;
			margin-top: 6px !important;
		}
	}
</style>
