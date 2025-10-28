<script lang="ts">
	import { getMonthFromNumber } from '$lib/month';
	import type { PageProps } from './$types';

	export const config = { runtime: 'edge' };

	let { data }: PageProps = $props();

	let rankedTeams = $derived(
		Object.entries(data.summary)
			.map(([team_name, summary]) => {
				const totalPoints = summary?.map(s => s.total_points).reduce((acc, points) => acc + points, 0) || 0;
				const totalGoalAverage = summary?.map(s => s.goal_average).reduce((acc, avg) => acc + avg, 0) || 0;
				return { team_name, summary, totalPoints, totalGoalAverage };
			})
			.sort((a, b) => {
				// Sort by total points first (descending)
				if (a.totalPoints !== b.totalPoints) {
					return b.totalPoints - a.totalPoints;
				}

				// Then by goal average (descending)
				return b.totalGoalAverage - a.totalGoalAverage;
			})
	);
</script>

<a href="/tournois" class="secondary">← Retour</a>

<div class="page-header">
	<hgroup class="mb-sm">
		<div class="badge-container">
			<h1 class="page-header-title">Tournoi {data.tournament.year} - {data.tournament.year + 1}</h1>
			{#if data.tournament.status === 'not_started'}
				<span class="status-badge pending">Non démarré</span>
			{:else if data.tournament.status === 'in_progress'}
				<span class="status-badge active">En cours</span>
			{/if}
		</div>
		<p class="page-header-subtitle page-header-large">{data.tournament.name || 'Saison ' + data.tournament.year}</p>
	</hgroup>

	{#if data.tournament.status === 'not_started'}
	  <div class="action-flex">
		<a href="/tournois/{data.tournament.year}/equipes" role="button" class="outline m-0">
		  Gérer les équipes
		</a>
		<form method="POST" action="?/startTournament" class="m-0">
		  <input type="hidden" name="tournament" value={data.tournament.id} />
		  <button type="submit" class="m-0">Démarrer le tournoi</button>
		</form>
	  </div>
	{/if}
</div>

<article>
	<h3 class="section-title">Résultats par jour</h3>
	<div class="overflow-auto">
		<table class="striped" role="grid">
		<thead>
		  <tr>
			<th scope="col" rowspan="2" class="table-col-fixed">Équipe</th>
			{#each data.days as number}
			  <th colspan="2" class="text-center table-header-colored">
				<a href="/tournois/{data.tournament.year}/jour/{number}" class="table-link-bold">
					J{number} - {getMonthFromNumber(number)}
				</a>
			  </th>
			{/each}
		  </tr>
		  <tr>
			{#each data.days as _}
			  <th class="table-header-light">Points</th>
			  <th class="table-header-light">Goal avg</th>
			{/each}
		  </tr>
		</thead>
		<tbody>
		  {#each Object.entries(data.summary) as [team_name, summary]}
		  <tr>
			  <td>
				<strong class="table-cell-large">{team_name}</strong>
			  </td>
			  {#each data.days as number}
				<td class="table-cell-centered">
				  <span class="table-cell-emphasized">
					{summary?.find(team_summary => team_summary.number === number)?.total_points ?? '-'}
				  </span>
				</td>
				<td class="table-cell-centered table-cell-muted">
				  {summary?.find(team_summary => team_summary.number === number)?.goal_average ?? '-'}
				</td>
			{/each}
		  </tr>
		  {:else}
		  <tr>
			  <td colspan="{(data.days.size * 2) + 1}" class="text-center">
				<em class="table-cell-muted">Aucun match joué pour le moment</em>
			  </td>
		  </tr>
		  {/each}
		</tbody>
	  </table>
	</div>
</article>

<article class="mt-lg">
  	<h3 class="section-title section-title-center">Classement général</h3>
	<div class="overflow-auto">
		<table class="striped" role="grid">
		<thead>
		<tr>
			<th scope="col" class="table-col-rank">#</th>
			<th scope="col">Équipe</th>
			<th scope="col" class="text-center">Points</th>
			<th scope="col" class="text-center">Goal average</th>
		</tr>
		</thead>
		<tbody>
		{#each rankedTeams as { team_name, summary, totalPoints, totalGoalAverage }, index}
		<tr class={index < 3 ? 'ranking-row-podium' : ''}>
			<td class="ranking-position">
				{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
			</td>
			<td>
				<strong class="ranking-team-name">{team_name}</strong>
			</td>
			<td class="table-cell-centered">
				<strong class="table-cell-primary">
					{totalPoints}
				</strong>
			</td>
			<td class="table-cell-centered table-cell-emphasized">
				{totalGoalAverage}
			</td>
		</tr>
		{:else}
		<tr>
			<td colspan="4" class="text-center">
				<em class="table-cell-muted">Aucun match joué pour le moment</em>
			</td>
		</tr>
		{/each}
		</tbody>
	</table>
  </div>
</article>
