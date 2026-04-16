<script lang="ts">
	import type { ComptageGame } from './comptage.svelte.js';

	let { game }: { game: ComptageGame } = $props();

	let dialogEl: HTMLDialogElement | null = $state(null);

	$effect(() => {
		if (!dialogEl) return;
		if (game.settingUpDealer) {
			dialogEl.showModal();
		} else if (dialogEl.open) {
			dialogEl.close();
		}
	});

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

<!-- Dealer bar -->
<article class="dealer-bar">
	{#if game.currentDealer}
		<div class="dealer-current-info">
			<span class="dealer-bar-label">Donneur :</span>
			<span class="dealer-bar-name">{game.currentDealer}</span>
			<span class="dealer-badge">D</span>
		</div>
	{/if}
	{#if game.dealerOrder.length === 4}
		<div class="dealer-bar-actions">
			<button
				type="button"
				class="secondary outline dealer-next-btn"
				onclick={() => game.advanceDealer()}
			>
				Suivant
			</button>
			<button
				type="button"
				class="secondary dealer-config-btn"
				onclick={() => game.startDealerSetup()}
				title="Modifier l'ordre de donne"
				aria-label="Modifier l'ordre de donne"
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
		</div>
	{:else}
		<button
			type="button"
			class="secondary outline dealer-setup-trigger"
			onclick={() => game.startDealerSetup()}
		>
			Définir l'ordre de donne
		</button>
	{/if}
</article>

<!-- Dealer setup dialog -->
<dialog bind:this={dialogEl} onclose={() => game.cancelDealerSetup()}>
	<article>
		<header>
			<button
				type="button"
				aria-label="Fermer"
				{...{ rel: 'prev' }}
				onclick={() => game.cancelDealerSetup()}
			></button>
			<h4>Ordre de donne ({game.dealerSetupSelections.length}/4)</h4>
		</header>
		<p class="dealer-setup-hint">
			Sélectionnez les 4 joueurs dans l'ordre. Les joueurs d'une même équipe ne peuvent pas se
			succéder.
		</p>
		<div class="dealer-setup-grid">
			{#each teams as team}
				<div class="setup-team-group">
					<span class="team-label {team.key}-color">{team.name}</span>
					<div class="player-buttons">
						{#each team.players as player}
							{@const selIdx = game.dealerSetupSelections.indexOf(player.name)}
							{@const isSetupSelected = selIdx !== -1}
							{@const isSetupDisabled =
								!isSetupSelected && game.isDealerSetupPlayerDisabled(player.name, team.key)}
							<button
								type="button"
								class="player-btn"
								class:setup-selected={isSetupSelected}
								disabled={isSetupDisabled}
								onclick={() => game.addToDealerSetup(player.name)}
							>
								{player.name}
								{#if isSetupSelected}
									<span class="setup-order-badge">{selIdx + 1}</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</article>
</dialog>

<style>
	/* --- Dealer bar --- */
	.dealer-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0.5rem;
		border-top: 1px solid var(--pico-muted-border-color);
		margin-top: 0.5rem;
		gap: 0.5rem;
	}

	.dealer-current-info {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.9em;
	}

	.dealer-bar-label {
		opacity: 0.7;
	}

	.dealer-bar-name {
		font-weight: bold;
	}

	.dealer-bar-actions {
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}

	.dealer-next-btn {
		padding: 0.3rem 0.8rem;
		font-size: 0.85em;
		margin: 0;
	}

	.dealer-config-btn {
		padding: 0.6rem;
		font-size: 0.85em;
		margin: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.dealer-config-btn svg {
		width: 16px;
		height: 16px;
		display: block;
	}

	.dealer-setup-trigger {
		margin: 0;
		font-size: 0.9em;
		padding: 0.3rem 0.8rem;
	}

	.dealer-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--pico-primary);
		color: var(--pico-primary-inverse, #fff);
		border-radius: 50%;
		width: 1.3em;
		height: 1.3em;
		font-size: 0.72em;
		font-weight: bold;
		vertical-align: middle;
		line-height: 1;
		flex-shrink: 0;
	}

	/* --- Setup dialog --- */
	dialog article {
		margin: 0;
	}

	dialog h4 {
		margin: 0;
	}

	.dealer-setup-hint {
		font-size: 0.85em;
		opacity: 0.75;
		margin-bottom: 1rem;
	}

	.dealer-setup-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	@media (min-width: 768px) {
		.dealer-setup-grid {
			flex-direction: row;
			gap: 2rem;
		}
	}

	.setup-team-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	.team-label {
		font-weight: 600;
		font-size: 0.9em;
	}

	.player-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.player-btn {
		background: var(--pico-card-background-color);
		border: 2px solid var(--pico-muted-border-color);
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: inherit;
		color: var(--pico-contrast);
		margin: 0;
		transition: all 0.2s ease;
		flex: 1;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.3em;
	}

	.player-btn:hover {
		border-color: var(--pico-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.player-btn.setup-selected {
		border-width: 3px;
		border-color: var(--pico-secondary, #6c757d);
		opacity: 0.85;
	}

	.setup-order-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--pico-secondary, #6c757d);
		color: #fff;
		border-radius: 50%;
		width: 1.3em;
		height: 1.3em;
		font-size: 0.72em;
		font-weight: bold;
		vertical-align: middle;
		line-height: 1;
		flex-shrink: 0;
	}
</style>
