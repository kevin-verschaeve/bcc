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
