<script lang="ts">
	import { toast } from 'svelte-sonner';
	import PageHeader from '$lib/comptage/PageHeader.svelte';
	import type { ComptageMatch } from '$lib/comptage/comptage.svelte.js';

	let {
		players,
		match = null,
		canResume = false,
		onstart,
		onresume
	}: {
		/** Registered players, offered as suggestions only. */
		players: { name: string }[];
		/** Teams to prefill with, when coming back from a game in progress. */
		match?: ComptageMatch | null;
		canResume?: boolean;
		onstart: (match: ComptageMatch) => void;
		onresume?: () => void;
	} = $props();

	// A team name is optional: two players are enough to tell the sides apart.
	const autoTeamName = (player1: string, player2: string) => `${player1} & ${player2}`;
	const teamName = (raw: string, player1: string, player2: string) =>
		raw.trim() || autoTeamName(player1, player2);

	// Only bring back a name that was actually typed: an auto-generated one has
	// to stay empty, otherwise it would stick around after a player is renamed.
	const prefillTeamName = (team?: ComptageMatch['team1']) => {
		if (!team) return '';
		return team.name === autoTeamName(team.player1.name, team.player2.name) ? '' : team.name;
	};

	let team1Name = $state(prefillTeamName(match?.team1));
	let team1Player1 = $state(match?.team1.player1.name ?? '');
	let team1Player2 = $state(match?.team1.player2.name ?? '');
	let team2Name = $state(prefillTeamName(match?.team2));
	let team2Player1 = $state(match?.team2.player1.name ?? '');
	let team2Player2 = $state(match?.team2.player2.name ?? '');

	function start(event: SubmitEvent) {
		event.preventDefault();

		const names = [team1Player1, team1Player2, team2Player1, team2Player2].map((name) =>
			name.trim()
		);

		if (names.some((name) => name === '')) {
			toast.error('Renseigne les 4 joueurs !');
			return;
		}

		if (new Set(names.map((name) => name.toLowerCase())).size !== 4) {
			toast.error('Chaque joueur doit avoir un nom différent !');
			return;
		}

		const [t1p1, t1p2, t2p1, t2p2] = names;

		onstart({
			team1: {
				name: teamName(team1Name, t1p1, t1p2),
				player1: { name: t1p1 },
				player2: { name: t1p2 }
			},
			team2: {
				name: teamName(team2Name, t2p1, t2p2),
				player1: { name: t2p1 },
				player2: { name: t2p2 }
			}
		});
	}
</script>

<div class="top-bar">
	<a href="/tournois" class="secondary back-link">← Tournois</a>
	{#if canResume}
		<button type="button" class="reset-btn" onclick={() => onresume?.()}> ↩ REPRENDRE </button>
	{/if}
</div>

<PageHeader title="Comptage libre" badge="HORS TOURNOI" />

<form class="libre-panel" onsubmit={start}>
	<p class="libre-hint">
		Une partie ponctuelle, sans tournoi : indique qui joue et c'est parti. Les noms proposés sont
		ceux des joueurs enregistrés, mais tu peux saisir n'importe quel nom.
	</p>

	<div class="libre-teams">
		<fieldset class="libre-team">
			<legend class="libre-team-title team1-color">ÉQUIPE 1</legend>
			<label class="libre-field">
				<span class="libre-label">NOM D'ÉQUIPE <small>(optionnel)</small></span>
				<input type="text" bind:value={team1Name} placeholder="Équipe 1" autocomplete="off" />
			</label>
			<label class="libre-field">
				<span class="libre-label">JOUEUR 1</span>
				<input
					type="text"
					bind:value={team1Player1}
					list="comptage-players"
					placeholder="Nom du joueur"
					autocomplete="off"
				/>
			</label>
			<label class="libre-field">
				<span class="libre-label">JOUEUR 2</span>
				<input
					type="text"
					bind:value={team1Player2}
					list="comptage-players"
					placeholder="Nom du joueur"
					autocomplete="off"
				/>
			</label>
		</fieldset>

		<div class="libre-vs">VS</div>

		<fieldset class="libre-team">
			<legend class="libre-team-title team2-color">ÉQUIPE 2</legend>
			<label class="libre-field">
				<span class="libre-label">NOM D'ÉQUIPE <small>(optionnel)</small></span>
				<input type="text" bind:value={team2Name} placeholder="Équipe 2" autocomplete="off" />
			</label>
			<label class="libre-field">
				<span class="libre-label">JOUEUR 1</span>
				<input
					type="text"
					bind:value={team2Player1}
					list="comptage-players"
					placeholder="Nom du joueur"
					autocomplete="off"
				/>
			</label>
			<label class="libre-field">
				<span class="libre-label">JOUEUR 2</span>
				<input
					type="text"
					bind:value={team2Player2}
					list="comptage-players"
					placeholder="Nom du joueur"
					autocomplete="off"
				/>
			</label>
		</fieldset>
	</div>

	<datalist id="comptage-players">
		{#each players as player}
			<option value={player.name}></option>
		{/each}
	</datalist>

	<button type="submit" class="libre-submit">DÉMARRER LA PARTIE →</button>
</form>
