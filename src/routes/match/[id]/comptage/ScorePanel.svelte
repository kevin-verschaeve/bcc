<script lang="ts">
	import type { ComptageGame } from './comptage.svelte.js';
	import { WINNING_SCORE } from '$lib/scoreUtils';
	import ScanPanel from './ScanPanel.svelte';

	let { game }: { game: ComptageGame } = $props();
</script>

<!-- BIG SCORES -->
<div class="big-scores">
	<button
		type="button"
		class="big-score-card team1"
		class:selected={game.selectedTeam === 'team1'}
		class:winning={game.team1Total >= WINNING_SCORE}
		onclick={() => game.selectTeam('team1')}
	>
		<div class="big-score-name">
			<span class="team-label-text">{game.match.team1.name}</span>
			{#if game.teamBelote === 'team1'}
				<span class="belote-pill">₿ BELOTE</span>
			{/if}
		</div>
		<div class="big-score-value">{game.team1Total}</div>
		<div class="big-score-meta">/ {WINNING_SCORE} · {game.team1Points.length} manche{game.team1Points.length > 1 ? 's' : ''}</div>
	</button>

	<div class="big-vs">VS</div>

	<button
		type="button"
		class="big-score-card team2"
		class:selected={game.selectedTeam === 'team2'}
		class:winning={game.team2Total >= WINNING_SCORE}
		onclick={() => game.selectTeam('team2')}
	>
		<div class="big-score-name">
			<span class="team-label-text">{game.match.team2.name}</span>
			{#if game.teamBelote === 'team2'}
				<span class="belote-pill">₿ BELOTE</span>
			{/if}
		</div>
		<div class="big-score-value">{game.team2Total}</div>
		<div class="big-score-meta">/ {WINNING_SCORE} · {game.team2Points.length} manche{game.team2Points.length > 1 ? 's' : ''}</div>
	</button>
</div>

{#if !game.hasWinner}
	<!-- ACTION ROW (BELOTE / DEDANS) -->
	<div class="action-row">
		<button
			type="button"
			class="belote-btn"
			class:active={game.teamBelote === 'team1'}
			onclick={() => game.setBelote('team1')}
		>← BELOTE</button>
		<button
			type="button"
			class="dedans-btn"
			onclick={() => game.setDedans()}
		>DEDANS</button>
		<button
			type="button"
			class="belote-btn"
			class:active={game.teamBelote === 'team2'}
			onclick={() => game.setBelote('team2')}
		>BELOTE →</button>
	</div>

	<!-- INPUT BLOCK -->
	<div class="input-block">
		<button
			type="button"
			class="scan-btn"
			class:active={game.scanOpen}
			onclick={() => game.toggleScan()}
			aria-label="Scanner les plis"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
				<circle cx="12" cy="13" r="4"/>
			</svg>
		</button>
		<input
			type="number"
			bind:value={game.pointInput}
			onkeydown={(e) => game.handlePointInputKeydown(e)}
			placeholder={game.selectedTeam ? 'POINTS RÉALISÉS' : '← SÉLECTIONNER ÉQUIPE'}
			disabled={!game.selectedTeam}
			min="1"
			inputmode="numeric"
			class="big-input"
		/>
		<button
			type="button"
			class="add-btn"
			onclick={() => game.addPoints()}
			disabled={!game.selectedTeam || !game.pointInput}
		>+</button>
	</div>

	<ScanPanel {game} />
{/if}
