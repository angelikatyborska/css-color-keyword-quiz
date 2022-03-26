<script lang="ts">
export let game;
import { range } from "../app/array"
</script>

<aside>
  <div>
    {#each range(1, game.livesTotal) as n}
      {#if n <= game.livesLeft}
        💜
      {:else}
        🤍
      {/if}
    {/each}
  </div>
  <div>
    {game.totalQuestionCount - game.upcomingColorKeys.length} / {game.totalQuestionCount}
  </div>
</aside>

<style>

</style>
