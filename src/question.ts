import type { ColorDiffMatrix, ColorKey, ColorKeyList, ColorMap } from "./color";
import { shuffle } from "./array";
import { findTopSimilar, sanitizeKeyword } from "./color";

const SUGGESTED_ANSWERS_PER_QUESTION = 4;

enum QuestionState {
  PENDING_ANSWER = "PENDING_ANSWER",
  ANSWERED = "ANSWERED",
  ANSWERED_CORRECTLY = "ANSWERED_CORRECTLY",
  ANSWERED_INCORRECTLY = "ANSWERED_INCORRECTLY"
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
  colorKey: ColorKey | null,
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

function newQuestion(colorKey: ColorKey, difficulty: QuestionDifficulty, diffMatrix: ColorDiffMatrix): Question {
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

function giveAnswer(question: Question, userInput): Question {
  if (question.state !== QuestionState.PENDING_ANSWER) {
    throw new Error("can only answer an unanswered question");
  }

  const answer = sanitizeKeyword(userInput);

  if (question.suggestedAnswers && !question.suggestedAnswers.includes(answer)) {
    throw new Error("can only choose one of the suggested answers");
  }

  return { ...question, answer, state: QuestionState.ANSWERED };
}

function isAnswerCorrect(question: Question, colorMap: ColorMap): boolean {
  const correctColor = colorMap[question.colorKey];
  return question.answer === correctColor.keyword || correctColor.alternativeKeywords.includes(question.answer);
}

function checkAnswer(question: Question, colorMap: ColorMap): Question {
  if (question.state !== QuestionState.ANSWERED) {
    throw new Error("can only check answer of an answered question");
  }

  const newState = isAnswerCorrect(question, colorMap)
    ? QuestionState.ANSWERED_CORRECTLY
    : QuestionState.ANSWERED_INCORRECTLY;

  return { ...question, state: newState };
}

export type { Question };
export { newQuestion, QuestionDifficulty, QuestionState, giveAnswer, checkAnswer };
