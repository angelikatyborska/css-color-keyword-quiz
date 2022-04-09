<script lang="ts">
  export let icon;
  export let label;
  export let buttonProps = {};
  export let button = null;
</script>

<button type="button"
        class="icon-button"
        on:click aria-label={label}
        title={label}
        {...buttonProps}
        bind:this={button}
>
  <svelte:component this={icon} width="30px" aria-hidden="true"/>
</button>

<style lang="scss">
  @import "shared.scss";

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

</style>
