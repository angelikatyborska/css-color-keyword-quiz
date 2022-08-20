<script lang="ts">
  import { fly } from 'svelte/transition';
  import { wasAnswerChecked, wasAnswerGiven } from "../../app/question"
  import RightIcon from '@fortawesome/fontawesome-free/svgs/solid/arrow-right.svg';
  import LeftIcon from '@fortawesome/fontawesome-free/svgs/solid/arrow-left.svg';

  export let colors;
  export let question;
  export let onGiveAnswer;
  export let suggestedAnswer;
  export let isLast;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let flyAnimationDuration;
  const setFlyAnimationDuration = () => flyAnimationDuration = mediaQuery.matches ? 0 : 300

  setFlyAnimationDuration()

  mediaQuery.addEventListener('change', () => {
    setFlyAnimationDuration()
  });

  $: canGiveAnswer = !wasAnswerGiven(question);
  $: wasSelected = wasAnswerGiven(question) && question.answer === suggestedAnswer
  $: wasSelectedCorrectly = wasAnswerChecked(question) && question.answer == suggestedAnswer && question.colorKey === suggestedAnswer
  $: wasSelectedIncorrectly = wasAnswerChecked(question) && question.answer === suggestedAnswer && question.colorKey !== suggestedAnswer
  $: isCorrectAnswer = wasAnswerChecked(question) && question.colorKey === suggestedAnswer
</script>

<button
  type="button"
  disabled="{!canGiveAnswer}"
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

  {#if wasSelected}
    <span in:fly={{ x: -20, duration: flyAnimationDuration }} class="selected-answer-icon">
      <RightIcon width="20px" aria-label="Selected answer" title="Selected answer"/>
    </span>
  {/if}

  {#if isCorrectAnswer}
    <span in:fly={{ x: 20, duration: flyAnimationDuration }} class="correct-answer-icon">
      <LeftIcon width="20px" aria-label="Correct answer" title="Correct answer"/>
    </span>
  {/if}
</button>


<style lang="scss">
  @import "src/appUI/shared";

  .answer-button {
    @include button-base();
    position: relative;
    z-index: 1;

    &:focus {
      z-index: 2;
    }

    &:disabled {
      .answer-button-selected {
        .answer-button-text {
          color: var(--text-color);
        }
      }

      .answer-button-selected-incorrectly {
        .answer-button-text {
          color: var(--text-color-disabled);
        }
      }
    }

    &:not(.answer-button-last) {
      margin-bottom: $margin-small;
    }
  }

  .answer-button-inner {
    display: block;
    width: $question-width - 2 * $button-outer-border-width;
    border: $button-inner-border-width solid $button-inner-border-color;
    padding: $margin-small;
    border-radius: $button-border-radius;
    transition: all $transition-duration ease;
    background-color: rgba(var(--background-color3), 0);

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
      background: var(--background-color3);
      background-image: repeating-linear-gradient(45deg, var(--background-color3) 25%, transparent 25%, transparent 75%, var(--background-color3) 75%, var(--background-color3)), repeating-linear-gradient(45deg, var(--background-color3) 25%, var(--background-color4) 25%, var(--background-color4) 75%, var(--background-color3) 75%, var(--background-color3));
      background-position: 0 0, $pattern-size $pattern-size;
      background-size: 2 * $pattern-size 2 * $pattern-size;
    }
  }

  .answer-button-text {
    display: inline-block;
    color: var(--text-color);
    background-color: $button-inner-border-color;
    padding: $margin-micro $margin-tiny;
    transition: all $transition-duration ease;
    border-radius: $button-text-border-radius;

    button:not(:disabled):hover &,
    button:not(:disabled):active & {
      background-color: $button-background-color-hover;
    }
  }

  .answer-button-correct-answer {
    .answer-button-inner {
      background-image: repeating-linear-gradient(45deg, transparent 0%, transparent 100%);
    }
  }

  .answer-button-selected-incorrectly {
    .answer-button-inner {
      background-image: repeating-linear-gradient(45deg, transparent 0%, transparent 100%);
    }

    .answer-button-text {
      color: var(--text-color-disabled);
    }
  }

  .selected-answer-icon, .correct-answer-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    :global(svg *) {
      fill: var(--text-color)
    }
  }

  .selected-answer-icon {
    right: 100%;
    margin-right: $margin-tiny;
  }

  .correct-answer-icon {
    left: 100%;
    margin-left: $margin-tiny;
  }
</style>
