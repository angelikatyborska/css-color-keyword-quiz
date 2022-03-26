<script lang="ts">
  import DebugTableSimilar from "./appUI/DebugTableDiff.svelte";
  import Question from "./appUI/Question.svelte";
  import { loadColors } from "./app/data/tranform.ts";
  import rawJSONData from "./app/data/source.json";
  import {newGame, startGame, getNextQuestion, giveAnswerToQuestion, checkAnswerToQuestion, hasWon, hasLost} from "./app/game";
  import {calculateDiffMatrix} from "./app/color";
  import {QuestionDifficulty} from "./app/question";
  import GameProgressBar from "./appUI/GameProgressBar.svelte";

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

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>
