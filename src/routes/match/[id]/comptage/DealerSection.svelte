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

<!-- Dealer strip -->
<div class="dealer-strip">
	{#if game.currentDealer}
		<div class="dealer-info">
			<span class="dealer-tag">DONNEUR</span>
			<span class="dealer-name">{game.currentDealer}</span>
		</div>
		<div class="dealer-actions">
			<button type="button" class="dealer-btn" onclick={() => game.advanceDealer()}>
				SUIVANT →
			</button>
			<button
				type="button"
				class="dealer-btn icon-only"
				onclick={() => game.startDealerSetup()}
				title="Modifier l'ordre de donne"
				aria-label="Modifier l'ordre de donne"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="3"/>
					<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
				</svg>
			</button>
		</div>
	{:else}
		<button type="button" class="dealer-setup-btn" onclick={() => game.startDealerSetup()}>
			🎴 DÉFINIR L'ORDRE DE DONNE
		</button>
	{/if}
</div>

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
			<h4>Ordre de donne <span class="setup-count">{game.dealerSetupSelections.length}/4</span></h4>
		</header>
		<p class="dealer-hint">
			Sélectionne les 4 joueurs dans l'ordre. Deux joueurs d'une même équipe ne peuvent pas se suivre.
		</p>
		<div class="dealer-setup-grid">
			{#each teams as team}
				<div class="setup-team-group">
					<span class="setup-team-label {team.key}-color">{team.name}</span>
					<div class="player-buttons">
						{#each team.players as player}
							{@const selIdx = game.dealerSetupSelections.indexOf(player.name)}
							{@const isSetupSelected = selIdx !== -1}
							{@const isSetupDisabled =
								!isSetupSelected && game.isDealerSetupPlayerDisabled(player.name, team.key)}
							<button
								type="button"
								class="setup-player"
								class:setup-selected={isSetupSelected}
								disabled={isSetupDisabled}
								onclick={() => game.addToDealerSetup(player.name)}
							>
								<span class="setup-player-name">{player.name}</span>
								{#if isSetupSelected}
									<span class="setup-num">{selIdx + 1}</span>
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
	.dealer-strip {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		padding: 10px 14px;
		background: var(--b-bg);
		border: var(--b-border-thick);
		box-shadow: var(--b-shadow);
		margin-bottom: 1.25rem;
	}
	.dealer-info {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: 1;
		min-width: 0;
	}
	.dealer-tag {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 1.5px;
		background: var(--b-ink);
		color: var(--b-yellow);
		padding: 3px 8px;
		flex-shrink: 0;
	}
	.dealer-name {
		font-family: var(--font-display);
		font-size: 1.1rem;
		text-transform: uppercase;
		letter-spacing: -0.5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--b-ink);
	}
	.dealer-actions {
		display: flex;
		gap: 6px;
		flex-shrink: 0;
	}
	.dealer-btn {
		font-family: var(--font-mono) !important;
		font-size: 0.7rem !important;
		font-weight: 700;
		letter-spacing: 1px;
		padding: 6px 10px !important;
		background: var(--b-bg) !important;
		color: var(--b-ink) !important;
		border: 2px solid var(--b-ink) !important;
		margin: 0 !important;
		box-shadow: none !important;
		text-transform: uppercase;
	}
	.dealer-btn:hover {
		background: var(--b-yellow) !important;
		transform: none !important;
		box-shadow: 2px 2px 0 var(--b-ink) !important;
	}
	.dealer-btn.icon-only {
		padding: 6px 8px !important;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.dealer-btn.icon-only svg {
		width: 14px;
		height: 14px;
		display: block;
	}

	.dealer-setup-btn {
		flex: 1;
		font-family: var(--font-mono) !important;
		font-size: 0.78rem !important;
		font-weight: 700;
		letter-spacing: 1.2px;
		padding: 10px 14px !important;
		background: var(--b-yellow) !important;
		color: var(--b-ink) !important;
		border: 2px solid var(--b-ink) !important;
		margin: 0 !important;
		box-shadow: none !important;
		text-transform: uppercase;
	}
	.dealer-setup-btn:hover {
		transform: translate(-1px, -1px) !important;
		box-shadow: 3px 3px 0 var(--b-ink) !important;
	}

	/* --- Setup dialog --- */
	dialog article {
		margin: 0;
		padding: 1.25rem;
		background: var(--b-bg);
		border: var(--b-border-thick);
		box-shadow: 8px 8px 0 var(--b-ink);
		border-radius: 0;
	}
	dialog h4 {
		font-family: var(--font-display);
		text-transform: uppercase;
		letter-spacing: -0.5px;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.setup-count {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 1.2px;
		background: var(--b-yellow);
		color: var(--b-ink);
		padding: 4px 8px;
		border: 2px solid var(--b-ink);
	}

	.dealer-hint {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.3px;
		color: var(--b-ink-soft);
		margin: 0 0 1rem;
		padding: 8px 10px;
		background: rgba(0, 0, 0, 0.04);
		border-left: 3px solid var(--b-yellow);
	}

	.dealer-setup-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 0;
	}

	@media (min-width: 768px) {
		.dealer-setup-grid {
			flex-direction: row;
			gap: 1rem;
		}
	}

	.setup-team-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}
	.setup-team-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		margin-bottom: 2px;
	}
	.player-buttons {
		display: flex;
		gap: 6px;
		flex-direction: column;
	}
	.setup-player {
		font-family: var(--font-mono) !important;
		font-size: 0.85rem !important;
		font-weight: 700;
		padding: 12px 10px !important;
		background: var(--b-bg) !important;
		color: var(--b-ink) !important;
		border: 2px solid var(--b-ink) !important;
		margin: 0 !important;
		box-shadow: none !important;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		min-height: 44px;
		text-transform: uppercase;
	}
	.setup-player:hover:not(:disabled) {
		background: var(--b-ink) !important;
		color: var(--b-yellow) !important;
		transform: none !important;
		box-shadow: 2px 2px 0 var(--b-ink) !important;
	}
	.setup-player:disabled {
		opacity: 0.3 !important;
		cursor: not-allowed;
	}
	.setup-player.setup-selected {
		background: var(--b-yellow) !important;
		color: var(--b-ink) !important;
		transform: translate(-1px, -1px) !important;
		box-shadow: 3px 3px 0 var(--b-ink) !important;
	}
	.setup-player-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}
	.setup-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--b-ink);
		color: var(--b-yellow);
		font-family: var(--font-display);
		font-size: 0.78rem;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		flex-shrink: 0;
	}
</style>
