<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, children }: { title: string; children?: Snippet } = $props();
</script>

<header class="comptage-header">
	<div class="header-top">
		<span class="header-badge">MANCHE EN COURS</span>
		<div class="header-extra">
			{@render children?.()}
		</div>
	</div>
	<h1 class="comptage-title">{title}</h1>
</header>
