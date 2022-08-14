<script lang="ts">
  import Question from "./game/Question.svelte";
  import { QuestionDifficulty, QuestionState, difficultyNames } from '../app/question'

  const exampleColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
  const exampleColor = exampleColors[Math.floor(Math.random() * exampleColors.length)]

  const exampleQuestion = {
    difficulty: QuestionDifficulty.EASY,
    colorKey: exampleColor,
    suggestedAnswers: [],
    answer: null,
    state: QuestionState.PENDING_ANSWER,
  }

  export let colors;
</script>

<div class="info">
  <p>CSS Color Quiz is a quiz game about guessing color names based on the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color_keywords">CSS color keywords</a>.</p>
  <h3>How to play</h3>
  <p>The objective of the game is to guess the CSS color keyword of the currently shown color. For example, the correct answer to the question below is "{exampleQuestion.colorKey}".</p>

  <div class="example-question">
    <Question question={exampleQuestion}
              colors={colors}
              onGiveAnswer={() => {}}
              autoNewQuestion={true}
              onGetNextQuestion={() => {}}
    />
  </div>
  <p>There are three different difficulty levels:</p>
  <ul>
    <li><strong class="name">{difficultyNames[QuestionDifficulty.EASY]}</strong> - the suggested answers are chosen randomly from all colors after removing the ones most resembling the color in question.</li>
    <li><strong class="name">{difficultyNames[QuestionDifficulty.MEDIUM]}</strong> - the suggested answers are chosen from the colors most resembling the color in question.</li>
    <li><strong class="name">{difficultyNames[QuestionDifficulty.HARD]}</strong> - there are no suggested answers.</li>
  </ul>

  <p>When a color has more than one keyword (e.g. aqua vs cyan, gray vs grey), all options are always accepted as the right answer.</p>

  <h3>Author</h3>
  <p>
    Created by <span class="nb"><a href="https://angelika.me/">Angelika Tyborska</a>.</span> Source code available on <span class="nb"><a href="github.com/angelikatyborska/css-color-keyword-quiz">GitHub</a>.</span>
  </p>
  <p>
    Enjoying the quiz? <span class="nb"><a href="https://ko-fi.com/angelikatyborska">Buy me a coffee ☕️</a>.</span>
  </p>
</div>

<style lang="scss">
  @import "shared.scss";

  .info {
    text-align: left;
  }

  .example-question {
    text-align: center;
  }

  .nb {
    display: inline-block;
  }

  .name {
    text-transform: capitalize;
  }
</style>
