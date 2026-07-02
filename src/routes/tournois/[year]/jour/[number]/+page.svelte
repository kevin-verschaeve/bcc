<script lang="ts">
	import { page } from '$app/state';
	import { matchingAvailabilities } from '$lib/availabilitiesMatcher';
	import Modal from '$lib/component/Modal.svelte';
	import TeamAvailabilities from '$lib/component/TeamAvailabilities.svelte';
	import TeamMatchingAvailabilities from '$lib/component/TeamMatchingAvailabilities.svelte';
	import { getMonthFromNumber, getNumberFromMonth } from '$lib/month';
	import { WINNING_SCORE } from '$lib/scoreUtils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const matchScores = $derived(data.scores);
	const currentDay: number = $derived(Number(page.params.number));
	const nextDay: number = $derived(currentDay + 1);
	const maxDay: number = $derived(data.lastDay);

	let showModal: boolean = $state(false);
	let teamDetail = $state(null);
	const showTeamInfo = (team) => { teamDetail = team; showModal = true; };

	const isFinished = (rounds) => {
		if (rounds.length < 2) return false;
		if (rounds.length === 3) return true;
		const t1 = rounds.filter(r => r.score_team1 >= WINNING_SCORE).length;
		const t2 = rounds.filter(r => r.score_team2 >= WINNING_SCORE).length;
		return t1 === 2 || t2 === 2;
	};

	const getStatus = (rounds) => {
		if (rounds.length === 0) return 'todo';
		if (isFinished(rounds)) return 'done';
		return 'live';
	};

	const wins = (rounds, side: 1 | 2) =>
		rounds.filter(r => (side === 1 ? r.score_team1 : r.score_team2) >= WINNING_SCORE).length;
</script>

<div class="flex-between">
	<a href="/tournois/{data.tournament.year}" class="secondary">← Retour</a>
	<div class="day-nav">
		{#if currentDay > 1}
			<a href="/tournois/{data.tournament.year}/jour/{currentDay - 1}" class="day-nav-link">
				← J{currentDay - 1}
			</a>
		{/if}
		{#if nextDay <= maxDay}
			<a href="/tournois/{data.tournament.year}/jour/{nextDay}" class="day-nav-link">
				J{nextDay} →
			</a>
		{/if}
	</div>
</div>

<div class="page-header">
	<span class="badge">JOUR {currentDay}</span>
	<h1 class="page-header-title">{getMonthFromNumber(currentDay, data.tournament.month_start)}</h1>
	<p class="page-header-subtitle">Tournoi {data.tournament.year} · {data.matchs.length} match{data.matchs.length > 1 ? 's' : ''}</p>
</div>

{#if data.matchs.length === 0}
	<article class="empty-state">
		<h3 class="empty-state-title">Aucun match programmé</h3>
		<p class="empty-state-text">Les matchs apparaîtront une fois le tournoi démarré</p>
	</article>
{:else}
	<div class="card-grid">
		{#each data.matchs as match, i}
			{@const rounds = matchScores[match.id] ?? []}
			{@const status = getStatus(rounds)}
			{@const t1Wins = wins(rounds, 1)}
			{@const t2Wins = wins(rounds, 2)}
			<article class="match-block" class:match-live={status === 'live'}>
				<div class="match-block-head">
					<span class="match-num">MATCH {String(i + 1).padStart(2, '0')}</span>
					{#if status === 'live'}
						<span class="status-badge active">Live</span>
					{:else if status === 'done'}
						<span class="status-badge" style="background: var(--success); color: var(--ink);">Terminé</span>
					{:else}
						<span class="status-badge pending">À jouer</span>
					{/if}
				</div>

				<div class="match-block-body">
					<div class="match-side match-side-left">
						<button class="as-link" onclick={() => showTeamInfo(match.team1)}>{match.team1.name}</button>
						<div class="match-side-score" class:win={t1Wins > t2Wins && status === 'done'} class:dim={status === 'todo'}>
							{status === 'todo' ? '–' : t1Wins}
						</div>
					</div>
					<div class="match-vs">VS</div>
					<div class="match-side match-side-right">
						<button class="as-link" onclick={() => showTeamInfo(match.team2)}>{match.team2.name}</button>
						<div class="match-side-score" class:win={t2Wins > t1Wins && status === 'done'} class:dim={status === 'todo'}>
							{status === 'todo' ? '–' : t2Wins}
						</div>
					</div>
				</div>

				{#if rounds.length > 0}
					<div class="rounds-strip">
						{#each rounds as score, j}
							<div class="round-cell">
								<div class="round-label">M{j + 1}</div>
								<div class="round-score">
									<span class:win-team={score.score_team1 > score.score_team2}>{score.score_team1}</span>
									<span class="round-sep">·</span>
									<span class:win-team={score.score_team2 > score.score_team1}>{score.score_team2}</span>
								</div>
							</div>
						{/each}
						{#each Array(3 - rounds.length) as _, k}
							<div class="round-cell empty">
								<div class="round-label">M{rounds.length + k + 1}</div>
								<div class="round-score">···</div>
							</div>
						{/each}
					</div>
				{/if}

				<div class="match-availability">
					<TeamMatchingAvailabilities availabilities={matchingAvailabilities(match.team1.availabilities, match.team2.availabilities)} />
				</div>

				<div class="match-actions">
					{#if !isFinished(rounds)}
						<a href="/match/{match.id}/comptage" role="button" class="full-width">
							{rounds.length === 0 ? 'Démarrer →' : 'Compter →'}
						</a>
					{/if}
					<a href="/match/{match.id}/scores" role="button" class="outline full-width">
						{isFinished(rounds) ? 'Voir scores' : 'Gérer scores'}
					</a>
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
		<TeamAvailabilities availabilities={teamDetail.availabilities.filter(a => getNumberFromMonth(new Date(a.start).getMonth(), data.tournament.month_start) === Number(page.params.number))} />
	{/if}
</Modal>
