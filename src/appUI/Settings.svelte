<script lang="ts">
  import { colorSchemes } from '../app/settings';
  export let colorScheme;
  export let autoNewQuestion;
  export let autoNewQuestionTimeout;
  export let onSetColorScheme;
  export let onSetAutoNewQuestion;
  export let onSetAutoNewQuestionTimeout;

  const availableAutoNewQuestionTimeoutOptions = [1, 2, 3, 5]
  const integerAutoNewQuestionTimeout = Math.round(autoNewQuestionTimeout / 1000);

  $: onChangeColorScheme = (event) => {
    onSetColorScheme(event.target.value)
  }

  $: onChangeAutoNewQuestion = (event) => {
    onSetAutoNewQuestion(event.target.checked)
  }

  $: onChangeAutoNewQuestionTimeout = (event) => {
    const value = parseInt(event.target.value, 10)
    if (Number.isInteger(value)) {
      onSetAutoNewQuestionTimeout(Math.round(value * 1000))
    }
  }
</script>

<div class="settings">
  <div class="settings-group">
    <div class="row">
      <label for="color-scheme">
        Color scheme
      </label>
      <select
        id="color-scheme"
        name="color-scheme"
        on:change={onChangeColorScheme}
      >
        {#each colorSchemes as option (option)}
          <option selected={option === colorScheme} value={option}>{option.toLowerCase()}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="settings-group">
    <div class="row">
      <label for="auto-new-question">
        Auto-progress to the next question
      </label>
      <input
        type="checkbox"
        id="auto-new-question"
        name="auto-new-question"
        checked={autoNewQuestion}
        on:change={onChangeAutoNewQuestion}
      >
    </div>
    {#if autoNewQuestion}
      <div class="row">
        <label
          for="auto-new-question-timeout"
        >
          Auto-progress to the next question after
        </label>

        <select
          id="auto-new-question-timeout"
          name="auto-new-question-timeout"
          on:change={onChangeAutoNewQuestionTimeout}
          autocomplete="off"
        >
          {#each availableAutoNewQuestionTimeoutOptions as option (option)}
            <option selected={option === integerAutoNewQuestionTimeout} value={option}>{option}s</option>
          {/each}
        </select>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @import "shared.scss";

  .settings {
    text-align: left;
  }

  .settings-group {
    &:not(:last-of-type) {

    }
  }

  .row {
    margin-bottom: $margin-medium;
    display: flex;
    justify-content: space-between;
  }
</style>
