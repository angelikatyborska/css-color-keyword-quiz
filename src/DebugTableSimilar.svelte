<script lang="ts">
  export let colors: Array<Color>;
  import type { Color } from "./color";
  import { calculateColorDiff } from "./color.ts";
  const level1 = 150;
  const level2 = 100;
  const similarityMatrix = colors.reduce((acc1, color1) => {
    return {
      ...acc1,
      [color1.keyword]: colors.reduce((acc2, color2) => {
        return {
          ...acc2,
          [color2.keyword]: calculateColorDiff(color1.rgb, color2.rgb)
        }
      }, {})
    }
  }, {})
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
      <td style="white-space: nowrap">
        {#each (colors.filter(color2 => similarityMatrix[color1.keyword][color2.keyword] !== 0).sort((a, b) => similarityMatrix[color1.keyword][a.keyword] >= similarityMatrix[color1.keyword][b.keyword])) as level1Color}
          <span style="display: inline-block; width: 20px; background-color: {level1Color.hex}" title="{level1Color.keyword}">.</span>
        {/each}
      </td>
    </tr>
  {/each}
  </tbody>
</table>
