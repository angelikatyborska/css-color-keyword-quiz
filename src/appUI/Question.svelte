<script lang="ts">
  export let colors;
  export let question;
  export let onGiveAnswer;
  import { wasAnswerChecked, wasAnswerGiven } from "../app/question"
  import AnswerButton from "./AnswerButton.svelte"
</script>

<div class="question">
  <div class="question-color-container">
    <div class="question-color" style="background-color: {colors[question.colorKey].hex}">
      <h2 class="question-color-text">?</h2>
    </div>
  </div>
  <ul class="answers">
    {#if question.suggestedAnswers}
      {#each question.suggestedAnswers as suggestedAnswer, index (question.colorKey + suggestedAnswer)}
        <li class="answer">
          <AnswerButton
            colors={colors}
            question={question}
            onGiveAnswer={onGiveAnswer}
            suggestedAnswer={suggestedAnswer}
            isLast={index === question.suggestedAnswers.length - 1}
          />
        </li>
      {/each}
    {:else}
      <input type="text" />
    {/if}
  </ul>
</div>

<style lang="scss">
  @import "./shared";

  .question-color-container {
    width: $question-width;
    margin: 0 auto $margin-medium;
    border: $button-outer-border-width solid $button-outer-border-color;
    border-radius: $button-border-radius;
  }

  .question-color {
    width: $question-width - 2 * $button-outer-border-width;
    border: $button-inner-border-width solid $button-inner-border-color;
    padding: $margin-small;
    border-radius: $button-border-radius;
  }

  .question-color-text {
    display: inline-block;
    color: $text-color;
    background-color :$button-inner-border-color;
    padding: $margin-micro $margin-small;
    margin: 0;
    font-size: $font-medium;
    border-radius: $button-text-border-radius;
  }

  .answers {
    list-style-type: none;
    margin: 0 auto;
    padding: 0;
    width: $question-width;
  }

  input {
    @include button();
  }
</style>
