<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, children }: { title: string; children?: Snippet } = $props();
</script>

<header class="comptage-header">
	<span class="header-badge">MANCHE EN COURS</span>
	<h1 class="comptage-title">{title}</h1>
	<div class="header-extra">
		{@render children?.()}
	</div>
</header>

<style>
	.comptage-header {
		background: var(--b-ink);
		color: var(--b-bg);
		padding: 1.25rem 1.25rem 1rem;
		margin-bottom: 1rem;
		border: var(--b-border-thick);
		box-shadow: var(--b-shadow);
		position: relative;
	}
	.header-badge {
		background: var(--b-yellow);
		color: var(--b-ink);
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 1.5px;
		padding: 4px 10px;
		text-transform: uppercase;
	}
	.comptage-title {
		font-family: var(--font-display);
		font-size: 2.4rem;
		line-height: 1;
		margin: 8px 0 0;
		text-transform: uppercase;
		letter-spacing: -1px;
		color: var(--b-bg);
	}
	.header-extra {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
	}

	@media (max-width: 480px) {
		.comptage-title { font-size: 1.9rem; }
		.header-extra {
			position: static;
			margin-top: 12px;
		}
	}
</style>
