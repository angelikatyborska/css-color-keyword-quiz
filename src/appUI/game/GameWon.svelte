<script lang="ts">
  import ShareResult from './ShareResult.svelte'

  export let onRestart;
  export let correctAnswerCount;
  export let totalQuestionCount;
  export let difficulty;
</script>

<div class="game-won">
  <h2>What an absolute legend!</h2>
  <p>You made it until the very end.</p>
  <ShareResult
    correctAnswerCount={correctAnswerCount}
    totalQuestionCount={totalQuestionCount}
    difficulty={difficulty}
  />
  <div class="try-again">
    <button type="button" on:click={onRestart}>Let's do this again!</button>
  </div>
</div>

<style lang="scss">
  @import "src/appUI/shared";

  .try-again {
    margin: $margin-big 0 $margin-medium 0;

    button {
      @include button();
    }
  }
</style>
