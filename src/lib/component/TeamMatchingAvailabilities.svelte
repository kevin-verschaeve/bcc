<script>
	import { formatDate } from "$lib/utils";

    let { availabilities } = $props();
</script>

{#if availabilities.length}
    <span class="unstyled-tooltip-handler" data-tooltip="{availabilities.length === 1 ? 'Cette date semble' : 'Ces dates semblent'} convenir aux deux équipes">
        {#each availabilities as availability}
            <span class="badge">{formatDate(availability.date)} ?</span>
        {/each}
    </span>
{/if}
