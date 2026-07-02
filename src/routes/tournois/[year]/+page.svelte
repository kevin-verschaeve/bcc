<script lang="ts">
	import { enhance } from '$app/forms';
	import { getMonthFromNumber, getNumberFromMonth } from '$lib/month';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let rankedTeams = $derived(
		Object.entries(data.summary ?? {})
			.map(([team_name, summary]) => {
				const totalPoints = summary?.map(s => s.total_points).reduce((acc, points) => acc + points, 0) || 0;
				const totalGoalAverage = summary?.map(s => s.goal_average).reduce((acc, avg) => acc + avg, 0) || 0;
				const matchCount = summary?.length;
				return { team_name, totalPoints, totalGoalAverage, matchCount };
			})
			.sort((a, b) => {
				if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
				return b.totalGoalAverage - a.totalGoalAverage;
			})
	);

	const currentMonth = new Date().getMonth();
	const currentDayNumber = $derived(getNumberFromMonth(currentMonth, data.tournament.month_start));
	const days = $derived([...data.days].sort((a, b) => a - b));
</script>

<a href="/tournois" class="secondary">← Retour</a>

<div class="page-header">
	<div class="badge-container">
		<span class="badge">SAISON {data.tournament.year}/{(data.tournament.year + 1).toString().slice(2)}</span>
		{#if data.tournament.status === 'not_started'}
			<span class="status-badge pending">Non démarré</span>
		{:else if data.tournament.status === 'in_progress'}
			<span class="status-badge active">En cours</span>
		{/if}
	</div>
	<h1 class="page-header-title">{data.tournament.name || `Saison ${data.tournament.year}`}</h1>
	<p class="page-header-subtitle">Tournoi {data.tournament.year} – {data.tournament.year + 1}</p>

	{#if data.tournament.status === 'in_progress'}
		<a href="/tournois/{data.tournament.year}/jour/{currentDayNumber}" role="button">
			ZAP MATCHS DU MOIS →
		</a>
	{/if}

	{#if data.tournament.status === 'not_started'}
		<div class="action-flex" style="margin-top: 1rem;">
			<a href="/tournois/{data.tournament.year}/equipes" role="button" class="outline m-0">Gérer les équipes</a>
			<form method="POST" action="?/startTournament" use:enhance class="m-0">
				<input type="hidden" name="tournament" value={data.tournament.id} />
				<button type="submit" class="m-0">Démarrer →</button>
			</form>
		</div>
	{/if}
</div>

{#if days.length > 0}
	<h3 class="section-title">Jours de tournoi</h3>
	<div class="day-strip">
		{#each days as number}
			{@const isLive = number === currentDayNumber && data.tournament.status === 'in_progress'}
			<a href="/tournois/{data.tournament.year}/jour/{number}" class="day-cell" class:live={isLive}>
				<div class="day-cell-num">J{number}</div>
				<div class="day-cell-month">{getMonthFromNumber(number, data.tournament.month_start).slice(0, 3).toUpperCase()}</div>
			</a>
		{/each}
	</div>
{/if}

<article>
	<h3 class="section-title">Résultats par jour</h3>
	<div class="overflow-auto">
		<table class="striped" role="grid">
			<thead>
				<tr>
					<th scope="col" rowspan="2" class="table-col-fixed">Équipe</th>
					{#each days as number}
						<th colspan="2" class="text-center table-header-colored">
							<a href="/tournois/{data.tournament.year}/jour/{number}" class="table-link-bold">
								J{number} · {getMonthFromNumber(number, data.tournament.month_start).slice(0, 3)}
							</a>
						</th>
					{/each}
				</tr>
				<tr>
					{#each days as _}
						<th class="table-header-light">PTS</th>
						<th class="table-header-light">GA</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each Object.entries(data.summary) as [team_name, summary]}
					<tr>
						<td><strong class="table-cell-large">{team_name}</strong></td>
						{#each days as number}
							<td class="text-center">
								<span class="table-cell-emphasized">
									{summary?.find(s => s.number === number)?.total_points ?? '–'}
								</span>
							</td>
							<td class="text-center table-cell-muted">
								{summary?.find(s => s.number === number)?.goal_average ?? '–'}
							</td>
						{/each}
					</tr>
				{:else}
					<tr><td colspan="{(days.length * 2) + 1}" class="text-center"><em class="table-cell-muted">Aucun match joué</em></td></tr>
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
					<th class="table-col-rank">#</th>
					<th>Équipe</th>
					<th class="text-center">Pts</th>
					<th class="text-center">Goal avg</th>
					<th class="text-center">Matchs</th>
				</tr>
			</thead>
			<tbody>
				{#each rankedTeams as { team_name, totalPoints, totalGoalAverage, matchCount }, index}
					<tr class={index < 3 ? 'ranking-row-podium' : ''}>
						<td class="ranking-position">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</td>
						<td><strong class="ranking-team-name">{team_name}</strong></td>
						<td class="text-center"><strong class="table-cell-primary">{totalPoints}</strong></td>
						<td class="text-center table-cell-emphasized" style:color={totalGoalAverage < 0 ? 'var(--danger)' : 'var(--ink)'}>
							{totalGoalAverage > 0 ? '+' : ''}{totalGoalAverage}
						</td>
						<td class="text-center table-cell-emphasized">{matchCount}</td>
					</tr>
				{:else}
					<tr><td colspan="5" class="text-center"><em class="table-cell-muted">Aucun match joué</em></td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</article>
