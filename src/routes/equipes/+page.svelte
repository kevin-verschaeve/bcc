<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/component/Modal.svelte';
	import Svelecte from 'svelecte';
  import type { PageProps } from './$types';
	import type { Tables } from '../../../database.types';

  let { data }: PageProps = $props();
  let players: Tables<'players'>[] = $state(data.players);

  let showModal: boolean = $state(false);

  const createPlayer = async ({ inputValue }: {inputValue: string}) => {
    const res = await fetch('/joueurs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: inputValue, tel: 1234}),
    });

    const newPlayer = await res.json();

    players = [...players, newPlayer];
  }
</script>

<h2>Équipes</h2>

<button onclick="{() => (showModal = true)}">Ajouter une équipe</button>

<table>
  <thead>
    <tr>
      <th scope="col">Nom</th>
      <th scope="col">Joueurs</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each data.teams as team}
      <tr>
        <td>{team.name}</td>
        <td>{team.player1.name} - {team.player2.name}</td>
        <td>
          <form action="?/delete" method="POST" use:enhance>
            <input type="hidden" name="team" value="{team.id}">
            <button type="submit">
              Supprimer
          </button>
          </form>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<Modal bind:showModal>
	{#snippet header()}
		<h3>
			Nouvelle équipe
		</h3>
	{/snippet}

  <form method="POST" action="?/create">
    <div>
      <input type="text" name="name" id="name" required />
      <label for="name">Nom</label>
  </div>

    <label for="player1">
      Joueur 1:
      <Svelecte
        name="player1"
        options={players}
        valueField='id'
        labelField='name'
        required={true}
        creatable={true}
        createHandler={createPlayer}
      />
    </label>

    <label for="player2">
      Joueur 2:
      <Svelecte
        name="player2"
        options={players}
        valueField='id'
        labelField='name'
        required={true}
        creatable={true}
        createHandler={createPlayer}
      />
    </label>

    <button type="submit">
      Ajouter
    </button>
  </form>
</Modal>
