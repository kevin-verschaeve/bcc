<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ComptageGame } from './comptage.svelte.js';
	import PageHeader from './PageHeader.svelte';
	import TASAModalCounter from './TASAModalCounter.svelte';
	import DealerSection from './DealerSection.svelte';
	import ContractSelection from './ContractSelection.svelte';
	import TakerDisplay from './TakerDisplay.svelte';
	import ScorePanel from './ScorePanel.svelte';
	import ScoreTable from './ScoreTable.svelte';

	// The whole counting screen. The two entry points (a tournament match and a
	// one-off game) share it and only differ by the `back` link and by what the
	// `winner` snippet does once a team reaches the winning score.
	let {
		game,
		title = 'Comptage',
		badge = 'MANCHE EN COURS',
		back,
		winner
	}: {
		game: ComptageGame;
		title?: string;
		badge?: string;
		back?: Snippet;
		winner?: Snippet;
	} = $props();
</script>

<div class="top-bar">
	{@render back?.()}
	<button
		type="button"
		class="reset-btn"
		onclick={() => game.resetAll(true)}
		aria-label="Réinitialiser"
	>
		↺ RESET
	</button>
</div>

<PageHeader {title} {badge}>
	<TASAModalCounter />
</PageHeader>

<DealerSection {game} />

<section class="contract-panel">
	{#if game.showSelection}
		<ContractSelection {game} />
	{/if}

	<TakerDisplay {game} />

	{#if game.hasWinner}
		{@render winner?.()}
	{/if}
</section>

<ScorePanel {game} />

<ScoreTable {game} />
