<script lang="ts">
	import pointsTaSa from '$lib/assets/points_ta_sa.webp';

	let opened = $state(false);
	let taWithBelote = $state(0);
	let taWithoutBelote = $state(0);
	let sa = $state(0);

	let dialogEl: HTMLDialogElement | null = $state(null);

	$effect(() => {
		if (!dialogEl) return;
		if (opened) {
			dialogEl.showModal();
		} else if (dialogEl.open) {
			dialogEl.close();
		}
	});
</script>

<button
	type="button"
	class="secondary outline points-info-btn"
	onclick={() => (opened = true)}
	aria-label="Tableau des points TA/SA"
>
	Points TA / SA
</button>

<dialog
	bind:this={dialogEl}
	onclose={() => (opened = false)}
	onclick={(e) => {
		if (e.target === dialogEl) opened = false;
	}}
>
	<article>
		<header>
			<button
				type="button"
				aria-label="Fermer"
				{...{ rel: 'prev' }}
				onclick={() => (opened = false)}
			></button>
			<h4>Points Tout Atout / Sans Atout</h4>
		</header>
		<img
			src={pointsTaSa}
			alt="Tableau des points TA et SA"
			style="width: 100%; height: auto; display: block;"
		/>
		<footer>
			<p class="text-center">Ou, entrer le score avec le comptage normal</p>
			<div class="ta-sa-grid">
				<div class="ta-sa-col">
					<span class="ta-sa-label">TA avec belote</span>
					<input type="number" bind:value={taWithBelote} placeholder="0" inputmode="numeric" />
					<span class="ta-sa-result"
						>{taWithBelote ? Math.round(taWithBelote * 0.65) : '—'}</span
					>
				</div>
				<div class="ta-sa-col">
					<span class="ta-sa-label">TA sans belote</span>
					<input type="number" bind:value={taWithoutBelote} placeholder="0" inputmode="numeric" />
					<span class="ta-sa-result"
						>{taWithoutBelote ? Math.round(taWithoutBelote * 0.63) : '—'}</span
					>
				</div>
				<div class="ta-sa-col">
					<span class="ta-sa-label">SA</span>
					<input type="number" bind:value={sa} placeholder="0" inputmode="numeric" />
					<span class="ta-sa-result">{sa ? Math.round(sa * 1.35) : '—'}</span>
				</div>
			</div>
		</footer>
	</article>
</dialog>

<style>
	.points-info-btn {
		padding: 0.3rem 0.7rem;
		font-size: 0.9em;
		font-weight: bold;
		margin: 0;
	}

	dialog article {
		margin: 0;
	}

	dialog h4 {
		margin: 0;
	}

	.ta-sa-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		margin: 0;
	}

	.ta-sa-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}

	.ta-sa-label {
		font-size: 0.75em;
		font-weight: 600;
		text-align: center;
		opacity: 0.75;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.ta-sa-col input {
		width: 100%;
		margin: 0;
		text-align: center;
		font-size: 1em;
		padding: 0.3rem 0.4rem;
	}

	.ta-sa-result {
		font-size: 1.3em;
		font-weight: bold;
	}
</style>
