<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance, applyAction } from '$app/forms';
	import type { PageProps } from './$types';
	import { WINNING_SCORE } from '$lib/scoreUtils';
	import { toast } from 'svelte-sonner';
	import pointsTaSa from '$lib/assets/points_ta_sa.webp';

	let { data }: PageProps = $props();

	const storageKey = `bcc-comptage`;

	// Load from localStorage
	function loadFromStorage() {
		if (!browser) return null;
		const stored = localStorage.getItem(storageKey);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				return null;
			}
		}
		return null;
	}

	function isValidDealerOrder(order: unknown): order is string[] {
		if (!Array.isArray(order) || order.length !== 4) return false;
		const validNames = [
			data.match.team1.player1.name,
			data.match.team1.player2.name,
			data.match.team2.player1.name,
			data.match.team2.player2.name,
		];
		return order.every((n) => validNames.includes(n)) && new Set(order).size === 4;
	}

	const initial = loadFromStorage();

	let team1Points: number[] = $state(initial?.team1Points ?? []);
	let team2Points: number[] = $state(initial?.team2Points ?? []);
	let taker: string | null = $state(initial?.taker ?? null);
	let selectedSuit: string | null = $state(initial?.selectedSuit ?? null);
	let selectedPoints: string | null = $state(initial?.selectedPoints ?? null);
	let selectedTeam: 'team1' | 'team2' | null = $state(initial?.selectedTeam ?? null);
	let teamBelote: 'team1' | 'team2' | null = $state(initial?.teamBelote ?? null);
	let pointInput: number | null = $state(Number(selectedPoints));
	let showSelection: boolean = $state(true);

	// Dealer state
	let dealerOrder: string[] = $state(isValidDealerOrder(initial?.dealerOrder) ? initial.dealerOrder : []);
	let dealerIndex: number = $state(initial?.dealerIndex ?? 0);
	let settingUpDealer: boolean = $state(false);
	let dealerSetupSelections: string[] = $state([]);
	let dealerDialogEl: HTMLDialogElement | null = $state(null);
	let pointsImageDialogEl: HTMLDialogElement | null = $state(null);
	let pointsModalOpened: boolean = $state(false);

	$effect(() => {
		if (!pointsImageDialogEl) return;
		if (pointsModalOpened) {
			pointsImageDialogEl.showModal();
		} else if (pointsImageDialogEl.open) {
			pointsImageDialogEl.close();
		}
	});

	$effect(() => {
		if (!dealerDialogEl) return;
		if (settingUpDealer) {
			dealerDialogEl.showModal();
		} else if (dealerDialogEl.open) {
			dealerDialogEl.close();
		}
	});

	const suits = ['♥', '♠', '♦', '♣', 'TA', 'SA'];
	const pointOptions = ['80', '90', '100', '110', '120', '130', '140', '150', 'Capot', 'Générale'];

	const team1Total = $derived(team1Points.reduce((sum, p) => sum + p, 0));
	const team2Total = $derived(team2Points.reduce((sum, p) => sum + p, 0));
	const hasWinner = $derived(team1Total >= WINNING_SCORE || team2Total >= WINNING_SCORE);
	let currentDealer = $derived(dealerOrder.length === 4 ? dealerOrder[dealerIndex % 4] : null);

	$effect(() => {
		showSelection = (!taker || !selectedSuit || !selectedPoints) && !hasWinner;
	});

	$effect(() => {
		if (browser) {
			localStorage.setItem(storageKey, JSON.stringify({
				team1Points,
				team2Points,
				taker,
				selectedSuit,
				selectedPoints,
				dealerOrder,
				dealerIndex,
				selectedTeam,
				teamBelote,
			}));
		}
	});

	function getPlayerTeam(playerName: string): 'team1' | 'team2' | null {
		if (playerName === data.match.team1.player1.name || playerName === data.match.team1.player2.name) return 'team1';
		if (playerName === data.match.team2.player1.name || playerName === data.match.team2.player2.name) return 'team2';
		return null;
	}

	function advanceDealer() {
		if (dealerOrder.length === 4) {
			dealerIndex = (dealerIndex + 1) % 4;
		}
	}

	function startDealerSetup() {
		settingUpDealer = true;
		dealerSetupSelections = [];
	}

	function cancelDealerSetup() {
		settingUpDealer = false;
		dealerSetupSelections = [];
	}

	function addToDealerSetup(playerName: string) {
		if (dealerSetupSelections.includes(playerName)) return;

		if (dealerSetupSelections.length > 0) {
			const lastPlayer = dealerSetupSelections[dealerSetupSelections.length - 1];
			const lastTeam = getPlayerTeam(lastPlayer);
			const thisTeam = getPlayerTeam(playerName);
			if (lastTeam === thisTeam) return;
		}

		dealerSetupSelections = [...dealerSetupSelections, playerName];

		if (dealerSetupSelections.length === 4) {
			dealerOrder = [...dealerSetupSelections];
			dealerIndex = 0;
			settingUpDealer = false;
			dealerSetupSelections = [];
		}
	}

	function isDealerSetupPlayerDisabled(_playerName: string, team: 'team1' | 'team2'): boolean {
		if (dealerSetupSelections.length === 0) return false;
		const lastPlayer = dealerSetupSelections[dealerSetupSelections.length - 1];
		const lastTeam = getPlayerTeam(lastPlayer);
		return lastTeam === team;
	}

	function selectTaker(name: string, team: 'team1' | 'team2') {
		taker = taker === name ? null : name;

		if (selectedTeam !== team) {
			selectTeam(team);
		}

		if (!taker) {
			selectedTeam = null;
		}
	}

	function selectSuit(suit: string) {
		selectedSuit = selectedSuit === suit ? null : suit;
	}

	function selectPoints(points: string) {
		selectedPoints = selectedPoints === points ? null : points;
		pointInput = Number(selectedPoints);
	}

	function selectTeam(team: 'team1' | 'team2') {
		selectedTeam = selectedTeam === team ? null : team;
	}

	function resetSelection() {
		taker = null;
		selectedSuit = null;
		selectedPoints = null;
		selectedTeam = null;
		teamBelote = null;
	}

	function addPointTeam1(value: number) {
		team1Points = [...team1Points, value];
	}

	function addPointTeam2(value: number) {
		team2Points = [...team2Points, value];
	}

	function removePointTeam1(index: number) {
		team1Points = team1Points.filter((_, i) => i !== index);
	}

	function removePointTeam2(index: number) {
		team2Points = team2Points.filter((_, i) => i !== index);
	}

	function resetAll(askConfirmation: boolean) {
		if (askConfirmation === true && !confirm('Voulez-vous vraiment réinitialiser tous les scores de cette partie ?')) {
			return;
		}

		team1Points = [];
		team2Points = [];
		resetSelection();
		if (browser) {
			localStorage.removeItem(storageKey);
		}
	}

	function addPoints() {
		const value = parseInt(pointInput);

		if (value < 80 && value !== 20) {
			toast.error('Le score ne peut pas être inférieur à 80 (sauf 20 pour la belote) !');
			return;
		}

		if (selectedPoints !== null && !isNaN(Number(selectedPoints)) && value < Number(selectedPoints)) {
			toast.error('Le score ne peux pas être différent du contrat !');
			return;
		}

		if (!isNaN(value) && value > 0 && selectedTeam) {
			doAddPoints(selectedTeam, value);
		}
	}

	function setDedans() {
		if (selectedTeam === null) {
			toast.error('Sélectionner une équipe !');
			return;
		}

		doAddPoints(selectedTeam === 'team1' ? 'team2' : 'team1', 160);
	}

	function doAddPoints(team: 'team1' | 'team2', points: number) {
		if (team === 'team1') {
			addPointTeam1(points + (teamBelote === 'team1' ? 20 : 0));
		} else {
			addPointTeam2(points + (teamBelote === 'team2' ? 20 : 0));
		}
		pointInput = null;

		if (teamBelote !== null && teamBelote !== team) {
			if (teamBelote === 'team1') {
				addPointTeam1(20);
			} else {
				addPointTeam2(20);
			}
		}

		resetSelection();
		advanceDealer();
	}

	function setBelote(team: 'team1' | 'team2' | null) {
		teamBelote = (teamBelote === team ? null : team);
	}

	function handlePointInputKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addPoints();
		}
	}
