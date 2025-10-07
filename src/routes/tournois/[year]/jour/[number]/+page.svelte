<script lang="ts">
	import { page } from '$app/state';
	import Modal from '$lib/component/Modal.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const matchScores = $state(data.scores);

	let showModal: boolean = $state(false);

	let teamDetail = $state(null);
	const showTeamInfo = (team) => {
		teamDetail = team;
		showModal = true;
	}
</script>

<a href="/tournois/{data.tournament.year}" class="secondary">← Retour</a>

<hgroup>
	<h1>Jour {page.params.number}</h1>
	<p>Tournoi {data.tournament.year}</p>
</hgroup>

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
					<button class="team1-color as-link" onclick={() => showTeamInfo(match.team1)}>
						{match.team1.name}
					</button>
					<strong>VS</strong>
					<button class="team2-color as-link" onclick={() => showTeamInfo(match.team2)}>
						{match.team2.name}
					</button>
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
				<td>
					<a href="/match/{match.id}/scores">Modifier</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<Modal bind:showModal>
	{#snippet header()}
		<h3>Numéros de téléphones de l'équipe</h3>
	{/snippet}
	{#if teamDetail}
		<p>{teamDetail.player1.name}: {teamDetail.player1.tel}</p>
		<p>{teamDetail.player2.name}: {teamDetail.player2.tel}</p>
	{/if}
</Modal>
