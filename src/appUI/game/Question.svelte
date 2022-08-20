<script lang="ts">
  import {onMount} from 'svelte';
  import {wasAnswerChecked, wasAnswerGiven, wasAnswerCorrect} from "../../app/question";
  import AnswerButton from "./AnswerButton.svelte"

  export let colors;
  export let question;
  export let onGiveAnswer;
  export let onGetNextQuestion;
  export let autoNewQuestion;
  export let autoNewQuestionTimeoutRef;

  let textAnswer = '';
  let textAnswerInput;

  $: canGiveAnswer = !wasAnswerGiven(question);
  $: canGetNextQuestion = wasAnswerChecked(question)
  $: onGiveTextAnswer = () => {
    onGiveAnswer(textAnswer)
  }
  $: wasTextAnswerCorrect = wasAnswerChecked(question) && wasAnswerCorrect(question)
  $: wasTextAnswerIncorrect = wasAnswerChecked(question) && !wasAnswerCorrect(question)
  $: autoNewQuestionTimeoutDidNotStart = wasAnswerChecked(question) && !autoNewQuestionTimeoutRef

  onMount(function() {
    if (textAnswerInput) {
      textAnswerInput.focus()
    }
  });

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
      <form
        on:submit|preventDefault={onGiveTextAnswer}
        class:text-answer-form={true}
        class:text-answer-form-correct={wasTextAnswerCorrect}
        class:text-answer-form-incorrect={wasTextAnswerIncorrect}
      >
        <input
          disabled="{!canGiveAnswer}"
          type="text"
          name="textAnswer"
          bind:value={textAnswer}
          bind:this={textAnswerInput}
          class:text-answer-input={true}
        />
      </form>
    {/if}
  </ul>
  {#if (!autoNewQuestion || (autoNewQuestion && autoNewQuestionTimeoutDidNotStart))}
    <button type="button"
            class="next-question-button"
            disabled={!canGetNextQuestion}
            on:click={onGetNextQuestion}
    >
      Next
    </button>
  {/if}
</div>

<style lang="scss">
  @import "src/appUI/shared";

  .question-color-container {
    width: $question-width;
    margin: 0 auto $margin-medium;
    border: $button-outer-border-width solid $button-outer-border-color;
    border-radius: $button-border-radius;
  }

  .question-color {
    width: $question-width - 2 * $button-outer-border-width;
    border: $button-inner-border-width solid $button-inner-border-color;
    padding: $margin-medium $margin-small;
    border-radius: $button-border-radius;
  }

  .question-color-text {
    display: inline-block;
    color: var(--text-color);
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

  $text-answer-feedback-icon-width: $margin-medium;

  .text-answer-input {
    @include button();
    cursor: text;
    position: relative;
    padding-left: 2 * $button-left-padding + $text-answer-feedback-icon-width;
    padding-right: 2 * $button-left-padding + $text-answer-feedback-icon-width;
  }

  .text-answer-form {
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      right: $button-left-padding;
      transform: translateY(-50%);
      width: $text-answer-feedback-icon-width;
      display: block;
      z-index: 1;
    }
  }

  .text-answer-form-correct {
    &:before {
      content: '✓';
      color: $green;
    }
  }

  .text-answer-form-incorrect {
    &:before {
      content: '✖';
      color: $red;
    }
  }

  .next-question-button {
    @include button();
    margin-top: $margin-medium;
  }
</style>
