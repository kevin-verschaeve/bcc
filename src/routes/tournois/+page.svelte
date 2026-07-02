<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/component/Modal.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let showCreateModal: boolean = $state(false);

	const months = Array.from({ length: 12 }, (_, i) => ({
		value: i,
		label: new Date(2000, i, 1).toLocaleDateString('fr-FR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase()),
	}));

	const liveTournament = $derived(data.tournaments.find(t => t.status === 'in_progress'));
	const otherTournaments = $derived(data.tournaments.filter(t => t.status !== 'in_progress'));
</script>

<a href="/" class="secondary">← Retour</a>

<div class="page-title-container">
	<div>
		<h1 class="m-0">Tournois</h1>
		<p class="page-meta">{data.tournaments.length} saison{data.tournaments.length > 1 ? 's' : ''}{liveTournament ? ' · 1 en cours' : ''}</p>
	</div>
	<button onclick={() => (showCreateModal = true)}>+ Nouveau</button>
</div>

{#if data.tournaments.length === 0}
	<article class="empty-state">
		<h3 class="empty-state-title">Aucun tournoi</h3>
		<p class="empty-state-text">Créez votre premier tournoi pour commencer</p>
	</article>
{:else}
	{#if liveTournament}
		<a href="/tournois/{liveTournament.year}" class="tournament-card live-card" data-sveltekit-preload-data="hover">
			<article class="highlight">
				<div class="live-card-meta">SAISON {liveTournament.year}/{(liveTournament.year + 1).toString().slice(2)}</div>
				<div class="live-card-row">
					<h2 class="live-card-title">{liveTournament.name || `Tournoi ${liveTournament.year}`}</h2>
					<span class="status-badge active">En cours</span>
				</div>
				<div class="live-card-cta">Ouvrir →</div>
			</article>
		</a>

		<h3 class="section-title">Historique</h3>
	{/if}

	<div class="card-grid">
		{#each otherTournaments as tournament}
			<a href="/tournois/{tournament.year}" class="tournament-card" data-sveltekit-preload-data="hover">
				<article>
					<div class="tournament-card-content">
						<div class="tournament-card-info">
							<div class="tournament-card-header">
								<span class="badge">SAISON {tournament.year}/{(tournament.year + 1).toString().slice(2)}</span>
								{#if tournament.status === 'not_started'}
									<span class="status-badge pending">Non démarré</span>
								{/if}
							</div>
							<h3 class="tournament-card-title">{tournament.name || `Tournoi ${tournament.year}`}</h3>
						</div>
						<span class="tournament-card-arrow">›</span>
					</div>
				</article>
			</a>
		{/each}
	</div>
{/if}

<Modal bind:showModal={showCreateModal}>
	{#snippet header()}
		<h3>Nouveau tournoi</h3>
	{/snippet}

	<form method="POST" action="?/create" use:enhance={() => ({ result }) => { if (result.type === 'success') showCreateModal = false; }}>
		<label for="name">
			Nom <small>(optionnel)</small>
			<input type="text" name="name" id="name" />
		</label>

		<label for="month_start">Mois de début
			<select name="month_start" id="month_start">
				{#each months as month}
					<option value={month.value} selected={month.value === 8}>{month.label}</option>
				{/each}
			</select>
		</label>

		<button type="submit">Créer</button>
	</form>
</Modal>
