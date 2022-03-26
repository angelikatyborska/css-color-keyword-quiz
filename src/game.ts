import type { ColorMap, ColorDiffMatrix, ColorKeyList, ColorKey } from "./color";
import type { Question, QuestionDifficulty } from "./question";
import { shuffle } from "./array"

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
  const currentAnswer = null;

  return {
    difficulty,
    colors,
    diffMatrix,
    upcomingColors,
    currentQuestion,
    currentAnswer,
    lives,
    state
  };
}

function setAnswer(game: Game, currentAnswer: ColorKey): GameState {
  return { ...game, currentAnswer };
}

export type { Game };