</script>

<div class="flex-between">
	<a href="/match/{data.match.id}/scores" class="secondary">&larr; Retour aux scores</a>
	<button type="button" class="secondary outline reset-btn" onclick={() => resetAll(true)}>Réinitialiser</button>
</div>

<div class="page-header">
	<h2 class="m-0">Comptage des points</h2>
	<button type="button" class="secondary outline points-info-btn" onclick={() => pointsModalOpened = true} aria-label="Tableau des points TA/SA">
		Points TA / SA
	</button>
</div>

<article class="dealer-bar">
	{#if currentDealer}
	<div class="dealer-current-info">
		<span class="dealer-bar-label">Donneur :</span>
		<span class="dealer-bar-name">{currentDealer}</span>
		<span class="dealer-badge">D</span>
	</div>
	{/if}
	{#if dealerOrder.length === 4}
		<div class="dealer-bar-actions">
			<button type="button" class="secondary outline dealer-next-btn" onclick={advanceDealer}>
				Suivant
			</button>
			<button
				type="button"
				class="secondary dealer-config-btn"
				onclick={startDealerSetup}
				title="Modifier l'ordre de donne"
				aria-label="Modifier l'ordre de donne"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
					<circle cx="12" cy="12" r="3"/>
				</svg>
			</button>
		</div>
	{:else}
		<button type="button" class="secondary outline dealer-setup-trigger" onclick={startDealerSetup}>
			Définir l'ordre de donne
		</button>
	{/if}
</article>

<article>
	{#if showSelection}
		<div class="points-container">
			{#each pointOptions as points}
				<button
					type="button"
					class="point-btn"
					class:selected={selectedPoints === points}
					onclick={() => selectPoints(points)}
				>{points}</button>
			{/each}
		</div>

		<div class="suits-container">
			{#each suits as suit}
				<button
					type="button"
					class="suit-btn"
					class:selected={selectedSuit === suit}
					class:red={suit === '♥' || suit === '♦'}
					onclick={() => selectSuit(suit)}
				>{suit}</button>
			{/each}
		</div>

		<div class="players-selection">
			<div class="player-group">
				<span class="team-label team1-color">{data.match.team1.name}</span>
				<div class="player-buttons">
					<button
						type="button"
						class="player-btn"
						class:selected={taker === data.match.team1.player1.name}
						onclick={() => selectTaker(data.match.team1.player1.name, 'team1')}
					>
						{data.match.team1.player1.name}
						{#if currentDealer === data.match.team1.player1.name}
							<span class="dealer-badge">D</span>
						{/if}
					</button>
					<button
						type="button"
						class="player-btn"
						class:selected={taker === data.match.team1.player2.name}
						onclick={() => selectTaker(data.match.team1.player2.name, 'team1')}
					>
						{data.match.team1.player2.name}
						{#if currentDealer === data.match.team1.player2.name}
							<span class="dealer-badge">D</span>
						{/if}
					</button>
				</div>
			</div>
			<div class="player-group">
				<span class="team-label team2-color">{data.match.team2.name}</span>
				<div class="player-buttons">
					<button
						type="button"
						class="player-btn"
						class:selected={taker === data.match.team2.player1.name}
						onclick={() => selectTaker(data.match.team2.player1.name, 'team2')}
					>
						{data.match.team2.player1.name}
						{#if currentDealer === data.match.team2.player1.name}
							<span class="dealer-badge">D</span>
						{/if}
					</button>
					<button
						type="button"
						class="player-btn"
						class:selected={taker === data.match.team2.player2.name}
						onclick={() => selectTaker(data.match.team2.player2.name, 'team2')}
					>
						{data.match.team2.player2.name}
						{#if currentDealer === data.match.team2.player2.name}
							<span class="dealer-badge">D</span>
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if taker || selectedSuit || selectedPoints}
		<div class="taker-display">
			{#if selectedPoints}
				<span class="points-card">{selectedPoints}</span>
			{/if}
			{#if selectedSuit}
				<span class="suit-card" class:red={selectedSuit === '♥' || selectedSuit === '♦'}>{selectedSuit}</span>
			{/if}
			{#if taker}
				<div class="taker-info">
					<span class="taker-label">Preneur</span>
					<span class="taker-name">{taker}</span>
				</div>
			{/if}
			{#if !showSelection}
				<button type="button" class="secondary edit-btn" onclick={() => showSelection = true} aria-label="Modifier">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
						<circle cx="12" cy="12" r="3"/>
					</svg>
				</button>
			{/if}
		</div>
	{/if}

	{#if hasWinner}
		<form
			method="POST"
			action="?/saveScore"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						resetAll(false);
					}
					await applyAction(result);
				};
			}}
		>
			<input type="hidden" name="score_team1" value={team1Total} />
			<input type="hidden" name="score_team2" value={team2Total} />
			<div class="winner-section">
				<p class="winner-text">
					<strong>{team1Total >= WINNING_SCORE ? data.match.team1.name : data.match.team2.name}</strong> remportent la manche
					<span class="winner-scores">
						<span class="team1-color">{team1Total}</span> - <span class="team2-color">{team2Total}</span>
					</span>
				</p>
				<button type="submit">Valider et nouvelle manche</button>
			</div>
		</form>
	{/if}
</article>

<dialog bind:this={dealerDialogEl} onclose={cancelDealerSetup}>
	<article>
		<header>
			<button type="button" aria-label="Fermer" rel="prev" onclick={cancelDealerSetup}></button>
			<h4>Ordre de donne ({dealerSetupSelections.length}/4)</h4>
		</header>
		<p class="dealer-setup-hint">
			Sélectionnez les 4 joueurs dans l'ordre. Les joueurs d'une même équipe ne peuvent pas se succéder.
		</p>
		<div class="dealer-setup-grid">
			<div class="setup-team-group">
				<span class="team-label team1-color">{data.match.team1.name}</span>
				<div class="player-buttons">
					{#each [
						{ name: data.match.team1.player1.name, team: 'team1' as const },
						{ name: data.match.team1.player2.name, team: 'team1' as const },
					] as player}
						{@const selIdx = dealerSetupSelections.indexOf(player.name)}
						{@const isSetupSelected = selIdx !== -1}
						{@const isSetupDisabled = !isSetupSelected && isDealerSetupPlayerDisabled(player.name, player.team)}
						<button
							type="button"
							class="player-btn"
							class:setup-selected={isSetupSelected}
							disabled={isSetupDisabled}
							onclick={() => addToDealerSetup(player.name)}
						>
							{player.name}
							{#if isSetupSelected}
								<span class="setup-order-badge">{selIdx + 1}</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
			<div class="setup-team-group">
				<span class="team-label team2-color">{data.match.team2.name}</span>
				<div class="player-buttons">
					{#each [
						{ name: data.match.team2.player1.name, team: 'team2' as const },
						{ name: data.match.team2.player2.name, team: 'team2' as const },
					] as player}
						{@const selIdx = dealerSetupSelections.indexOf(player.name)}
						{@const isSetupSelected = selIdx !== -1}
						{@const isSetupDisabled = !isSetupSelected && isDealerSetupPlayerDisabled(player.name, player.team)}
						<button
							type="button"
							class="player-btn"
							class:setup-selected={isSetupSelected}
							disabled={isSetupDisabled}
							onclick={() => addToDealerSetup(player.name)}
						>
							{player.name}
							{#if isSetupSelected}
								<span class="setup-order-badge">{selIdx + 1}</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</article>
</dialog>

<dialog
	bind:this={pointsImageDialogEl}
	onclose={() => pointsModalOpened = false}
	onclick={(e) => { if (e.target === pointsImageDialogEl) pointsModalOpened = false; }}
>
	<article>
		<header>
			<button type="button" aria-label="Fermer" rel="prev" onclick={() => pointsModalOpened = false}></button>
			<h4>Points Tout Atout / Sans Atout</h4>
		</header>
		<img src={pointsTaSa} alt="Tableau des points TA et SA" style="width: 100%; height: auto; display: block;" />
	</article>
</dialog>

<article>
	<div class="scores-row">
		<button
			type="button"
			class="team-score-item team1-color"
			class:selected={selectedTeam === 'team1'}
			onclick={() => selectTeam('team1')}
		>
			<div class="team-name-short">
				{data.match.team1.name}
				{#if teamBelote === 'team1'}
					<span class="belote-badge team1">
						&#8383;
					</span>
				{/if}
			</div>
			<div class="team-total-sticky">{team1Total}</div>
		</button>
		<div class="vs">-</div>
		<button
			type="button"
			class="team-score-item team2-color"
			class:selected={selectedTeam === 'team2'}
			onclick={() => selectTeam('team2')}
		>
			<div class="team-name-short">
				{data.match.team2.name}
				{#if teamBelote === 'team2'}
					<span class="belote-badge team2">
						&#8383;
					</span>
				{/if}
			</div>
			<div class="team-total-sticky">{team2Total}</div>
		</button>
	</div>

	{#if !hasWinner}
		<div class="mt-sm flex-between gap">
			<button type="button" onclick={() => setBelote('team1')} class="outline">&larr; Belote</button>
			<button type="button" onclick={setDedans} class="flex-full secondary">Dedans</button>
			<button type="button" onclick={() => setBelote('team2')} class="outline">Belote &rarr;</button>
		</div>
		<div class="point-input-section">
			<input
				type="number"
				bind:value={pointInput}
				onkeydown={handlePointInputKeydown}
				placeholder={selectedTeam ? 'Points...' : 'Sélectionner équipe'}
				disabled={!selectedTeam}
				min="1"
				inputmode="numeric"
			/>
			<button type="button" onclick={addPoints} disabled={!selectedTeam || !pointInput}>+</button>
		</div>
	{/if}
</article>

<table class="score-table striped">
	<thead>
		<tr>
			<th class="team1-color">{data.match.team1.name}</th>
			<th class="team2-color">{data.match.team2.name}</th>
		</tr>
	</thead>
	<tbody>
		{#each Array.from({ length: Math.max(team1Points.length, team2Points.length) }) as _, index}
			<tr>
				<td class="team-cell">
					{#if index < team1Points.length}
						<span class="point-value">{team1Points[index]}</span>
						<button
							type="button"
							class="delete-btn"
							onclick={() => removePointTeam1(index)}
							aria-label="Supprimer"
						>×</button>
					{/if}
				</td>
				<td class="team-cell">
					{#if index < team2Points.length}
						<span class="point-value">{team2Points[index]}</span>
						<button
							type="button"
							class="delete-btn"
							onclick={() => removePointTeam2(index)}
							aria-label="Supprimer"
						>×</button>
					{/if}
				</td>
			</tr>
		{/each}
		{#if team1Points.length === 0 && team2Points.length === 0}
			<tr>
				<td colspan="2" class="empty-cell">Aucun point enregistré</td>
			</tr>
		{/if}
	</tbody>
</table>

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.points-info-btn {
		padding: 0.3rem 0.7rem;
		font-size: 0.9em;
		font-weight: bold;
		margin: 0;
	}

	.reset-btn {
		padding: 0.5rem 1rem;
	}

	.scores-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.team-score-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		flex: 1;
		gap: 0.25rem;
		background: var(--pico-card-background-color);
		border: 2px solid var(--pico-muted-border-color);
		border-radius: 8px;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		margin: 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.team-score-item:hover {
		border-color: var(--pico-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.team-score-item.selected {
		border-width: 3px;
		border-color: var(--pico-primary);
		background: var(--pico-card-background-color);
		box-shadow:
			0 0 0 3px var(--pico-primary-background),
			0 4px 12px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	.team-name-short {
		font-size: 0.85em;
		font-weight: 600;
		text-align: center;
		line-height: 1.2;
	}

	.team-total-sticky {
		font-size: 2em;
		font-weight: bold;
		line-height: 1;
	}

	.vs {
		font-size: 1.5em;
		font-weight: bold;
		opacity: 0.5;
		padding: 0 0.25rem;
	}

	/* Dealer bar */
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

	/* Dealer badge */
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

	/* Setup order badge */
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

	.player-btn.setup-selected {
		border-width: 3px;
		border-color: var(--pico-secondary, #6c757d);
		opacity: 0.85;
	}

	.point-input-section {
		display: flex;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--pico-muted-border-color);
	}

	.point-input-section input {
		flex: 1;
		margin: 0;
		font-size: 1.2em;
		text-align: center;
	}

	.point-input-section input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.point-input-section button {
		margin: 0;
		padding: 0.5rem 1.5rem;
		font-size: 1.5em;
		font-weight: bold;
	}

	.points-container {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.point-btn {
		font-size: 0.9rem;
		padding: 0.4rem 0.3rem;
		background: var(--pico-card-background-color);
		border: 2px solid var(--pico-muted-border-color);
		border-radius: 6px;
		cursor: pointer;
		margin: 0;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		color: var(--pico-contrast);
	}

	.point-btn:hover {
		border-color: var(--pico-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.point-btn.selected {
		border-width: 3px;
		border-color: var(--pico-primary);
		background: var(--pico-card-background-color);
		box-shadow:
			0 0 0 3px var(--pico-primary-background),
			0 4px 12px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	.belote-badge {
		position: absolute;
		top: 35%;
		right: 5%;
		color: white;
		padding: 5px 10px;
		font-weight: bold;
		border-radius: 30px;
	}
	.belote-badge.team1 {
		background-color: var(--color-team1);
	}
	.belote-badge.team2 {
		background-color: var(--color-team2);
	}

	@media (min-width: 768px) {
		.points-container {
			display: flex;
			justify-content: center;
			gap: 0.5rem;
			flex-wrap: wrap;
		}

		.point-btn {
			font-size: 1rem;
			padding: 0.5rem 0.8rem;
			min-width: 4rem;
		}
	}

	.suits-container {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.suit-btn {
		font-size: 1.3rem;
		padding: 0.4rem 0.5rem;
		background: var(--pico-card-background-color);
		border: 2px solid var(--pico-muted-border-color);
		border-radius: 6px;
		cursor: pointer;
		margin: 0;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	@media (min-width: 768px) {
		.suits-container {
			display: flex;
			justify-content: center;
			gap: 1rem;
		}

		.suit-btn {
			font-size: 2rem;
			padding: 0.5rem 1rem;
			min-width: 3.5rem;
		}
	}

	.suit-btn:hover {
		border-color: var(--pico-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.suit-btn.selected {
		border-width: 3px;
		border-color: var(--pico-primary);
		background: var(--pico-card-background-color);
		box-shadow:
			0 0 0 3px var(--pico-primary-background),
			0 4px 12px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	.suit-btn {
		color: #000000;
	}

	.suit-btn.red,
	.suit-card.red {
		color: #e53935;
	}

	.players-selection {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	@media (min-width: 768px) {
		.players-selection {
			flex-direction: row;
			gap: 2rem;
		}
	}

	.player-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	@media (min-width: 768px) {
		.player-group {
			flex: 1;
		}
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

	.player-btn.selected {
		border-width: 3px;
		border-color: var(--pico-primary);
		background: var(--pico-card-background-color);
		box-shadow:
			0 0 0 3px var(--pico-primary-background),
			0 4px 12px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

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

	.score-table {
		width: 100%;
		margin: 0;
		border-collapse: collapse;
	}

	.score-table thead th {
		padding: 0.75rem;
		font-weight: 600;
		font-size: 1em;
		text-align: center;
		border-bottom: 2px solid var(--pico-muted-border-color);
	}

	.score-table tbody tr {
		border-bottom: 1px solid var(--pico-muted-border-color);
	}

	.team-cell {
		padding: 0.5rem;
		text-align: center;
		width: 50%;
		position: relative;
	}

	.team-cell .point-value {
		font-weight: 600;
		font-size: 1.1em;
		margin-right: 0.5rem;
	}

	.empty-cell {
		text-align: center;
		opacity: 0.6;
		font-style: italic;
		padding: 1.5rem 0.5rem;
	}

	.delete-btn {
		background: transparent;
		border: none;
		color: var(--pico-del-color);
		font-size: 1.3em;
		line-height: 1;
		padding: 0;
		margin: 0;
		cursor: pointer;
		width: 1.75rem;
		height: 1.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.15s ease;
		vertical-align: middle;
	}

	.delete-btn:hover {
		background: var(--pico-del-color);
		color: white;
	}

	.winner-section {
		text-align: center;
		margin-top: 1rem;
	}

	.winner-text {
		margin: 0 0 1rem 0;
	}

	.winner-scores {
		font-weight: bold;
		margin-left: 0.5rem;
	}

	.winner-section button {
		margin: 0;
	}
</style>
