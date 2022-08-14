<script lang="ts">
  import { QuestionDifficulty, difficultyNames } from '../../app/question'
  export let correctAnswerCount;
  export let totalQuestionCount;
  export let difficulty;
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

<div class="share-result">
  <p>
    You got {correctAnswerCount} / {totalQuestionCount} CSS colors right 🎨 (in {difficultyNames[difficulty]} mode).
  </p>
  <p>
    <a href={twitterUrl} target="twitter-share" on:click={onTwitterShare}>
      Share on Twitter
    </a>
  </p>
</div>

<style lang="scss">
  @import "src/appUI/shared";
</style>
