<script lang="ts">
  export let onClose;
  export let title;
  export let id;
  import XIcon from '@fortawesome/fontawesome-free/svgs/solid/xmark.svg';
  import IconButton from './IconButton.svelte';
  import focusTrap from './focusTrap';

  $: titleId = `modal-title-${id}`
  import { fly } from 'svelte/transition';

</script>

<div class="modal"
     role="dialog"
     aria-labelledby={titleId}
     transition:fly="{{ y: 100, duration: 300 }}"
     use:focusTrap
>
  <div class="modal-inner">
    <div class="modal-header">
      <h2 class="title" id={titleId}>{title}</h2>
      <span class="close">
        <IconButton icon={XIcon}
                    on:click={onClose}
                    label={'Close'}
                    buttonProps={{ autofocus: true }}
        />
      </span>
    </div>
    <slot></slot>
  </div>
</div>

<style lang="scss">
  @import "shared.scss";

  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: $background-color;
    z-index: 10;
    padding: 0 $body-padding;
    overflow: auto;
  }

  .modal-inner {
    max-width: 600px; // TODO: figure out
    margin: 0 auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
  }

  .title {
    text-align: left;
  }

  .close {
    margin-top: $margin-small;
    margin-right: -1 * $icon-button-padding;
  }

</style>
