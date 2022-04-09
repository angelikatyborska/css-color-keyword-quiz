<script lang="ts">
  export let colors;
  export let question;
  export let onGiveAnswer;
  export let suggestedAnswer;
  export let isLast;

  import { fade, fly } from 'svelte/transition';

  import { wasAnswerChecked, wasAnswerGiven } from "../app/question"
  $: wasNotSelected = wasAnswerGiven(question) && question.answer !== suggestedAnswer
  $: wasSelected = wasAnswerGiven(question) && question.answer === suggestedAnswer
  $: wasSelectedCorrectly = wasAnswerChecked(question) && question.colorKey === suggestedAnswer
  $: wasSelectedIncorrectly = wasAnswerChecked(question) && question.answer === suggestedAnswer && question.colorKey !== suggestedAnswer
  $: isCorrectAnswer = wasAnswerChecked(question) && question.colorKey === suggestedAnswer
</script>

<button
  type="button"
  disabled="{wasNotSelected}"
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

  $disabled-text-color: rgba($text-color, 0.5);

  .answer-button {
    @include button-base();
    position: relative;
    z-index: 1;
    //top: 0;
    //left: 0;
    //box-shadow: 3px 3px 3px 0 rgba($black, 0.3);

    //&:hover, &:active, &:global([data-focus-visible-added]), &.answer-button-selected {
    //  top: 2px;
    //  left: 2px;
    //  box-shadow: 3px 3px 1px 0 rgba($black, 0.3);
    //}

    &:focus {
      z-index: 2;
    }

    &:disabled {
      &:not(.answer-button-correct-answer) {
        .answer-button-text {
          color: $disabled-text-color;
        }
      }
    }

    &:not(.answer-button-last) {
      margin-bottom: $margin-small;
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
    padding: $margin-small;
    border-radius: $button-border-radius;
    transition: all $transition-duration ease;
    background-color: rgba($light-gray, 0);

    &:before {
      // checkered pattern
      content: '';
      position: absolute;
      z-index: -1;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: $button-border-radius;

      $pattern-size: $margin-small;
      background: $light-gray;
      background-image: repeating-linear-gradient(45deg, $light-gray 25%, transparent 25%, transparent 75%, $light-gray 75%, $light-gray), repeating-linear-gradient(45deg, $light-gray 25%, darken($light-gray, 10) 25%, darken($light-gray, 10) 75%, $light-gray 75%, $light-gray);
      background-position: 0 0, $pattern-size $pattern-size;
      background-size: 2 * $pattern-size 2 * $pattern-size;
    }
  }

  .answer-button-text {
    display: inline-block;
    color: $text-color;
    background-color: $button-inner-border-color;
    padding: $margin-micro $margin-tiny;
    transition: all $transition-duration ease;
  }

  .answer-button-selected {
    &:before {
      content: '->';
    }
  }

  .answer-button-correct-answer {
    .answer-button-inner {
      background-image: repeating-linear-gradient(45deg, transparent 0%, transparent 100%);
    }

    &:after {
      content: '<-';
    }
  }

  .answer-button-selected-incorrectly {
    .answer-button-inner {
      background-image: repeating-linear-gradient(45deg, transparent 0%, transparent 100%);
    }

    .answer-button-text {
      color: $disabled-text-color;
    }

    &:after {
      content: 'x';
    }
  }
</style>
