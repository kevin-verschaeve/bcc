<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/component/Modal.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let showModal: boolean = $state(false);
</script>


<h2>Équipes du tournoi {data.tournament.year} - {data.tournament.name}</h2>

<button onclick="{() => (showModal = true)}">Ajouter une équipe</button>

<table>
  <thead>
    <tr>
      <th scope="col">Nom</th>
      <th scope="col">Joueurs</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each data.tournament_teams as tournament_team}
      <tr>
        <td>
          {tournament_team.team.name}
        </td>
        <td>
          {tournament_team.team.player1.name} -
          {tournament_team.team.player2.name}
        </td>
        <td>
          <form action="?/delete" method="POST" use:enhance>
            <input type="hidden" name="tournament_team" value="{tournament_team.id}">
            <button type="submit">
              Supprimer
            </button>
          </form>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<Modal bind:showModal>
	{#snippet header()}
		<h3>
			Ajouter une équipe
		</h3>
	{/snippet}

  <form method="POST" action="?/addTeam">
    <input type="hidden" name="tournament_id" value="{data.tournament.id}">
    <select name="team_id">
      {#each data.teams as team}
        <option value={team.id}>{team.name}</option>
      {/each}
    </select>

    <button type="submit">
      Ajouter
    </button>
  </form>
</Modal>
