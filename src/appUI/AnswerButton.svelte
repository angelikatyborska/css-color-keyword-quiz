<script lang="ts">
  export let colors;
  export let question;
  export let onGiveAnswer;
  export let suggestedAnswer;
  export let isLast;
  import { wasAnswerChecked, wasAnswerGiven } from "../app/question"
  $: wasSelected = wasAnswerGiven(question) && question.answer === suggestedAnswer
  $: wasSelectedCorrectly = wasAnswerChecked(question) && question.colorKey === suggestedAnswer
  $: wasSelectedIncorrectly = wasAnswerChecked(question) && question.answer === suggestedAnswer && question.colorKey !== suggestedAnswer
  $: isCorrectAnswer = wasAnswerChecked(question) && question.colorKey === suggestedAnswer
</script>

<button
  type="button"
  class:answer-button="{true}"
  class:answer-button-last="{isLast}"
  class:answer-button-selected={wasSelected}
  class:answer-button-selected-correctly={wasSelectedCorrectly}
  class:answer-button-selected-incorrectly={wasSelectedIncorrectly}
  class:answer-button-correct-answer={isCorrectAnswer}
  on:click={() => onGiveAnswer(suggestedAnswer)}
>
  <span class="answer-button-inner"
        style={wasSelectedIncorrectly || isCorrectAnswer ? `background-color: ${colors[suggestedAnswer].hex}` : ""}
  >
    <span class="answer-button-text">
      {suggestedAnswer}
    </span>
  </span>
</button>


<style lang="scss">
  @import "./shared";

  .answer-button {
    @include button();
    position: relative;
    z-index: 1;

    &:focus {
      z-index: 2;
    }

    &:not(.answer-button-last) {
      margin-bottom: -1 * $button-outer-border-width;
    }

    &:before {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 100%;
    }

    &:after {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 100%;
    }
  }

  .answer-button-inner {
    display: block;
    width: $question-width - 2 * $button-outer-border-width;
    border: $button-inner-border-width solid $button-inner-border-color;
    padding: 10px;
    border-radius: $button-border-radius;

    // checkered pattern
    $pattern-size: $margin-small;
    background: $button-background-color;
    background-image:  repeating-linear-gradient(45deg, $button-background-color 25%, transparent 25%, transparent 75%, $button-background-color 75%, $button-background-color), repeating-linear-gradient(45deg, $button-background-color 25%, darken($button-background-color, 10) 25%, darken($button-background-color, 10) 75%, $button-background-color 75%, $button-background-color);
    background-position: 0 0, $pattern-size $pattern-size;
    background-size: 2 * $pattern-size 2 * $pattern-size;
  }

  .answer-button-text {
    display: inline-block;
    color: $text-color;
    background-color: $button-inner-border-color;
    padding: $margin-micro $margin-tiny;
  }

  .answer-button-selected {
    &:before {
      content: '->';
    }
  }

  .answer-button-correct-answer {
    .answer-button-inner {
      background-image: none;
    }

    &:after {
      content: '<-';
    }
  }

  .answer-button-selected-incorrectly {
    .answer-button-inner {
      background-image: none;
    }

    &:after {
      content: 'x';
    }
  }
</style>
