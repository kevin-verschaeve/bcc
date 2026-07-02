<script lang="ts">
	import { slide } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import type { ComptageGame } from './comptage.svelte.js';

	let { game }: { game: ComptageGame } = $props();

	let scanFileInput = $state<HTMLInputElement | null>(null);

	async function handleAnalyze() {
		if (!scanFileInput?.files?.[0]) {
			toast.error('Veuillez sélectionner une photo');
			return;
		}
		await game.analyzePhoto(scanFileInput.files[0]);
	}
</script>

{#if game.scanOpen}
	<div class="scan-panel" transition:slide>
		<div class="scan-head">
			<span class="scan-head-tag">📷 SCAN DES PLIS</span>
		</div>
		<div class="scan-row">
			<input
				type="file"
				accept="image/*"
				capture="environment"
				bind:this={scanFileInput}
				class="scan-file"
			/>
			<button
				type="button"
				onclick={handleAnalyze}
				disabled={game.scanLoading}
				aria-busy={game.scanLoading}
				class="scan-go"
			>
				{game.scanLoading ? '...' : 'COMPTER'}
			</button>
		</div>
		{#if game.scanError}
			<div class="scan-err">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10"/>
					<line x1="12" y1="8" x2="12" y2="12"/>
					<line x1="12" y1="16" x2="12.01" y2="16"/>
				</svg>
				<span>{game.scanError}</span>
			</div>
		{/if}
		{#if game.scanResult}
			<div class="scan-ok">
				<div class="scan-cards-row">
					{#each game.scanResult.cards as card}
						<span class="scan-card-pill" class:red={card.suit === '♥' || card.suit === '♦'}>
							{card.rank}{card.suit}
						</span>
					{/each}
				</div>
				<div class="scan-total">
					{game.scanResult.points}
					<small>POINTS</small>
				</div>
			</div>
		{/if}
	</div>
{/if}
