<script lang="ts">
  export let onRestart;
</script>

<div class="game-over">
  <h2>Game Over</h2>
  <p>Uh-oh, looks like you're out of lives</p>
  <div>
    <button type="button" on:click={onRestart}>Try again</button>
  </div>
</div>

<style lang="scss">
  @import "src/appUI/shared";

 .game-over {
   button {
     @include button();
     margin-bottom: $margin-medium;
   }
 }
</style>
