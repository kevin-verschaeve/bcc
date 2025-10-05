<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<a href="/tournois/{data.tournament.year}/equipes">
  Équipes du tournois
</a>

{#if data.tournament.status === 'not_started'}
  <form method="POST" action="?/startTournament">
    <input type="hidden" name="tournament" value="{data.tournament.id}">
    <button type="submit">
      Démarrer
    </button>
  </form>
{/if}

<div class="grid">
{#each Object.entries(data.days) as [number, day]}
  <article>
    <a href="/tournois/{data.tournament.year}/jour/{number}">
      Jour {number}
    </a>
  </article>
{/each}
</div>
