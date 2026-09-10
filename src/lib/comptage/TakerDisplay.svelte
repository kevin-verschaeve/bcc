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
