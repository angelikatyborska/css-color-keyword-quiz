<script lang="ts">
export let game;
import { range } from "../app/array"
import HeartIcon from '@fortawesome/fontawesome-free/svgs/solid/heart.svg'
</script>

<aside>
  <div>
    {#each range(1, game.livesTotal) as n}
      <span class:heart={true} class:heart-lost={n > game.livesLeft}>
        <HeartIcon width="20px" />
      </span>
    {/each}
  </div>
  <div>
    {game.totalQuestionCount - game.upcomingColorKeys.length} / {game.totalQuestionCount}
  </div>
</aside>

<style lang="scss">
  @import "./shared";

  .heart {
    :global(svg *) {
      fill: $accent;
      transition: all $transition-duration ease;
    }
  }

  .heart-lost {
    :global(svg *) {
      opacity: 0.3;
    }
  }
</style>
