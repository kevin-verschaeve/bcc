<script lang="ts">
	import type { PageProps } from './$types';
	import type { Tables } from '../../../database.types';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	const showTournament = (tournament: Tables<'tournaments'>) => {
		goto(`/tournois/${tournament.year}`);
	};
</script>

<a href="/" class="secondary">← Retour</a>

<div class="page-title-container">
	<h1 class="m-0">Tournois</h1>
</div>

{#if data.tournaments.length === 0}
	<article class="empty-state">
		<h3 class="empty-state-title">Aucun tournoi pour le moment</h3>
		<p class="empty-state-text">Créez votre premier tournoi pour commencer</p>
	</article>
{:else}
	<div class="card-grid">
		{#each data.tournaments as tournament}
			<article
				class="tournament-card"
				onclick={() => showTournament(tournament)}
				onmouseover={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
				onmouseout={(e) => e.currentTarget.style.transform = 'translateY(0)'}
			>
				<div class="tournament-card-content">
					<div class="tournament-card-info">
						<div class="tournament-card-header">
							<h3 class="tournament-card-title">
								Saison {tournament.year} - {tournament.year + 1}
							</h3>
							{#if tournament.status === 'not_started'}
								<span class="status-badge pending">Non démarré</span>
							{:else if tournament.status === 'in_progress'}
								<span class="status-badge active">En cours</span>
							{/if}
						</div>
						<p class="tournament-card-subtitle">
							{tournament.name || `Tournoi ${tournament.year}`}
						</p>
					</div>
					<div class="tournament-card-actions" onclick={(e) => e.stopPropagation()}>
						<form action="?/delete" method="POST">
							<button type="submit" class="secondary outline m-0">
								Supprimer
							</button>
						</form>
					</div>
				</div>
			</article>
		{/each}
	</div>
{/if}
