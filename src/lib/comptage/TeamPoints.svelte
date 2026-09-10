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
