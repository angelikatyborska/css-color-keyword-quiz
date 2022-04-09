<script lang="ts">
  import { QuestionDifficulty } from '../app/question';
  export let onChoose;
</script>

<div class="difficulty-chooser">
  <h2>
    Choose difficulty
  </h2>

  <button type="button" on:click={() => onChoose(QuestionDifficulty.EASY)}>
    Easy
  </button>

  <button type="button" on:click={() => onChoose(QuestionDifficulty.MEDIUM)}>
    Hard
  </button>

  <button type="button" on:click={() => onChoose(QuestionDifficulty.HARD)}>
    Legendary
  </button>
</div>

<style lang="scss">
  @import "shared.scss";

 .difficulty-chooser {
   button {
     @include button();
     margin-bottom: $margin-medium;
   }
 }
</style>
