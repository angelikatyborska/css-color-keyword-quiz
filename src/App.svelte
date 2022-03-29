<script lang="ts">
  import 'focus-visible';
  import GearIcon from '@fortawesome/fontawesome-free/svgs/solid/gear.svg';
  import ChartIcon from '@fortawesome/fontawesome-free/svgs/solid/chart-simple.svg';
  import QuestionIcon from '@fortawesome/fontawesome-free/svgs/solid/circle-question.svg';
  import DebugTableSimilar from "./appUI/DebugTableDiff.svelte";
  import Question from "./appUI/Question.svelte";
  import { loadColors } from "./app/data/tranform.ts";
  import rawJSONData from "./app/data/source.json";
  import {newGame, startGame, getNextQuestion, giveAnswerToQuestion, checkAnswerToQuestion, hasWon, hasLost} from "./app/game";
  import {calculateDiffMatrix} from "./app/color";
  import {QuestionDifficulty} from "./app/question";
  import GameProgressBar from "./appUI/ProgressBar.svelte";

  const colors = loadColors(rawJSONData);
  const diffMatrix = calculateDiffMatrix(colors)

  const REVEAL_ANSWER_TIMEOUT = 1000;
  const NEW_QUESTION_TIMEOUT = 2000;

  let game = newGame(colors, diffMatrix, QuestionDifficulty.MEDIUM)
  game = startGame(game)
  game = getNextQuestion(game)

  const onGiveAnswer = (userInput) => {
    game = giveAnswerToQuestion(game, userInput)
    setTimeout(() => {
      game = checkAnswerToQuestion(game)

      setTimeout(() => {
        game = getNextQuestion(game)
      }, NEW_QUESTION_TIMEOUT)
    }, REVEAL_ANSWER_TIMEOUT)
  }
</script>

<div class="wrapper">
  <header>
    <div></div>
    <h1>CSS Color Quiz</h1>
    <nav>
      <QuestionIcon width="30px"/>
      <ChartIcon width="30px"/>
      <GearIcon width="30px"/>️
    </nav>
  </header>

  <main>
    {#if game.currentQuestion}
      <Question question={game.currentQuestion} colors={colors} onGiveAnswer={onGiveAnswer} />
    {/if}

    {#if hasWon(game)}
      <div>What an absolute legend! You made it until the end.</div>
    {/if}

    {#if hasLost(game)}
      <div>uh-oh, looks like you're out of lives</div>
    {/if}

    <div class="game-progress-bar">
      <GameProgressBar game={game} />
    </div>
  </main>

  <footer>
    <p>
      Created by <a href="https://angelika.me/">Angelika Tyborska</a>.
      <a href="https://ko-fi.com/angelikatyborska">Buy me a coffee ☕️</a>.
    </p>
  </footer>
</div>

<style lang="scss">
  @import "./appUI/shared";

  :global(html), :global(body) {
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 18px;
    background: $light-gray;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0 $margin-medium;
  }

  :global(*), :global(*:before), :global(*:after) {
    box-sizing: border-box;
  }

  :global(*):focus {
    outline: 3px solid $accent;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    text-align: center;
    height: 100%;
  }

  header {
    flex: 0 0 auto;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }

  nav {
    justify-self: end;
  }

  main {
    flex: 1 1 auto;
  }

  footer {
    flex: 0 0 auto;
    font-size: 0.8em;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  .game-progress-bar {
    margin-top: $margin-medium;
  }
</style>
