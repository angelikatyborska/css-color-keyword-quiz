<script lang="ts">
export let game;
import { range } from "../../app/array"
import HeartIcon from '@fortawesome/fontawesome-free/svgs/solid/heart.svg'
$: livesLabel = `${game.livesLeft} lives left`
</script>

<aside>
  <div title="">
    {game.totalQuestionCount - game.upcomingColorKeys.length} / {game.totalQuestionCount}
  </div>
  <div title="{livesLabel}" aria-label="{livesLabel}">
    {#each range(1, game.livesTotal) as n}
      <span class:heart={true} class:heart-lost={n > game.livesLeft}>
        <HeartIcon width="20px" />
      </span>
    {/each}
  </div>
</aside>

<style lang="scss">
  @import "src/appUI/shared";

  aside {
    display: flex;
    justify-content: space-between;
    font-size: $font-tiny;
  }

  .heart {
    :global(svg *) {
      fill: $red;
      transition: all $transition-duration ease;
    }
  }

  .heart-lost {
    :global(svg *) {
      opacity: 0.4;
    }
  }
</style>
