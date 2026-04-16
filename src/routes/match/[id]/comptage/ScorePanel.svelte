<script lang="ts">
	import type { ComptageGame } from './comptage.svelte.js';
	import ScanPanel from './ScanPanel.svelte';

	let { game }: { game: ComptageGame } = $props();
</script>

<article>
	<div class="scores-row">
		<button
			type="button"
			class="team-score-item team1-color"
			class:selected={game.selectedTeam === 'team1'}
			onclick={() => game.selectTeam('team1')}
		>
			<div class="team-name-short">
				{game.match.team1.name}
				{#if game.teamBelote === 'team1'}
					<span class="belote-badge team1">&#8383;</span>
				{/if}
			</div>
			<div class="team-total-sticky">{game.team1Total}</div>
		</button>
		<div class="vs">-</div>
		<button
			type="button"
			class="team-score-item team2-color"
			class:selected={game.selectedTeam === 'team2'}
			onclick={() => game.selectTeam('team2')}
		>
			<div class="team-name-short">
				{game.match.team2.name}
				{#if game.teamBelote === 'team2'}
					<span class="belote-badge team2">&#8383;</span>
				{/if}
			</div>
			<div class="team-total-sticky">{game.team2Total}</div>
		</button>
	</div>

	{#if !game.hasWinner}
		<div class="mt-sm flex-between gap">
			<button type="button" onclick={() => game.setBelote('team1')} class="outline"
				>&larr; Belote</button
			>
			<button type="button" onclick={() => game.setDedans()} class="flex-full secondary"
				>Dedans</button
			>
			<button type="button" onclick={() => game.setBelote('team2')} class="outline"
				>Belote &rarr;</button
			>
		</div>
		<div class="point-input-section">
			<button
				type="button"
				class="scan-btn secondary outline"
				class:active={game.scanOpen}
				onclick={() => game.toggleScan()}
				aria-label="Scanner les plis"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
					/>
					<circle cx="12" cy="13" r="4" />
				</svg>
			</button>
			<input
				type="number"
				bind:value={game.pointInput}
				onkeydown={(e) => game.handlePointInputKeydown(e)}
				placeholder={game.selectedTeam ? 'Points...' : 'Sélectionner équipe'}
				disabled={!game.selectedTeam}
				min="1"
				inputmode="numeric"
			/>
			<button
				type="button"
				onclick={() => game.addPoints()}
				disabled={!game.selectedTeam || !game.pointInput}>+</button
			>
		</div>

		<ScanPanel {game} />
	{/if}
</article>

<style>
	.scores-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.team-score-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		flex: 1;
		gap: 0.25rem;
		background: var(--pico-card-background-color);
		border: 2px solid var(--pico-muted-border-color);
		border-radius: 8px;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		margin: 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.team-score-item:hover {
		border-color: var(--pico-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.team-score-item.selected {
		border-width: 3px;
		border-color: var(--pico-primary);
		background: var(--pico-card-background-color);
		box-shadow:
			0 0 0 3px var(--pico-primary-background),
			0 4px 12px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	.team-name-short {
		font-size: 0.85em;
		font-weight: 600;
		text-align: center;
		line-height: 1.2;
	}

	.team-total-sticky {
		font-size: 2em;
		font-weight: bold;
		line-height: 1;
	}

	.vs {
		font-size: 1.5em;
		font-weight: bold;
		opacity: 0.5;
		padding: 0 0.25rem;
	}

	.belote-badge {
		position: absolute;
		top: 35%;
		right: 5%;
		color: white;
		padding: 5px 10px;
		font-weight: bold;
		border-radius: 30px;
	}

	.belote-badge.team1 {
		background-color: var(--color-team1);
	}

	.belote-badge.team2 {
		background-color: var(--color-team2);
	}

	.point-input-section {
		display: flex;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--pico-muted-border-color);
	}

	.point-input-section input {
		flex: 1;
		margin: 0;
		font-size: 1.2em;
		text-align: center;
	}

	.point-input-section input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.point-input-section button {
		margin: 0;
		padding: 0.5rem 1.5rem;
		font-size: 1.5em;
		font-weight: bold;
	}

	.scan-btn {
		margin: 0;
		padding: 0.5rem 0.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.scan-btn svg {
		width: 20px;
		height: 20px;
		display: block;
	}

	.scan-btn.active {
		background: var(--pico-primary);
		border-color: var(--pico-primary);
		color: var(--pico-primary-inverse);
	}

	.scan-btn.active svg {
		stroke: var(--pico-primary-inverse);
	}
</style>
