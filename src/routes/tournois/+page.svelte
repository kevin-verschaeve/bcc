<script lang="ts">
  import type { PageProps } from './$types';
  import type { Tables } from "../../../database.types";
	import { goto } from '$app/navigation';

  let { data }: PageProps = $props();

  const showTournament = (tournament: Tables<'tournaments'>) => {
    goto(`/tournois/${tournament.year}`)
  }
</script>

<table>
  <thead>
    <tr>
      <th>Saison</th>
      <th>Nom</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each data.tournaments as tournament}
      <tr>
        <td onclick={() => showTournament(tournament)}>{tournament.year}</td>
        <td onclick={() => showTournament(tournament)}>{tournament.name}</td>
        <td>
          <form action="?/delete">
            <button type="submit">
              Supprimer
          </button>
          </form>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
