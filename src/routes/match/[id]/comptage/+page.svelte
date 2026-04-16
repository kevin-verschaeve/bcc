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

<div class="flex-between">
	<a href="/match/{data.match.id}/scores" class="secondary">&larr; Retour aux scores</a>
	<button type="button" class="secondary outline reset-btn" onclick={() => game.resetAll(true)}>
		Réinitialiser
	</button>
</div>

<PageHeader title="Comptage des points">
	<TASAModalCounter />
</PageHeader>

<DealerSection {game} />

<article>
	{#if game.showSelection}
		<ContractSelection {game} />
	{/if}

	<TakerDisplay {game} />

	{#if game.hasWinner}
		<WinnerSection {game} />
	{/if}
</article>

<ScorePanel {game} />

<ScoreTable {game} />

<style>
	.reset-btn {
		padding: 0.5rem 1rem;
	}
</style>
