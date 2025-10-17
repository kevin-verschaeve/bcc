<script lang="ts">
   import { enhance } from '$app/forms';
   import Modal from '$lib/component/Modal.svelte';
   import Svelecte from 'svelecte';
   import type { PageProps } from './$types';
   import type { Tables } from '../../../database.types';

  let { data }: PageProps = $props();
  let players: Tables<'players'>[] = $state(data.players);

  let showModal: boolean = $state(false);
</script>

<a href="/" class="secondary">← Retour</a>

<div class="page-title-container">
	<h1 class="m-0">Équipes</h1>
	<button onclick={() => (showModal = true)}>+ Ajouter une équipe</button>
</div>

{#if data.teams.length === 0}
	<article class="empty-state">
		<h3 class="empty-state-title">Aucune équipe pour le moment</h3>
		<p class="empty-state-with-action">Créez votre première équipe pour commencer</p>
		<button onclick={() => (showModal = true)}>Créer une équipe</button>
	</article>
{:else}
	<div class="card-grid-auto">
		{#each data.teams as team}
			<article class="team-card">
				<div class="team-card-header">
					<h3 class="m-0" style="font-size: 1.3rem;">{team.name}</h3>
				</div>

				<div class="team-card-players">
					<div class="team-card-player">
						<span class="team-card-player-icon">👤</span>
						<span class="team-card-player-name">{team.player1.name}</span>
					</div>
					<div class="team-card-player">
						<span class="team-card-player-icon">👤</span>
						<span class="team-card-player-name">{team.player2.name}</span>
					</div>
				</div>

				<div class="team-card-actions">
					<a href="/equipes/{team.id}/dispos" role="button" class="m-0 text-center">
						Gérer les disponibilités
					</a>
					<form action="?/delete" method="POST" use:enhance class="m-0">
						<input type="hidden" name="team" value={team.id} />
						<button type="submit" class="secondary outline m-0 full-width">
							Supprimer
						</button>
					</form>
				</div>
			</article>
		{/each}
	</div>
{/if}

<Modal bind:showModal>
	{#snippet header()}
		<h3>Nouvelle équipe</h3>
	{/snippet}

	<form method="POST" action="?/create">
		<label for="name">
			Nom de l'équipe
			<input type="text" name="name" id="name" required />
		</label>

		<label for="player1">
			Joueur 1:
			<Svelecte
				name="player1"
				options={players}
				valueField="id"
				labelField="name"
				required={true}
			/>
		</label>

		<label for="player2">
			Joueur 2:
			<Svelecte
				name="player2"
				options={players}
				valueField="id"
				labelField="name"
				required={true}
			/>
		</label>

		<button type="submit">Ajouter</button>
	</form>
</Modal>
