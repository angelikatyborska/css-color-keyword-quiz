<script lang="ts">
  import ShareResult from './ShareResult.svelte'

  export let onRestart;
  export let correctAnswerCount;
  export let totalQuestionCount;
  export let difficulty;
</script>

<div class="game-over">
  <h2>Game Over</h2>
  <p>Uh-oh, looks like you're out of lives.</p>
  <ShareResult
    correctAnswerCount={correctAnswerCount}
    totalQuestionCount={totalQuestionCount}
    difficulty={difficulty}
  />
  <div class="try-again">
    <button type="button" on:click={onRestart}>Try again</button>
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
