<script lang="ts">
  import type { Color } from "./color";
  import { calculateColorDiff } from "./color.ts";
  export let colors: Array<Color>;
</script>

<table>
  <thead>
    <tr>
      <th>x</th>
      {#each colors as color}
          <th style="padding: 10px; background-color: {color.hex};">{color.keyword}</th>
      {/each}
    </tr>
  </thead>
  <tbody>

  {#each colors as color1}
    <tr>
      <th style="padding: 10px; background-color: {color1.hex};">{color1.keyword}</th>
      {#each colors as color2}
        <td style="padding: 10px; background: linear-gradient(90deg, {color1.hex} 0%, {color2.hex} 100%);">
          {color1.keyword}<br>{color2.keyword}<br>{calculateColorDiff(color1.rgb, color2.rgb)}
        </td>
      {/each}
    </tr>
  {/each}
  </tbody>
</table>
