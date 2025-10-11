<script>
	import { formatDate } from '$lib/utils';

    let { availabilities } = $props();
</script>

{#if availabilities.length}
    <ul>
    {#each availabilities as availability}
        <li>
            {formatDate(availability.start)}
            -
            {formatDate(availability.end)}
        </li>
    {/each}
    </ul>
{:else}
    <p class="text-center">
        <small><i>L'équipe n'a pas encore renseignée ses disponibilités.</i></small>
    </p>
{/if}
