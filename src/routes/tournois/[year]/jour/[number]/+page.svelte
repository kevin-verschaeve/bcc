<script lang="ts">
	import { page } from '$app/state';
	import { matchingAvailabilities } from '$lib/availabilitiesMatcher';
	import Modal from '$lib/component/Modal.svelte';
	import TeamAvailabilities from '$lib/component/TeamAvailabilities.svelte';
	import TeamMatchingAvailabilities from '$lib/component/TeamMatchingAvailabilities.svelte';
	import { getMonthFromNumber, getNumberFromMonth } from '$lib/month';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const matchScores = $derived(data.scores);

	const currentDay: number = $derived(Number(page.params.number));
	const nextDay: number = $derived(currentDay + 1);
	const maxDay: number = 7; // todo find dynamically

	let showModal: boolean = $state(false);

	let teamDetail = $state(null);
	const showTeamInfo = (team) => {
		teamDetail = team;
		showModal = true;
	}
</script>

<div class="prev-next">
	<a href="/tournois/{data.tournament.year}" class="secondary">← Retour</a>

	<div>
		{#if currentDay > 1}
			<a href="/tournois/{data.tournament.year}/jour/{currentDay - 1}">&larr; {getMonthFromNumber(currentDay - 1)}</a>
		{/if}
		{#if nextDay <= maxDay}
			<a href="/tournois/{data.tournament.year}/jour/{nextDay}">{getMonthFromNumber(nextDay)} &rarr;</a>
		{/if}
	</div>
</div>

<div class="page-header">
	<hgroup class="m-0">
		<h1 class="page-header-title">Jour {page.params.number} - {getMonthFromNumber(currentDay)}</h1>
		<p class="page-header-subtitle">Tournoi {data.tournament.year}</p>
	</hgroup>
</div>

<h3 class="section-title">Matchs de la journée</h3>

{#if data.matchs.length === 0}
	<article class="empty-state">
		<h3 class="empty-state-title">Aucun match programmé</h3>
		<p class="empty-state-text">Les matchs seront disponibles une fois le tournoi démarré</p>
	</article>
{:else}
	<div class="card-grid">
		{#each data.matchs as match}
			<article style="padding: 1.5rem;">
				<div class="match-card-layout">
					<div class="match-team-right">
						<button
							class="team1-color as-link"
							onclick={() => showTeamInfo(match.team1)}
							style="font-size: 1.3rem;"
						>
							{match.team1.name}
						</button>
					</div>

					<div class="match-vs-divider">
						VS
					</div>

					<div class="match-team-left">
						<button
							class="team2-color as-link"
							onclick={() => showTeamInfo(match.team2)}
							style="font-size: 1.3rem;"
						>
							{match.team2.name}
						</button>
					</div>
				</div>

				<div class="match-info-section">
					<div class="match-scores-display">
						<div class="flex-1">
							<TeamMatchingAvailabilities availabilities={matchingAvailabilities(match.team1.availabilities, match.team2.availabilities)} />
						</div>
						<div class="match-scores-list">
							{#each matchScores[match.id] ?? [] as score, index}
								<div class="match-score-badge">
									<div class="match-score-label">
										Manche {index + 1}
									</div>
									<div class="match-score-value">
										<span class="team1-color">{score.score_team1}</span>
										<span class="match-score-separator"> - </span>
										<span class="team2-color">{score.score_team2}</span>
									</div>
								</div>
							{:else}
								<div class="match-pending-text">
									En attente de scores
								</div>
							{/each}
						</div>
						<div>
							<a href="/match/{match.id}/scores" role="button" class="m-0 whitespace-nowrap">
								Gérer les scores
							</a>
						</div>
					</div>
				</div>
			</article>
		{/each}
	</div>
{/if}

<Modal bind:showModal>
	{#snippet header()}
		<h3>{teamDetail?.name}</h3>
	{/snippet}

	{#if teamDetail}
		<p>{teamDetail.player1.name}: {teamDetail.player1.tel}</p>
		<p>{teamDetail.player2.name}: {teamDetail.player2.tel}</p>
		<TeamAvailabilities availabilities={teamDetail.availabilities.filter(a => getNumberFromMonth(new Date(a.start).getMonth()) === Number(page.params.number))} />
	{/if}
</Modal>
