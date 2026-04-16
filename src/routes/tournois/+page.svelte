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
</script>

<a href="/" class="secondary">← Retour</a>

<div class="page-title-container">
	<h1 class="m-0">Tournois</h1>
	<button onclick={() => (showCreateModal = true)}>Nouveau tournoi</button>
</div>

{#if data.tournaments.length === 0}
	<article class="empty-state">
		<h3 class="empty-state-title">Aucun tournoi pour le moment</h3>
		<p class="empty-state-text">Créez votre premier tournoi pour commencer</p>
	</article>
{:else}
	<div class="card-grid">
		{#each data.tournaments as tournament}
			<a
				href="/tournois/{tournament.year}"
				class="tournament-card"
				data-sveltekit-preload-data="hover"
			>
				<article class="tournament-card-content">
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
					<span class="tournament-card-arrow">›</span>
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

		<label for="month_start">
			Mois de début
			<select name="month_start" id="month_start">
				{#each months as month}
					<option value={month.value} selected={month.value === 8}>{month.label}</option>
				{/each}
			</select>
		</label>

		<button type="submit">Créer</button>
	</form>
</Modal>
