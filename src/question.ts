import type { ColorDiffMatrix, ColorKey, ColorKeyList } from "./color";
import { shuffle } from "./array";
import { findTopSimilar, sanitizeKeyword } from "./color";

const SUGGESTED_ANSWERS_PER_QUESTION = 4;

enum QuestionState {
  PENDING_ANSWER = "PENDING_ANSWER",
  ANSWERED = "ANSWERED",
  CORRECTLY_ANSWERED = "CORRECTLY_ANSWERED",
  INCORRECTLY_ANSWERED = "INCORRECTLY_ANSWERED"
}

enum QuestionDifficulty {
  // take E1 most similar colors, remove them, then randomly take a few out of the remaining E2 similar colors
  EASY = "EASY",
  // randomly take M1 most similar colors, where M1 < E2
  MEDIUM = "MEDIUM",
  // no suggested answers at all
  HARD = "HARD"
}

const EASY_REMOVE_N_MOST_SIMILAR_ANSWERS = 20;
const MEDIUM_TAKE_N_MOST_SIMILAR_ANSWERS = 10;

type Question = {
  difficulty: QuestionDifficulty
  colorKey: ColorKey | null, // TODO: make color because we need alternative keywords to judge the answer
  suggestedAnswers: ColorKeyList | null,
  answer: ColorKey | null,
  state: QuestionState,
}

function chooseSuggestedAnswers(colorKey: ColorKey, difficulty: QuestionDifficulty, diffMatrix: ColorDiffMatrix): ColorKeyList {
  if (difficulty === QuestionDifficulty.HARD) { return null; }

  let suggestedAnswers = [];
  const colorKeys = Object.keys(diffMatrix);
  const allPossibleAnswersSorted = findTopSimilar(colorKeys, diffMatrix, colorKey, colorKeys.length);
  if (difficulty === QuestionDifficulty.EASY) {
    suggestedAnswers = allPossibleAnswersSorted.slice(EASY_REMOVE_N_MOST_SIMILAR_ANSWERS, colorKeys.length);
  } else if (difficulty === QuestionDifficulty.MEDIUM) {
    suggestedAnswers = allPossibleAnswersSorted.slice(1, MEDIUM_TAKE_N_MOST_SIMILAR_ANSWERS);
  }

  suggestedAnswers = shuffle(suggestedAnswers);
  suggestedAnswers = [colorKey, ...suggestedAnswers.slice(0, SUGGESTED_ANSWERS_PER_QUESTION - 1)];
  return shuffle(suggestedAnswers);
}

function newQuestion(colorKey: ColorKey, difficulty: QuestionDifficulty, diffMatrix: ColorDiffMatrix) {
  const suggestedAnswers = chooseSuggestedAnswers(colorKey, difficulty, diffMatrix);
  const answer = null;
  const state = QuestionState.PENDING_ANSWER;
  return {
    difficulty,
    colorKey,
    suggestedAnswers,
    answer,
    state,
  };
}

function giveAnswer(question: Question, userInput) {
  if (question.state !== QuestionState.PENDING_ANSWER) {
    throw new Error("can only answer an unanswered question");
  }

  const answer = sanitizeKeyword(userInput);

  if (question.suggestedAnswers && !question.suggestedAnswers.includes(answer)) {
    throw new Error("can only choose one of the suggested answers");
  }

  return { ...question, answer, state: QuestionState.ANSWERED };
}

export type { Question };
export { newQuestion, QuestionDifficulty, QuestionState, giveAnswer };
