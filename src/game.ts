import type { ColorMap, ColorDiffMatrix, ColorKeyList, ColorKey } from "./color";
import type { Question } from "./question";
import { QuestionDifficulty } from "./question";
import { shuffle } from "./array";

enum GameState {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  WON = "WON",
  LOST = "LOST"
}

type Game = {
  difficulty: QuestionDifficulty,
  colors: ColorMap,
  diffMatrix: ColorDiffMatrix,
  currentQuestion: Question,
  correctAnswerCount: number,
  incorrectAnswerCount: number,
  upcomingColors: ColorKeyList,
  lives: number,
  state: GameState,
}

function newGame(colors: ColorMap, diffMatrix: ColorDiffMatrix) : Game {
  const difficulty = QuestionDifficulty.EASY;
  const upcomingColors = shuffle(Object.keys(colors));
  const lives = 3;
  const state = GameState.NEW;
  const currentQuestion = null;
  const correctAnswerCount = 0;
  const incorrectAnswerCount = 0;

  return {
    difficulty,
    colors,
    diffMatrix,
    upcomingColors,
    currentQuestion,
    correctAnswerCount,
    incorrectAnswerCount,
    lives,
    state
  };
}

export type { Game };
