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

<style>
	/* === BIG SCORES === */
	.big-scores {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 0.5rem;
		align-items: stretch;
		margin-bottom: 1rem;
	}
	.big-score-card {
		background: var(--b-bg) !important;
		border: var(--b-border-thick) !important;
		box-shadow: var(--b-shadow) !important;
		padding: 1rem 0.75rem 0.75rem !important;
		text-align: center;
		cursor: pointer;
		transition: transform 0.08s ease, box-shadow 0.08s ease;
		margin: 0 !important;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 130px;
		font-family: var(--font-body);
		font-weight: 500;
		text-transform: none;
		letter-spacing: normal;
	}
	.big-score-card:hover {
		transform: translate(-1px, -1px) !important;
		box-shadow: 5px 5px 0 var(--b-ink) !important;
	}
	.big-score-card.selected {
		background: var(--b-yellow) !important;
		transform: translate(-1px, -1px) !important;
		box-shadow: 5px 5px 0 var(--b-ink) !important;
	}
	.big-score-card.team1 {
		border-top: 8px solid var(--color-team1) !important;
	}
	.big-score-card.team2 {
		border-top: 8px solid var(--color-team2) !important;
	}
	.big-score-card.winning {
		background: var(--b-green) !important;
		color: var(--b-ink) !important;
	}

	.big-score-name {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		min-height: 1.2em;
	}
	.team-label-text {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 1px;
		text-transform: uppercase;
		line-height: 1.2;
		color: var(--b-ink);
	}
	.belote-pill {
		display: inline-block;
		background: var(--b-ink);
		color: var(--b-yellow);
		padding: 2px 6px;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 1px;
	}
	.big-score-value {
		font-family: var(--font-display);
		font-size: 4rem;
		line-height: 0.9;
		letter-spacing: -3px;
		color: var(--b-ink);
		margin: 6px 0 4px;
	}
	.big-score-meta {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 1px;
		opacity: 0.6;
		text-transform: uppercase;
		color: var(--b-ink);
	}
	.big-vs {
		font-family: var(--font-display);
		font-size: 1.4rem;
		align-self: center;
		color: var(--b-ink-soft);
		padding: 0 4px;
	}

	/* === ACTION ROW === */
	.action-row {
		display: grid;
		grid-template-columns: 1fr 1.2fr 1fr;
		gap: 6px;
		margin-bottom: 0.75rem;
	}
	.belote-btn,
	.dedans-btn {
		font-family: var(--font-mono) !important;
		font-size: 0.78rem !important;
		font-weight: 700;
		letter-spacing: 1.2px;
		padding: 14px 6px !important;
		background: var(--b-bg) !important;
		color: var(--b-ink) !important;
		border: var(--b-border-thick) !important;
		margin: 0 !important;
		box-shadow: var(--b-shadow) !important;
		cursor: pointer;
		min-height: 48px;
		text-transform: uppercase;
	}
	.belote-btn:hover,
	.dedans-btn:hover {
		transform: translate(-1px, -1px) !important;
		box-shadow: 5px 5px 0 var(--b-ink) !important;
	}
	.belote-btn.active {
		background: var(--b-yellow) !important;
		color: var(--b-ink) !important;
	}
	.dedans-btn {
		background: var(--b-red) !important;
		color: var(--b-bg) !important;
	}

	/* === INPUT BLOCK === */
	.input-block {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 6px;
		margin-bottom: 1rem;
	}
	.scan-btn {
		font-size: 1.4rem !important;
		padding: 0 14px !important;
		background: var(--b-bg) !important;
		color: var(--b-ink) !important;
		border: var(--b-border-thick) !important;
		margin: 0 !important;
		box-shadow: var(--b-shadow) !important;
		cursor: pointer;
		min-width: 56px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.scan-btn svg {
		width: 22px;
		height: 22px;
		display: block;
	}
	.scan-btn:hover {
		background: var(--b-yellow) !important;
		transform: translate(-1px, -1px) !important;
		box-shadow: 5px 5px 0 var(--b-ink) !important;
	}
	.scan-btn.active {
		background: var(--b-yellow) !important;
	}

	.big-input {
		font-family: var(--font-display) !important;
		font-size: 1.6rem !important;
		text-align: center;
		padding: 12px 8px !important;
		background: var(--b-bg) !important;
		color: var(--b-ink) !important;
		border: var(--b-border-thick) !important;
		margin: 0 !important;
		box-shadow: var(--b-shadow) !important;
		min-height: 56px;
		letter-spacing: -1px;
	}
	.big-input::placeholder {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 1.2px;
		color: var(--b-ink-soft);
	}
	.big-input:disabled {
		opacity: 0.4 !important;
		cursor: not-allowed;
	}
	.big-input:focus {
		background: var(--b-yellow) !important;
		outline: none !important;
		transform: none !important;
	}

	.add-btn {
		font-family: var(--font-display) !important;
		font-size: 2rem !important;
		line-height: 1;
		padding: 0 20px !important;
		background: var(--b-green) !important;
		color: var(--b-ink) !important;
		border: var(--b-border-thick) !important;
		margin: 0 !important;
		box-shadow: var(--b-shadow) !important;
		cursor: pointer;
		min-width: 64px;
	}
	.add-btn:hover {
		transform: translate(-1px, -1px) !important;
		box-shadow: 5px 5px 0 var(--b-ink) !important;
	}
	.add-btn:disabled {
		opacity: 0.4 !important;
		background: var(--b-bg) !important;
		cursor: not-allowed;
	}

	@media (max-width: 380px) {
		.big-score-value {
			font-size: 3rem;
		}
		.big-score-card {
			min-height: 110px;
			padding: 0.75rem 0.5rem !important;
		}
	}
</style>
