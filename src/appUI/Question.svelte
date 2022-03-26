<script lang="ts">
  export let colors;
  export let question;
  export let onGiveAnswer;
  import { wasAnswerChecked, wasAnswerGiven } from "../app/question"
</script>

<div class="question">
  <div class="question-color-container">
    <div class="question-color" style="background-color: {colors[question.colorKey].hex}"></div>
  </div>
  <ul class="answers">
    {#each question.suggestedAnswers as suggestedAnswer}
      <li class="answer">
        <button
          type="button"
          class="answer-button {wasAnswerGiven(question) && question.answer === suggestedAnswer ? 'answer-button-selected' : ''} { wasAnswerChecked(question) && question.colorKey === suggestedAnswer ? 'answer-button-selected-correctly' : ''} { wasAnswerChecked(question) && question.answer === suggestedAnswer && question.colorKey !== suggestedAnswer? 'answer-button-selected-incorrectly' : ''}"
          on:click={() => onGiveAnswer(suggestedAnswer)}
        >
          {suggestedAnswer}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .question-color-container {
    width: 170px;
    height: 70px;
    margin: 0 auto 20px;
    border: 1px solid black;
  }

  .question-color {
    width: 150px;
    height: 50px;
    border: 10px solid white;
  }

  .answers {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .answer-button {
    border: 3px solid transparent;
  }

  .answer-button-selected {
    border: 3px solid black;
  }

  .answer-button-selected-correctly {
    border: 3px solid green;
  }

  .answer-button-selected-incorrectly {
    border: 3px solid red;
  }
</style>
