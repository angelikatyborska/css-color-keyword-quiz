<script lang="ts">
  import 'focus-visible';
  import Header from "./appUI/Header.svelte";
  import Question from "./appUI/game/Question.svelte";
  import {loadColors} from "./app/data/tranform.ts";
  import rawJSONData from "./app/data/source.json";
  import {newGame, startGame, getNextQuestion, giveAnswerToQuestion, checkAnswerToQuestion, hasWon, hasLost} from "./app/game";
  import {calculateDiffMatrix} from "./app/color";
  import GameOver from "./appUI/game/GameOver.svelte";
  import GameWon from "./appUI/game/GameWon.svelte";
  import GameProgressBar from "./appUI/game/ProgressBar.svelte";
  import DifficultyChooser from "./appUI/DifficultyChooser.svelte";
  import {defaultSettings} from "./app/settings";

  const colors = loadColors(rawJSONData);
  const diffMatrix = calculateDiffMatrix(colors)

  const REVEAL_ANSWER_TIMEOUT = 1000;

  let settings = defaultSettings
  let game = null

  let onDifficultyChoose = (difficulty) => {
    game = newGame(colors, diffMatrix, difficulty)
    game = startGame(game)
    game = getNextQuestion(game)
  }

  let onRestart = () => { game = null }

  $: onGiveAnswer = (userInput) => {
    game = giveAnswerToQuestion(game, userInput)
    setTimeout(() => {
      game = checkAnswerToQuestion(game)

      if (settings.autoNewQuestion) {
        setTimeout(() => {
          game = getNextQuestion(game)
        }, settings.autoNewQuestionTimeout)
      }
    }, REVEAL_ANSWER_TIMEOUT)
  }

  $: onGetNextQuestion = () => {
    if (!settings.autoNewQuestion) {
      game = getNextQuestion(game)
    }
  }
</script>

<div class="wrapper">
  <Header />

  <main>
    {#if game}
      <div class="game-progress-bar">
        <GameProgressBar game={game} />
      </div>

      {#if game.currentQuestion}
        <Question question={game.currentQuestion}
                  colors={colors}
                  onGiveAnswer={onGiveAnswer}
                  autoNewQuestion={settings.autoNewQuestion}
                  onGetNextQuestion={onGetNextQuestion}
        />
      {/if}

      {#if hasWon(game)}
        <GameWon onRestart={onRestart} />
      {/if}

      {#if hasLost(game)}
        <GameOver onRestart={onRestart}
                  correctAnswerCount={game.correctAnswerCount}
                  totalQuestionCount={game.totalQuestionCount}
                  difficulty={game.difficulty}
        />
      {/if}
    {:else}
      <DifficultyChooser onChoose={onDifficultyChoose} />
    {/if}
  </main>

  <footer>
    <p>
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
    background-color: $background-color;
    color: $text-color;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0 $body-padding;
  }

  :global(h1), :global(h2) {
    font-family: 'DM Serif Display', serif;
  }

  :global(h1) {
    font-size: $font-medium;
    @media(min-width: $tablet-breakpoint) {
      font-size: $font-big;
    }
  }

  :global(h2) {
    font-size: $font-medium;

    @media(min-width: $tablet-breakpoint) {
      font-size: $font-medium;
    }
  }

  :global(*), :global(*:before), :global(*:after) {
    box-sizing: border-box;
  }

  :global(*):focus {
    outline: 2px solid $accent;
  }

  :global(a) {
    color: inherit;
    border-radius: $button-text-border-radius;

    &:visited {
      color: inherit;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    text-align: center;
    height: 100%;
  }

  main {
    flex: 1 1 auto;
  }

  footer {
    flex: 0 0 auto;
    font-size: $font-tiny;
  }

  main {
    text-align: center;
    margin: 1em;
    max-width: $min-width;
    align-self: center;
  }

  .game-progress-bar {
    margin-top: $margin-medium;
    margin-bottom: $margin-medium;
  }
</style>
