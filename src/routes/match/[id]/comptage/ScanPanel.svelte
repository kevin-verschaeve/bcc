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
	<div class="scan-inline" transition:slide>
		<div class="scan-input-row">
			<input
				type="file"
				accept="image/*"
				capture="environment"
				bind:this={scanFileInput}
				class="scan-file-input"
			/>
			<button
				type="button"
				onclick={handleAnalyze}
				disabled={game.scanLoading}
				aria-busy={game.scanLoading}
				class="scan-count-btn"
			>
				{game.scanLoading ? '...' : 'Compter'}
			</button>
		</div>
		{#if game.scanError}
			<div class="scan-error">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				<span>{game.scanError}</span>
			</div>
		{/if}
		{#if game.scanResult}
			<div class="scan-result">
				<p class="scan-cards">
					{#each game.scanResult.cards as card}
						<span class="scan-card" class:red={card.suit === '♥' || card.suit === '♦'}>
							{card.rank}{card.suit}
						</span>
					{/each}
				</p>
				<p class="scan-total">{game.scanResult.points} points</p>
			</div>
		{/if}
	</div>
{/if}

<style>
	.scan-inline {
		margin-top: 0.75rem;
		background: var(--pico-card-background-color);
	}

	.scan-input-row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.scan-file-input {
		flex: 1;
		margin: 0;
		font-size: 0.9em;
	}

	.scan-count-btn {
		margin: 0;
		flex-shrink: 0;
		padding: 0.5rem 1rem;
	}

	.scan-error {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-top: 0.75rem;
		padding: 0.6rem 0.75rem;
		background: color-mix(in srgb, var(--pico-del-color) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--pico-del-color) 40%, transparent);
		border-radius: 6px;
		color: var(--pico-del-color);
		font-size: 0.9em;
	}

	.scan-error svg {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.scan-result {
		margin-top: 1rem;
		text-align: center;
	}

	.scan-cards {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		justify-content: center;
		margin-bottom: 0.75rem;
	}

	.scan-card {
		font-size: 1em;
		font-weight: 600;
		background: var(--pico-card-background-color);
		border: 1px solid var(--pico-muted-border-color);
		border-radius: 4px;
		padding: 0.2rem 0.4rem;
		color: #000;
	}

	.scan-card.red {
		color: #e53935;
	}

	.scan-total {
		font-size: 2em;
		font-weight: bold;
		margin: 0.25rem 0;
	}
</style>
