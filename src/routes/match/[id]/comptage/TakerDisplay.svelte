<script lang="ts">
	import type { ComptageGame } from './comptage.svelte.js';

	let { game }: { game: ComptageGame } = $props();
</script>

{#if game.taker || game.selectedSuit || game.selectedPoints}
	<div class="taker-display">
		{#if game.selectedPoints}
			<span class="points-card">{game.selectedPoints}</span>
		{/if}
		{#if game.selectedSuit}
			<span
				class="suit-card"
				class:red={game.selectedSuit === '♥' || game.selectedSuit === '♦'}
			>{game.selectedSuit}</span>
		{/if}
		{#if game.taker}
			<div class="taker-info">
				<span class="taker-label">Preneur</span>
				<span class="taker-name">{game.taker}</span>
			</div>
		{/if}
		{#if !game.showSelection}
			<button
				type="button"
				class="secondary edit-btn"
				onclick={() => (game.showSelection = true)}
				aria-label="Modifier"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
					/>
					<circle cx="12" cy="12" r="3" />
				</svg>
			</button>
		{/if}
	</div>
{/if}

<style>
	.taker-display {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--pico-background-color);
		border: 1px solid var(--pico-muted-border-color);
		border-radius: 8px;
		margin-top: 1rem;
	}

	.points-card {
		font-size: 2rem;
		font-weight: bold;
		background: var(--pico-background-color);
	}

	.suit-card {
		font-size: 3rem;
		line-height: 1;
		padding: 0.5rem;
		background: var(--pico-background-color);
		border: 2px solid var(--pico-muted-border-color);
		border-radius: 8px;
	}

	.suit-card.red {
		color: #e53935;
	}

	.taker-info {
		display: flex;
		flex-direction: column;
		text-align: left;
	}

	.taker-label {
		font-size: 0.8em;
		opacity: 0.7;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.taker-name {
		font-size: 1.3em;
		font-weight: bold;
	}

	.edit-btn {
		padding: 0.8rem;
		margin: 0;
		min-width: auto;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.edit-btn svg {
		width: 20px;
		height: 20px;
		display: block;
	}
</style>
