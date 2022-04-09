<script lang="ts">
  export let onRestart;
</script>

<div class="game-won">
  <h2>What an absolute legend!</h2>
  <p>You made it until the end.</p>

  <div>
    <button type="button" on:click={onRestart}>Hit me </button>
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
