<script lang="ts">
	import { getMonthFromNumber } from '$lib/month';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<a href="/tournois" class="secondary">← Retour</a>

<hgroup>
	<h1>Tournoi {data.tournament.year} - {data.tournament.year + 1}</h1>
	<p>{data.tournament.name || 'Saison ' + data.tournament.year}</p>
</hgroup>

{#if data.tournament.status === 'not_started'}
  <nav>
    <ul>
      <li>
        <a href="/tournois/{data.tournament.year}/equipes" role="button" class="outline">
          Équipes du tournois
        </a>
      </li>
      <li>
        <form method="POST" action="?/startTournament">
          <input type="hidden" name="tournament" value={data.tournament.id} />
          <button type="submit" class="contrast">Démarrer le tournoi</button>
        </form>
      </li>
    </ul>
  </nav>
{/if}

<article class="overflow-auto">
	<table class="striped" role="grid">
    <thead>
      <tr>
        <th scope="col" rowspan="2">Équipe</th>
        {#each data.days as number}
          <th colspan="2" class="text-center">
            <a href="/tournois/{data.tournament.year}/jour/{number}">J{number} - {getMonthFromNumber(number)}</a></th>
        {/each}
      </tr>
      <tr>
        {#each data.days as _}
          <th>Points</th>
          <th>Goal average</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each Object.entries(data.summary) as [team_name, summary]}
      <tr>
          <td>
            <strong>{team_name}</strong>
          </td>
          {#each data.days as number}
            <td>
              {summary?.find(team_summary => team_summary.number === number)?.total_points ?? '-'}
            </td>
            <td>
              {summary?.find(team_summary => team_summary.number === number)?.goal_average ?? '-'}
            </td>
        {/each}
      </tr>
      {:else}
      <tr>
          <td colspan="{(data.days.size * 2) + 2}" class="text-center">
            <i>Aucun match joué pour le moment</i>
          </td>
      </tr>
      {/each}
    </tbody>
  </table>
</article>

<article class="overflow-auto">
  <h3 class="text-center">Total</h3>
	<table class="striped" role="grid">
    <thead>
      <tr>
        <th scope="col">Équipe</th>
        <th scope="col">Points</th>
        <th scope="col">Goal average</th>
      </tr>
    </thead>
    <tbody>
      {#each Object.entries(data.summary) as [team_name, summary]}
      <tr>
          <td>
            <strong>{team_name}</strong>
          </td>
          <td>
            {summary?.map(s => s.total_points).reduce((acc, points) => (acc += points))}
          </td>
          <td>
            {summary?.map(s => s.goal_average).reduce((acc, points) => (acc += points))}
          </td>
      </tr>
      {:else}
      <tr>
          <td colspan="3" class="text-center">
            <i>Aucun match joué pour le moment</i>
          </td>
      </tr>
      {/each}
    </tbody>
  </table>
</article>
