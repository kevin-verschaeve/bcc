<script lang="ts">
	import type { PageProps } from './$types';
	import type { Tables } from '../../../database.types';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	const showTournament = (tournament: Tables<'tournaments'>) => {
		goto(`/tournois/${tournament.year}`);
	};
</script>

<h1>Tournois</h1>

<table role="grid">
	<thead>
		<tr>
			<th scope="col">Saison</th>
			<th scope="col">Nom</th>
			<th scope="col">Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each data.tournaments as tournament}
			<tr>
				<td onclick={() => showTournament(tournament)} style="cursor: pointer;">
					{tournament.year}
				</td>
				<td onclick={() => showTournament(tournament)} style="cursor: pointer;">
					{tournament.name}
				</td>
				<td>
					<form action="?/delete">
						<button type="submit" class="secondary outline">Supprimer</button>
					</form>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
