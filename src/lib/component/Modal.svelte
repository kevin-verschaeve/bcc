<script>
	let { showModal = $bindable(), header, children } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
	});
</script>

<dialog bind:this={dialog} onclose={() => (showModal = false)}>
	<article>
		<header>
			<button
				aria-label="Close"
				class="close"
				onclick={() => dialog.close()}
				style="float: right; margin: 0;"
			></button>
			{@render header?.()}
		</header>
		{@render children?.()}
	</article>
</dialog>
