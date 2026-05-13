<script lang="ts">
	import type { PageProps } from './$types';
	import { ComptageGame } from './comptage.svelte.js';
	import PageHeader from './PageHeader.svelte';
	import TASAModalCounter from './TASAModalCounter.svelte';
	import DealerSection from './DealerSection.svelte';
	import ContractSelection from './ContractSelection.svelte';
	import TakerDisplay from './TakerDisplay.svelte';
	import ScorePanel from './ScorePanel.svelte';
	import ScoreTable from './ScoreTable.svelte';
	import WinnerSection from './WinnerSection.svelte';

	let { data }: PageProps = $props();

	const game = new ComptageGame(data.match);
</script>

<div class="top-bar">
	<a href="/match/{data.match.id}/scores" class="secondary back-link">← Scores</a>
	<button type="button" class="reset-btn" onclick={() => game.resetAll(true)} aria-label="Réinitialiser">
		↺ RESET
	</button>
</div>

<PageHeader title="Comptage">
	<TASAModalCounter />
</PageHeader>

<DealerSection {game} />

<section class="contract-panel">
	{#if game.showSelection}
		<ContractSelection {game} />
	{/if}

	<TakerDisplay {game} />

	{#if game.hasWinner}
		<WinnerSection {game} />
	{/if}
</section>

<ScorePanel {game} />

<ScoreTable {game} />

<style>
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}
	.back-link {
		margin: 0 !important;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 1.2px;
		text-transform: uppercase;
		padding: 6px 10px;
		border: 2px solid var(--b-ink);
		background: var(--b-bg);
		color: var(--b-ink) !important;
		text-decoration: none !important;
	}
	.back-link:hover { background: var(--b-yellow); }

	.reset-btn {
		font-family: var(--font-mono) !important;
		font-size: 0.72rem !important;
		font-weight: 700;
		letter-spacing: 1.2px;
		padding: 8px 14px !important;
		background: var(--b-bg) !important;
		color: var(--b-ink) !important;
		border: 2px solid var(--b-ink) !important;
		box-shadow: none !important;
		margin: 0 !important;
		text-transform: uppercase;
	}
	.reset-btn:hover {
		background: var(--b-red) !important;
		color: var(--b-bg) !important;
		transform: none !important;
		box-shadow: 3px 3px 0 var(--b-ink) !important;
	}

	.contract-panel {
		background: var(--b-bg);
		border: var(--b-border-thick);
		box-shadow: var(--b-shadow);
		padding: 1rem;
		margin-bottom: 1rem;
	}
</style>
