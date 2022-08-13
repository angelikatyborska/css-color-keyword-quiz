<script lang="ts">
  export let autoNewQuestion;
  export let autoNewQuestionTimeout;
  export let onSetAutoNewQuestion;
  export let onSetAutoNewQuestionTimeout;

  // TODO: better validations
</script>

<div class="settings">
  <div>
    <label>
      <input
        type="checkbox"
        name="auto-new-question"
        checked={autoNewQuestion}
        on:change={onSetAutoNewQuestion}
      > Auto-progress to the next question
    </label>
  </div>
  <div>
    <label>
      Timeout:
      <input
        type="number"
        name="auto-new-question-timeout"
        value={autoNewQuestionTimeout}
        on:change={onSetAutoNewQuestionTimeout}
        min="500"
        max="10000"
        step="500"
      > ms.
    </label>
  </div>
</div>

<style lang="scss">
  @import "shared.scss";

  .settings {
    text-align: left;
  }
</style>
