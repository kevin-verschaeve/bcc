<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/component/Modal.svelte';
  import type { PageProps } from './$types';
	import type { Tables } from '../../../database.types';

  let { data }: PageProps = $props();

  let showAddModal: boolean = $state(false);
  let showEditModal: boolean = $state(false);
  let editingPlayer: Tables<'players'> | null = $state(null);

  const openEditModal = (player: Tables<'players'>) => {
    editingPlayer = player;
    showEditModal = true;
  };
</script>

<a href="/" class="secondary">← Retour</a>

<h1>Joueurs</h1>

<button onclick={() => (showAddModal = true)}>Ajouter un joueur</button>

<table role="grid">
	<thead>
		<tr>
			<th scope="col">Nom</th>
			<th scope="col">Téléphone</th>
			<th scope="col">Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each data.players as player}
			<tr>
				<td><strong>{player.name}</strong></td>
				<td>{player.tel}</td>
				<td>
					<div style="display: flex; gap: 0.5rem;">
						<button
							type="button"
							class="outline"
							onclick={() => openEditModal(player)}
						>
							Modifier
						</button>
						<form action="?/delete" method="POST" use:enhance>
							<input type="hidden" name="id" value={player.id} />
							<button type="submit" class="secondary outline">Supprimer</button>
						</form>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<Modal bind:showModal={showAddModal}>
	{#snippet header()}
		<h3>Nouveau joueur</h3>
	{/snippet}

	<form method="POST" action="?/create">
		<label for="name">
			Nom
			<input type="text" name="name" id="name" required />
		</label>

		<label for="tel">
			Téléphone
			<input type="tel" name="tel" id="tel" required />
		</label>

		<button type="submit">Ajouter</button>
	</form>
</Modal>

<Modal bind:showModal={showEditModal}>
	{#snippet header()}
		<h3>Modifier le joueur</h3>
	{/snippet}

	{#if editingPlayer}
		<form method="POST" action="?/update">
			<input type="hidden" name="id" value={editingPlayer.id} />

			<label for="edit-name">
				Nom
				<input type="text" name="name" id="edit-name" value={editingPlayer.name} required />
			</label>

			<label for="edit-tel">
				Téléphone
				<input type="tel" name="tel" id="edit-tel" value={editingPlayer.tel} required />
			</label>

			<button type="submit">Modifier</button>
		</form>
	{/if}
</Modal>
