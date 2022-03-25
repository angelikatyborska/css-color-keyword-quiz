<script lang="ts">
  import DebugTableDiff from "./DebugTableDiff.svelte";
  import DebugTableSimilar from "./DebugTableSimilar.svelte";
  import loadData from "./loadData.ts";
  import { rawJSONData } from "./color.ts";
  const colors = loadData(rawJSONData);
  export let name: string;
</script>

<main>
  <p>Visit the <a data-testid="some-link" href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
  <DebugTableSimilar colors={colors} />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
