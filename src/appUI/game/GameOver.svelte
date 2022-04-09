<script lang="ts">
  import { QuestionDifficulty } from '../../app/question'
  export let onRestart;
  export let correctAnswerCount;
  export let totalQuestionCount;
  export let difficulty;
  const difficultyNames = {
    [QuestionDifficulty.EASY]: 'easy',
    [QuestionDifficulty.MEDIUM]: 'hard',
    [QuestionDifficulty.HARD]: 'legendary',
  }
  // TODO: real url
  const thisAppUrl = 'css-color-quiz.angelika.me'
  let twitterUrl = 'https://twitter.com/intent/tweet?text='
  twitterUrl += encodeURIComponent(`I got ${correctAnswerCount} / ${totalQuestionCount} CSS colors right 🎨 (in ${difficultyNames[difficulty]} mode) #CSSColorQuiz ${thisAppUrl}`)

  const windowWidth = 600
  const windowHeight = 300

  const onTwitterShare = (e) => {
    e.preventDefault();
    const features = `width=${windowWidth},height=${windowHeight}`
    window.open(e.target.getAttribute('href'), e.target.getAttribute('target'), features)
  }
</script>

<div class="game-over">
  <h2>Game Over</h2>
  <p>Uh-oh, looks like you're out of lives</p>
  <a href={twitterUrl} target="twitter-share" on:click={onTwitterShare}>
    Share on Twitter
  </a>
  <div>
    <button type="button" on:click={onRestart}>Try again</button>
  </div>
</div>

<style lang="scss">
  @import "src/appUI/shared";

 .game-over {
   button {
     @include button();
     margin-bottom: $margin-medium;
   }
 }
</style>
