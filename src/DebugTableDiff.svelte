<script lang="ts">
  export let colors: Array<Color>;
  import type { Color } from "./color";
  import { calculateDiffMatrix, findTopSimilar } from "./data/tranform";
  const diffMatrix = calculateDiffMatrix(colors)
</script>

<table>
  <thead>
  <tr>
    <th>x</th>
    <th>most to least similar</th>
  </tr>
  </thead>
  <tbody>

  {#each colors as color1}
    <tr>
      <th style="padding: 10px; background-color: {color1.hex};">{color1.keyword}</th>
      <td style="white-space: nowrap; text-align: left;">
        {#each (findTopSimilar(colors, diffMatrix, color1, 25)) as color2}
            <span style="display: inline-block; font-size: 11px; overflow: hidden; width: 20px; height: 20px; background-color: {color2.hex}" title="{color2.keyword}">
              {diffMatrix[color1.keyword][color2.keyword]}
            </span>
        {/each}
      </td>
    </tr>
  {/each}
  </tbody>
</table>
