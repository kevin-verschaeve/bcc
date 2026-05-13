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
	class="ta-sa-trigger"
	onclick={() => (opened = true)}
	aria-label="Tableau des points TA/SA"
>
	Points TA / SA →
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
			<h4>Points TA / SA</h4>
		</header>
		<img src={pointsTaSa} alt="Tableau des points TA et SA" class="ta-sa-img" />
		<footer>
			<p class="manual-divider">— OU SAISIR MANUELLEMENT —</p>
			<div class="ta-sa-grid">
				<div class="ta-sa-col">
					<span class="ta-sa-label">TA + BELOTE</span>
					<input type="number" bind:value={taWithBelote} placeholder="0" inputmode="numeric" />
					<span class="ta-sa-result">
						{taWithBelote ? Math.round(taWithBelote * 0.65) : '—'}
					</span>
				</div>
				<div class="ta-sa-col">
					<span class="ta-sa-label">TA SANS BELOTE</span>
					<input type="number" bind:value={taWithoutBelote} placeholder="0" inputmode="numeric" />
					<span class="ta-sa-result">
						{taWithoutBelote ? Math.round(taWithoutBelote * 0.63) : '—'}
					</span>
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
	.ta-sa-trigger {
		background: transparent !important;
		border: 2px solid var(--b-yellow) !important;
		color: var(--b-yellow) !important;
		font-family: var(--font-mono) !important;
		font-size: 0.72rem !important;
		font-weight: 700;
		letter-spacing: 1px;
		padding: 6px 10px !important;
		margin: 0 !important;
		box-shadow: none !important;
		text-transform: uppercase;
		cursor: pointer;
	}
	.ta-sa-trigger:hover {
		background: var(--b-yellow) !important;
		color: var(--b-ink) !important;
		transform: none !important;
		box-shadow: none !important;
	}

	dialog article {
		margin: 0;
		padding: 1.25rem;
		background: var(--b-bg);
		border: var(--b-border-thick);
		box-shadow: 8px 8px 0 var(--b-ink);
		border-radius: 0;
	}
	dialog h4 {
		font-family: var(--font-display);
		text-transform: uppercase;
		letter-spacing: -0.5px;
		margin: 0;
	}
	.ta-sa-img {
		width: 100%;
		height: auto;
		display: block;
		border: 2px solid var(--b-ink);
	}
	.manual-divider {
		text-align: center;
		margin: 0 0 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 1.5px;
		color: var(--b-ink-soft);
	}
	.ta-sa-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		margin: 0;
	}
	.ta-sa-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 8px;
		border: 2px solid var(--b-ink);
		background: var(--b-bg);
	}
	.ta-sa-label {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 1px;
		text-align: center;
		text-transform: uppercase;
		color: var(--b-ink);
	}
	.ta-sa-col input {
		width: 100%;
		margin: 0 !important;
		text-align: center;
		font-family: var(--font-display) !important;
		font-size: 1rem !important;
		padding: 6px !important;
		background: var(--b-bg) !important;
		border: 2px solid var(--b-ink) !important;
		box-shadow: none !important;
	}
	.ta-sa-col input:focus {
		background: var(--b-yellow) !important;
	}
	.ta-sa-result {
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: 1;
		color: var(--b-ink);
		letter-spacing: -1px;
	}

	@media (max-width: 480px) {
		.ta-sa-grid { grid-template-columns: 1fr; gap: 6px; }
		.ta-sa-col {
			flex-direction: row;
			justify-content: space-between;
			gap: 10px;
		}
		.ta-sa-col input { max-width: 80px; }
		.ta-sa-label { text-align: left; }
	}
</style>
