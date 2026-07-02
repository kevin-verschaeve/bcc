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
			<button
				type="button"
				class="dealer-btn icon-only"
				onclick={() => game.advanceDealer()}
				title="Donneur suivant"
				aria-label="Donneur suivant"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 18 15 12 9 6"/>
				</svg>
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
