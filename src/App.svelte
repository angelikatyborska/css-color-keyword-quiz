<script lang="ts">
  import DebugTableSimilar from "./DebugTableDiff.svelte";
  import { loadColors } from "./data/tranform.ts";
  import rawJSONData from "./data/source.json";
  const colors = loadColors(rawJSONData);
</script>

<main>
  <DebugTableSimilar colors={colors} />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>
