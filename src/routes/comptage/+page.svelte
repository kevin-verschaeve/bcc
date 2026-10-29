<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import type { ComptageMatch } from '$lib/comptage/comptage.svelte.js';
	import ComptageSetup from './ComptageSetup.svelte';
	import FreeComptage from './FreeComptage.svelte';
	import { loadFreeMatch, saveFreeMatch } from './freeMatch';

	let { data }: PageProps = $props();

	// The teams live in localStorage, which only exists in the browser: the
	// screen is therefore picked after mount so SSR and hydration agree.
	let ready = $state(false);
	let match = $state<ComptageMatch | null>(null);

	// `?joueurs` forces the setup screen back up, which keeps the link out of a
	// game a plain navigation — the browser back button then does what it should.
	const editingPlayers = $derived(page.url.searchParams.has('joueurs'));
	const showSetup = $derived(!match || editingPlayers);

	onMount(() => {
		match = loadFreeMatch();
		ready = true;
	});

	function start(next: ComptageMatch) {
		saveFreeMatch(next);
		match = next;
		if (editingPlayers) {
			goto('/comptage');
		}
	}
</script>

{#if ready}
	{#if showSetup}
		<ComptageSetup
			players={data.players}
			{match}
			canResume={match !== null}
			onstart={start}
			onresume={() => goto('/comptage')}
		/>
	{:else}
		<FreeComptage match={match!} />
	{/if}
{/if}
