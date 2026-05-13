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

<style>
	.scan-panel {
		background: var(--b-bg);
		border: var(--b-border-thick);
		box-shadow: var(--b-shadow);
		padding: 0.75rem;
		margin-bottom: 1rem;
	}
	.scan-head {
		margin-bottom: 8px;
	}
	.scan-head-tag {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 1.5px;
		background: var(--b-ink);
		color: var(--b-yellow);
		padding: 3px 8px;
		display: inline-block;
	}
	.scan-row {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.scan-file {
		flex: 1;
		margin: 0 !important;
		font-family: var(--font-mono) !important;
		font-size: 0.78rem !important;
		padding: 6px !important;
		min-height: 40px;
		background: var(--b-bg) !important;
		border: 2px solid var(--b-ink) !important;
		box-shadow: none !important;
	}
	.scan-go {
		font-family: var(--font-mono) !important;
		font-size: 0.78rem !important;
		font-weight: 700;
		letter-spacing: 1.2px;
		padding: 10px 14px !important;
		background: var(--b-ink) !important;
		color: var(--b-yellow) !important;
		border: 2px solid var(--b-ink) !important;
		margin: 0 !important;
		box-shadow: none !important;
		text-transform: uppercase;
	}
	.scan-go:hover {
		background: var(--b-yellow) !important;
		color: var(--b-ink) !important;
		transform: none !important;
		box-shadow: 2px 2px 0 var(--b-ink) !important;
	}
	.scan-go:disabled {
		opacity: 0.5 !important;
	}

	.scan-err {
		margin-top: 8px;
		padding: 10px;
		background: var(--b-red);
		color: var(--b-bg);
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.5px;
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.scan-err svg {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}

	.scan-ok {
		margin-top: 10px;
		text-align: center;
		padding: 10px;
		background: var(--b-yellow);
		border: 2px solid var(--b-ink);
	}
	.scan-cards-row {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		justify-content: center;
		margin-bottom: 8px;
	}
	.scan-card-pill {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		font-weight: 700;
		padding: 4px 8px;
		background: var(--b-bg);
		color: var(--b-ink);
		border: 1.5px solid var(--b-ink);
	}
	.scan-card-pill.red {
		color: var(--b-red);
	}
	.scan-total {
		font-family: var(--font-display);
		font-size: 2.2rem;
		line-height: 1;
		color: var(--b-ink);
		letter-spacing: -1px;
	}
	.scan-total small {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 1.5px;
		color: var(--b-ink-soft);
		margin-left: 6px;
	}
</style>
