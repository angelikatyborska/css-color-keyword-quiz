<script lang="ts">
  import { QuestionDifficulty } from '../app/question';
  export let onChoose;
</script>

<div>
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

</style>
