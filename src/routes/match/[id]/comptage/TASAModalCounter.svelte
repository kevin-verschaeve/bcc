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
