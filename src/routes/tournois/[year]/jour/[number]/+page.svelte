<script lang="ts">
	import Modal from '$lib/component/Modal.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const matchScores = $state(data.scores);
  console.log(matchScores);


  let showModal: boolean = $state(false);
</script>

<button onclick="{() => (showModal = true)}">Ajouter un match</button>

<table>
  <thead>
    <tr>
      <th>Match</th>
      <th>Scores</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each data.matchs  as match}
      <tr>
        <td>
          <span class="team1-color">{match.team1.name}</span>
          VS
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
            <p>En attente</p>
          {/each}
        </td>
        <td>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<a href="/tournois/{data.tournament.year}">&larr; Retour</a>

<Modal bind:showModal>
	{#snippet header()}
		<h3>
			Nouveau match
		</h3>
	{/snippet}

  <form method="POST" action="?/addMatch">
    <input type="hidden" name="tournament" value="{data.tournament.id}">

    <label for="team1">
      Équipe 1:
      <select name="team1">
        {#each data.teams as team}
          <option value={team.id}>{team.name}</option>
        {/each}
      </select>
    </label>

    <label for="team2">
      Équipe 2:
      <select name="team2">
        {#each data.teams as team}
          <option value={team.id}>{team.name}</option>
        {/each}
      </select>
    </label>

    <label for="score_team1">
      Score équipe 1
      <input type="text" name="score_team1" id="score_team1">
    </label>

    <label for="score_team2">
      Score équipe 2
      <input type="text" name="score_team2" id="score_team2">
    </label>

    <button type="submit">
      Ajouter
    </button>
  </form>
</Modal>
