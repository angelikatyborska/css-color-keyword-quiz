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
  import DifficultyChooser from "./appUI/DifficultyChooser.svelte";

  const colors = loadColors(rawJSONData);
  const diffMatrix = calculateDiffMatrix(colors)

  const REVEAL_ANSWER_TIMEOUT = 1000;
  const NEW_QUESTION_TIMEOUT = 2000;

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
      <button type="button" class="icon-button">
        <QuestionIcon width="30px"/>
      </button>
      <button type="button" class="icon-button">
        <ChartIcon width="30px"/>
      </button>
      <button type="button" class="icon-button">
        <GearIcon width="30px"/>️
      </button>
    </nav>
  </header>

  <main>
    {#if game}
      {#if game.currentQuestion}
        <Question question={game.currentQuestion} colors={colors} onGiveAnswer={onGiveAnswer} />
      {/if}

      {#if hasWon(game)}
        <div>
          <h2>What an absolute legend!</h2>
          <p>You made it until the end.</p>
        </div>
      {/if}

      {#if hasLost(game)}
        <div>
          <h2>Game Over</h2>
          <p>Uh-oh, looks like you're out of lives</p>
          <div>
            <button type="button" on:click={onRestart}>Try again</button>
          </div>
        </div>
      {/if}

      <div class="game-progress-bar">
        <GameProgressBar game={game} />
      </div>
    {:else}
      <DifficultyChooser onChoose={onDifficultyChoose} />
    {/if}
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
    background-color: $white;
    color: $text-color;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0 $margin-medium;
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

  header {
    flex: 0 0 auto;
    display: grid;
    grid-template-columns: 0 auto auto;
    align-items: center;
    border-bottom: $button-outer-border-width solid $button-outer-border-color;

    h1 {
      margin: $margin-small 0;
      align-self: start;
      text-align: left;
    }

    @media(min-width: $tablet-breakpoint) {
      grid-template-columns: 1fr auto 1fr;

      h1 {
        align-self: center;
        text-align: center;
      }
    }
  }

  nav {
    justify-self: end;
    margin-left: $margin-small;
    margin-right: -1 * $icon-button-padding;
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

  .icon-button {
    @include button_reset();
    cursor: pointer;
    width: $icon-size-small + 2 * $icon-button-padding;
    height: $icon-size-small + 2 * $icon-button-padding;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all $transition-duration ease, outline 0ms ease;

    :global(svg) {
      height: $icon-size-small;
    }

    &:hover, &:active {
      background-color: lighten($light-gray, 15);
    }

    @media(min-width: $tablet-breakpoint) {
      width: $icon-size-big + 2 * $icon-button-padding;
      height: $icon-size-big + 2 * $icon-button-padding;

      :global(svg) {
        height: $icon-size-big;
      }
    }
  }

  .game-progress-bar {
    margin-top: $margin-big;
  }
</style>
