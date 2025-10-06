<script lang="ts">
	import { page } from '$app/state';
	import Modal from '$lib/component/Modal.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const matchScores = $state(data.scores);

	let showModal: boolean = $state(false);
</script>

<a href="/tournois/{data.tournament.year}" class="secondary">← Retour</a>

<hgroup>
	<h1>Jour {page.params.number}</h1>
	<p>Tournoi {data.tournament.year}</p>
</hgroup>

<button onclick={() => (showModal = true)}>Ajouter un match</button>

<table role="grid">
	<thead>
		<tr>
			<th scope="col">Match</th>
			<th scope="col">Scores</th>
			<th scope="col">Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each data.matchs as match}
			<tr>
				<td>
					<span class="team1-color">{match.team1.name}</span>
					<strong>VS</strong>
					<span class="team2-color">{match.team2.name}</span>
				</td>
				<td>
					{#each matchScores[match.id] ?? [] as score}
						<p>
							<span class="team1-color">{score.score_team1}</span>
							-
							<span class="team2-color">{score.score_team2}</span>
						</p>
					{:else}
						<p><em>En attente</em></p>
					{/each}
				</td>
				<td></td>
			</tr>
		{/each}
	</tbody>
</table>

<Modal bind:showModal>
	{#snippet header()}
		<h3>Nouveau match</h3>
	{/snippet}

	<form method="POST" action="?/addMatch">
		<input type="hidden" name="tournament" value={data.tournament.id} />

		<label for="team1">
			Équipe 1:
			<select name="team1" id="team1">
				{#each data.teams as team}
					<option value={team.id}>{team.name}</option>
				{/each}
			</select>
		</label>

		<label for="team2">
			Équipe 2:
			<select name="team2" id="team2">
				{#each data.teams as team}
					<option value={team.id}>{team.name}</option>
				{/each}
			</select>
		</label>

		<div class="grid">
			<label for="score_team1">
				Score équipe 1
				<input type="number" name="score_team1" id="score_team1" />
			</label>

			<label for="score_team2">
				Score équipe 2
				<input type="number" name="score_team2" id="score_team2" />
			</label>
		</div>

		<button type="submit">Ajouter</button>
	</form>
</Modal>
