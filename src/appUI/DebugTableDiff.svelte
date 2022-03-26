<script lang="ts">
  export let colors: Record<string, Color>;
  import type { Color } from "../app/color";
  import { calculateDiffMatrix, findTopSimilar } from "../app/color";
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

  {#each Object.values(colors) as color1}
    <tr>
      <th style="padding: 10px; background-color: {color1.hex};">{color1.keyword}</th>
      <td style="white-space: nowrap; text-align: left;">
        {#each (findTopSimilar(Object.keys(colors), diffMatrix, color1.keyword, 50)) as color2Key}
          <span style="display: inline-block; font-size: 11px; overflow: hidden; width: 20px; height: 20px; background-color: {colors[color2Key].hex}" title="{colors[color2Key].keyword}">
            {diffMatrix[color1.keyword][colors[color2Key].keyword]}
          </span>
        {/each}
      </td>
    </tr>
  {/each}
  </tbody>
</table>
