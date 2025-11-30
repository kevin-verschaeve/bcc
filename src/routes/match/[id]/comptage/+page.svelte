<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';
	import TeamPoints from './TeamPoints.svelte';
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

	const suits = ['♠', '♥', '♦', '♣', 'TA', 'SA'];

	const team1Total = $derived(team1Points.reduce((sum, p) => sum + p, 0));
	const team2Total = $derived(team2Points.reduce((sum, p) => sum + p, 0));
	const hasWinner = $derived(team1Total >= WINNING_SCORE || team2Total >= WINNING_SCORE);

	// Save to localStorage whenever state changes
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
		if (browser) {
			localStorage.removeItem(storageKey);
		}
	}
</script>

<a href="/match/{data.match.id}/scores" class="secondary">&larr; Retour aux scores</a>

<div class="page-header">
	<h2 class="m-0">Comptage des points</h2>
	<button type="button" class="secondary outline reset-btn" onclick={resetAll}>Réinitialiser</button>
</div>

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
	</div>
{/if}

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

<div class="comptage-container">
	<TeamPoints
		team={data.match.team1}
		points={team1Points}
		{taker}
		colorClass="team1-color"
		onAddPoint={addPointTeam1}
		onRemovePoint={removePointTeam1}
		onSelectTaker={selectTaker}
        {hasWinner}
	/>

	<TeamPoints
		team={data.match.team2}
		points={team2Points}
		{taker}
		colorClass="team2-color"
		onAddPoint={addPointTeam2}
		onRemovePoint={removePointTeam2}
		onSelectTaker={selectTaker}
        {hasWinner}
	/>
</div>

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
		margin: 0;
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
		background: none;
		border: 2px solid var(--pico-muted-border-color);
		border-radius: 6px;
		cursor: pointer;
		margin: 0;
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
		background: var(--pico-secondary-background);
	}

	.suit-btn.selected {
		background: var(--pico-primary-background);
		border-color: var(--pico-primary);
	}

	.suit-btn.red {
		color: #e53935;
	}

	.suit-btn:not(.red) {
		color: var(--pico-contrast);
	}

	.red {
		color: #e53935;
	}

	.taker-display {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--pico-card-background-color);
		border: 1px solid var(--pico-muted-border-color);
		border-radius: 8px;
		margin-bottom: 1rem;
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

	.comptage-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	@media (max-width: 600px) {
		.comptage-container {
			grid-template-columns: 1fr;
		}
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
