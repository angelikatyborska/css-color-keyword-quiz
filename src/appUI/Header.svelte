<script lang="ts">
  export let colors;
  export let autoNewQuestion;
  export let autoNewQuestionTimeout;
  export let onSetAutoNewQuestion;
  export let onSetAutoNewQuestionTimeout;

  import GearIcon from '@fortawesome/fontawesome-free/svgs/solid/gear.svg';
  // import ChartIcon from '@fortawesome/fontawesome-free/svgs/solid/chart-simple.svg';
  import QuestionIcon from '@fortawesome/fontawesome-free/svgs/solid/circle-question.svg';
  import IconButton from './IconButton.svelte';
  import Modal from './Modal.svelte';
  import Info from './Info.svelte';
  import Settings from './Settings.svelte';

  let infoButton;
  let settingsButton;
  let showInfoModal = false;
  let showSettingsModal = false;
  let openInfoModal = () => showInfoModal = true;
  let closeInfoModal = () => {
    showInfoModal = false;
    infoButton.focus();
  };
  let openSettingsModal = () => showSettingsModal = true;
  let closeSettingsModal = () => {
    showSettingsModal = false;
    settingsButton.focus();
  };
</script>

<div>
  {#if showSettingsModal}
    <Modal id='settings' title='Settings' onClose={closeSettingsModal}>
      <Settings
        autoNewQuestion={autoNewQuestion}
        autoNewQuestionTimeout={autoNewQuestionTimeout}
        onSetAutoNewQuestion={onSetAutoNewQuestion}
        onSetAutoNewQuestionTimeout={onSetAutoNewQuestionTimeout}
      />
    </Modal>
  {/if}

  {#if showInfoModal}
    <Modal id='info' title='About CSS Color Quiz' onClose={closeInfoModal}>
      <Info colors={colors} />
    </Modal>
  {/if}

  <header>
    <div></div>
    <h1>CSS Color Quiz</h1>
    <nav>
      <IconButton bind:button={infoButton} on:click={openInfoModal} icon={QuestionIcon} label="About this page" />
      <!-- <IconButton on:click={() => {}} icon={ChartIcon} label="Statistics"/> -->
      <IconButton bind:button={settingsButton} on:click={openSettingsModal} icon={GearIcon} label="Settings"/>
    </nav>
  </header>
</div>

<style lang="scss">
  @import "shared.scss";

  header {
    flex: 0 0 auto;
    display: grid;
    grid-template-columns: 0 auto auto;
    align-items: center;
    border-bottom: $button-outer-border-width solid $button-outer-border-color;

    h1 {
      margin: $margin-small 0;
      align-self: start;
      text-align: left;
    }

    @media(min-width: $tablet-breakpoint) {
      grid-template-columns: 1fr auto 1fr;

      h1 {
        align-self: center;
        text-align: center;
      }
    }
  }

  nav {
    justify-self: end;
    margin-left: $margin-small;
    margin-right: -1 * $icon-button-padding;
  }
</style>
