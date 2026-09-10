<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import type { PageProps } from './$types';
	import Comptage from '$lib/comptage/Comptage.svelte';
	import WinnerSection from '$lib/comptage/WinnerSection.svelte';
	import { ComptageGame } from '$lib/comptage/comptage.svelte.js';

	let { data }: PageProps = $props();

	const game = new ComptageGame(data.match);
</script>

<Comptage {game}>
	{#snippet back()}
		<a href="/match/{data.match.id}/scores" class="secondary back-link">← Scores</a>
	{/snippet}

	{#snippet winner()}
		<form
			method="POST"
			action="?/saveScore"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						game.resetAll(false);
					}
					await applyAction(result);
				};
			}}
		>
			<input type="hidden" name="score_team1" value={game.team1Total} />
			<input type="hidden" name="score_team2" value={game.team2Total} />

			<WinnerSection {game}>
				<button type="submit" class="winner-submit"> VALIDER & NOUVELLE MANCHE → </button>
			</WinnerSection>
		</form>
	{/snippet}
</Comptage>
