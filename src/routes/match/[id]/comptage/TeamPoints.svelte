<script lang="ts">
	type Props = {
		team: {
			name: string;
			player1: { name: string };
			player2: { name: string };
		};
		points: number[];
		taker: string | null;
		colorClass: string;
		onAddPoint: (value: number) => void;
		onRemovePoint: (index: number) => void;
		onSelectTaker: (name: string) => void;
		hasWinner: boolean;
	};

	let {
		team,
		points,
		taker,
		colorClass,
		onAddPoint,
		onRemovePoint,
		onSelectTaker,
		hasWinner,
	}: Props = $props();

	let newPoint = $state('');

	const total = $derived(points.reduce((sum, p) => sum + p, 0));

	function addPoint() {
		const value = parseInt(newPoint);
		if (!isNaN(value) && value > 0) {
			onAddPoint(value);
			newPoint = '';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addPoint();
		}
	}
</script>

<article class="team-card">
	<header>
		<div class="team-header-row">
			<h3 class="{colorClass} m-0">{team.name}</h3>
			<strong class="team-total">{total}</strong>
		</div>
		<p class="team-players">
			<button
				type="button"
				class="player-btn"
				class:selected={taker === team.player1.name}
				onclick={() => onSelectTaker(team.player1.name)}
			>{team.player1.name}</button>
			<button
				type="button"
				class="player-btn"
				class:selected={taker === team.player2.name}
				onclick={() => onSelectTaker(team.player2.name)}
			>{team.player2.name}</button>
		</p>
	</header>

	<div class="points-list">
		{#each points as point, index}
			<div class="point-item">
				<span>{point}</span>
				<button
					type="button"
					class="secondary outline point-remove"
					onclick={() => onRemovePoint(index)}
					aria-label="Supprimer"
				>x</button>
			</div>
		{/each}
	</div>

	{#if hasWinner === false}
	<div class="point-input-row">
		<input
			type="number"
			bind:value={newPoint}
			onkeydown={handleKeydown}
			placeholder="Points"
			min="1"
		/>
		<button type="button" onclick={addPoint}>+</button>
	</div>
	{/if}
</article>

<style>
	.team-card {
		margin: 0;
	}

	.team-header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.team-total {
		font-size: 1.5em;
	}

	.team-card header {
		padding-bottom: 0.5rem;
	}

	.team-players {
		margin: 0.5rem 0 0 0;
		font-size: 0.9em;
	}

	.player-btn {
		background: transparent;
		border: 1.5px solid var(--pico-contrast);
		padding: 0.3rem 0.6rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: inherit;
		color: var(--pico-contrast);
		margin: 0;
		transition: all 0.15s ease;
	}

	.player-btn:hover {
		border-color: var(--pico-primary);
		color: var(--pico-primary);
	}

	.player-btn.selected {
		background: var(--pico-primary);
		border-color: var(--pico-primary);
		color: var(--pico-primary-inverse);
	}

	.points-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-height: 100px;
		margin-bottom: 1rem;
	}

	.point-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		background: var(--pico-card-background-color);
		border-radius: 4px;
	}

	.point-remove {
		padding: 0.25rem 0.5rem;
		margin: 0;
		font-size: 0.8em;
	}

	.point-input-row {
		display: flex;
		gap: 0.5rem;
	}

	.point-input-row input {
		flex: 1;
		margin: 0;
	}

	.point-input-row button {
		margin: 0;
		padding: 0.5rem 1rem;
	}
</style>
