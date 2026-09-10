<script lang="ts">
	import Comptage from '$lib/comptage/Comptage.svelte';
	import WinnerSection from '$lib/comptage/WinnerSection.svelte';
	import { ComptageGame, type ComptageMatch } from '$lib/comptage/comptage.svelte.js';
	import { LIBRE_GAME_STORAGE_KEY } from './libreMatch';

	let { match }: { match: ComptageMatch } = $props();

	// Same counter as a tournament match, minus the persistence: nothing is
	// written to the database, the winner just starts another game.
	const game = new ComptageGame(match, { storageKey: LIBRE_GAME_STORAGE_KEY });
</script>

<Comptage {game} title="Comptage libre" badge="HORS TOURNOI">
	{#snippet back()}
		<a href="/comptage?joueurs" class="secondary back-link">← Joueurs</a>
	{/snippet}

	{#snippet winner()}
		<WinnerSection {game}>
			<button type="button" class="winner-submit" onclick={() => game.resetAll(false)}>
				NOUVELLE PARTIE →
			</button>
		</WinnerSection>
	{/snippet}
</Comptage>
