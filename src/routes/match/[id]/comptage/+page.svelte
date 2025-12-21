<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance, applyAction } from '$app/forms';
	import type { PageProps } from './$types';
	import { WINNING_SCORE } from '$lib/scoreUtils';

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

	const initial = loadFromStorage();

	let team1Points: number[] = $state(initial?.team1Points ?? []);
	let team2Points: number[] = $state(initial?.team2Points ?? []);
	let taker: string | null = $state(initial?.taker ?? null);
	let selectedSuit: string | null = $state(initial?.selectedSuit ?? null);
	let selectedTeam: 'team1' | 'team2' | null = $state(null);
	let pointInput = $state('');
	let showSelection = $state(true);

	const suits = ['♥', '♠', '♦', '♣', 'TA', 'SA'];

	const team1Total = $derived(team1Points.reduce((sum, p) => sum + p, 0));
	const team2Total = $derived(team2Points.reduce((sum, p) => sum + p, 0));
	const hasWinner = $derived(team1Total >= WINNING_SCORE || team2Total >= WINNING_SCORE);
	const bothSelected = $derived(taker && selectedSuit);

	$effect(() => {
		if (bothSelected) {
			showSelection = false;
		}
	});

	$effect(() => {
		if (browser) {
			localStorage.setItem(storageKey, JSON.stringify({
				team1Points,
				team2Points,
				taker,
				selectedSuit
			}));
		}
	});

	function selectTaker(name: string) {
		taker = taker === name ? null : name;
	}

	function selectSuit(suit: string) {
		selectedSuit = selectedSuit === suit ? null : suit;
	}

	function addPointTeam1(value: number) {
		team1Points = [...team1Points, value];
		taker = null;
		selectedSuit = null;
	}

	function addPointTeam2(value: number) {
		team2Points = [...team2Points, value];
		taker = null;
		selectedSuit = null;
	}

	function removePointTeam1(index: number) {
		team1Points = team1Points.filter((_, i) => i !== index);
	}

	function removePointTeam2(index: number) {
		team2Points = team2Points.filter((_, i) => i !== index);
	}

	function resetAll() {
		if (!confirm('Voulez-vous vraiment réinitialiser tous les scores de cette partie ?')) {
			return;
		}

		team1Points = [];
		team2Points = [];
		taker = null;
		selectedSuit = null;
		selectedTeam = null;
		if (browser) {
			localStorage.removeItem(storageKey);
		}
	}

	function selectTeam(team: 'team1' | 'team2') {
		selectedTeam = selectedTeam === team ? null : team;
	}

	function addPoints() {
		const value = parseInt(pointInput);
		if (!isNaN(value) && value > 0 && selectedTeam) {
			if (selectedTeam === 'team1') {
				addPointTeam1(value);
			} else {
				addPointTeam2(value);
			}
			pointInput = '';
		}
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
	<button type="button" class="secondary outline reset-btn" onclick={resetAll}>Réinitialiser</button>
</div>

<div class="page-header">
	<h2 class="m-0">Comptage des points</h2>
</div>

<article>
	{#if showSelection}
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
						onclick={() => selectTaker(data.match.team1.player1.name)}
					>{data.match.team1.player1.name}</button>
					<button
						type="button"
						class="player-btn"
						class:selected={taker === data.match.team1.player2.name}
						onclick={() => selectTaker(data.match.team1.player2.name)}
					>{data.match.team1.player2.name}</button>
				</div>
			</div>
			<div class="player-group">
				<span class="team-label team2-color">{data.match.team2.name}</span>
				<div class="player-buttons">
					<button
						type="button"
						class="player-btn"
						class:selected={taker === data.match.team2.player1.name}
						onclick={() => selectTaker(data.match.team2.player1.name)}
					>{data.match.team2.player1.name}</button>
					<button
						type="button"
						class="player-btn"
						class:selected={taker === data.match.team2.player2.name}
						onclick={() => selectTaker(data.match.team2.player2.name)}
					>{data.match.team2.player2.name}</button>
				</div>
			</div>
		</div>
	{/if}

	{#if taker || selectedSuit}
		<div class="taker-display">
			{#if selectedSuit}
				<span class="suit-card" class:red={selectedSuit === '♥' || selectedSuit === '♦'}>{selectedSuit}</span>
			{/if}
			{#if taker}
				<div class="taker-info">
					<span class="taker-label">Preneur</span>
					<span class="taker-name">{taker}</span>
				</div>
			{/if}
			{#if !showSelection && bothSelected}
				<button type="button" class="secondary outline edit-btn" onclick={() => showSelection = true}>
					Modifier
				</button>
			{/if}
		</div>
	{/if}
</article>

<article>
	<div class="scores-row">
		<button
			type="button"
			class="team-score-item team1-color"
			class:selected={selectedTeam === 'team1'}
			onclick={() => selectTeam('team1')}
		>
			<div class="team-name-short">{data.match.team1.name}</div>
			<div class="team-total-sticky">{team1Total}</div>
		</button>
		<div class="vs">-</div>
		<button
			type="button"
			class="team-score-item team2-color"
			class:selected={selectedTeam === 'team2'}
			onclick={() => selectTeam('team2')}
		>
			<div class="team-name-short">{data.match.team2.name}</div>
			<div class="team-total-sticky">{team2Total}</div>
		</button>
	</div>

	{#if !hasWinner}
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

{#if hasWinner}
	<form
		method="POST"
		action="?/saveScore"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					team1Points = [];
					team2Points = [];
					taker = null;
					selectedSuit = null;
					selectedTeam = null;
					if (browser) {
						localStorage.removeItem(storageKey);
					}
				}
				await applyAction(result);
			};
		}}
	>
		<input type="hidden" name="score_team1" value={team1Total} />
		<input type="hidden" name="score_team2" value={team2Total} />
		<article class="winner-section">
			<p class="winner-text">
				<strong>{team1Total >= WINNING_SCORE ? data.match.team1.name : data.match.team2.name}</strong> remportent la manche
				<span class="winner-scores">
					<span class="team1-color">{team1Total}</span> - <span class="team2-color">{team2Total}</span>
				</span>
			</p>
			<button type="submit">Valider et nouvelle manche</button>
		</article>
	</form>
{/if}

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
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

	.red {
		color: #e53935;
	}

	.suit-btn {
		color: #000000;
	}

	.suit-btn.red {
		color: #e53935;
	}

	.players-selection {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.player-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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
		padding: 0.4rem 0.8rem;
		margin: 0;
		font-size: 0.9em;
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
