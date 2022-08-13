<script lang="ts">
</script>

<div class="settings">
  <div>
    <label>
      <input type="checkbox" value="true"> Auto-progress to the next question
    </label>
  </div>
  <div>
    <label>
      Timeout: <input type="number" value="2000" min="500" max="30000" step="500"> ms.
    </label>
  </div>
</div>

<style lang="scss">
  @import "shared.scss";

  .settings {
    text-align: left;
  }
</style>
