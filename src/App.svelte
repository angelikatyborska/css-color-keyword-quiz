<script lang="ts">
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

  let game = newGame(colors, diffMatrix, QuestionDifficulty.EASY)
  game = startGame(game)
  game = getNextQuestion(game)

  const onGiveAnswer = (userInput) => {
    game = giveAnswerToQuestion(game, userInput)
    setTimeout(() => {
      game = checkAnswerToQuestion(game)

      setTimeout(() => {
        game = getNextQuestion(game)
      }, 2000)
    }, 1000)
  }
</script>

<div class="wrapper">
  <header>
    <nav>❓</nav>
    <h1>CSS Color Quiz</h1>
    <nav>📊 ⚙️</nav>
  </header>

  <main>
    {#if game.currentQuestion}
      <Question question={game.currentQuestion} colors={colors} onGiveAnswer={onGiveAnswer} />
    {/if}

    {#if hasWon(game)}
      <div>woohoo</div>
    {/if}

    {#if hasLost(game)}
      <div>uh-oh, looks like you're out of lives</div>
    {/if}

    <GameProgressBar game={game} />
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
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0 $margin-medium;
  }

  :global(*), :global(*:before), :global(*:after) {
    box-sizing: border-box;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    text-align: center;
    height: 100%;
  }

  header {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
</style>
