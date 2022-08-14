<script lang="ts">
  import { QuestionDifficulty, difficultyNames } from '../app/question';
  export let onChoose;
</script>

<div class="difficulty-chooser">
  <h2>
    Choose difficulty
  </h2>

  <button type="button" on:click={() => onChoose(QuestionDifficulty.EASY)}>
    {difficultyNames[QuestionDifficulty.EASY]}
  </button>

  <button type="button" on:click={() => onChoose(QuestionDifficulty.MEDIUM)}>
    {difficultyNames[QuestionDifficulty.MEDIUM]}
  </button>

  <button type="button" on:click={() => onChoose(QuestionDifficulty.HARD)}>
    {difficultyNames[QuestionDifficulty.HARD]}
  </button>
</div>

<style lang="scss">
  @import "shared.scss";

 .difficulty-chooser {
   button {
     @include button();
     margin-bottom: $margin-medium;
     text-transform: capitalize;
   }
 }
</style>
