import type { ColorDiffMatrix, ColorKeyList, ColorMap } from "./color";
import type { Question, QuestionDifficulty } from "./question";
import { canCheckAnswer, canGiveAnswer, checkAnswer, giveAnswer, newQuestion, QuestionState } from "./question";
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
  totalQuestionCount: number,
  upcomingColorKeys: ColorKeyList,
  livesLeft: number,
  livesTotal: number,
  state: GameState,
}

function newGame(colors: ColorMap, diffMatrix: ColorDiffMatrix, difficulty: QuestionDifficulty): Game {
  const upcomingColorKeys = shuffle(Object.keys(colors));
  const lives = 3;
  const state = GameState.NEW;
  const currentQuestion = null;
  const correctAnswerCount = 0;
  const incorrectAnswerCount = 0;
  const totalQuestionCount = upcomingColorKeys.length;

  return {
    difficulty,
    colors,
    diffMatrix,
    upcomingColorKeys,
    currentQuestion,
    correctAnswerCount,
    incorrectAnswerCount,
    totalQuestionCount,
    livesLeft: lives,
    livesTotal: lives,
    state
  };
}

function canStartGame(game: Game): boolean {
  return game.state === GameState.NEW && game.upcomingColorKeys.length > 0;
}

function startGame(game: Game): Game {
  if (!canStartGame(game)) {
    throw new Error("can only start a new game");
  }

  return { ...game, state: GameState.IN_PROGRESS };
}

function canGetNextQuestion(game: Game): boolean {
  return game.state === GameState.IN_PROGRESS && (
    !game.currentQuestion ||
        [QuestionState.ANSWERED_CORRECTLY, QuestionState.ANSWERED_INCORRECTLY].includes(game.currentQuestion.state)
  );
}

function getNextQuestion(game: Game): Game {
  if (!canGetNextQuestion(game)) {
    throw new Error("can only get a new question for a completely new game or when previous question was answered and checked");
  }

  if (game.livesLeft === 0) {
    return {
      ...game,
      currentQuestion: null,
      state: GameState.LOST
    };
  }

  if (game.upcomingColorKeys.length === 0) {
    return {
      ...game,
      currentQuestion: null,
      state: GameState.WON
    };
  }

  const currentQuestion = newQuestion(game.upcomingColorKeys[0], game.difficulty, game.diffMatrix);

  const upcomingColorKeys = game.upcomingColorKeys.slice(1, game.upcomingColorKeys.length);
  return {
    ...game,
    currentQuestion,
    upcomingColorKeys
  };
}

function giveAnswerToQuestion(game: Game, userInput: string): Game {
  if (canGiveAnswer(game.currentQuestion)) {
    return {
      ...game,
      currentQuestion: giveAnswer(game.currentQuestion, userInput)
    };
  } else {
    return game;
  }
}

function checkAnswerToQuestion(game: Game): Game {
  if (canCheckAnswer(game.currentQuestion)) {
    const updatedQuestion = checkAnswer(game.currentQuestion, game.colors);
    const correctAnswerCount = updatedQuestion.state === QuestionState.ANSWERED_CORRECTLY
      ? game.correctAnswerCount + 1
      : game.correctAnswerCount;

    const incorrectAnswerCount = updatedQuestion.state === QuestionState.ANSWERED_INCORRECTLY
      ? game.incorrectAnswerCount + 1
      : game.incorrectAnswerCount;

    const livesLeft = updatedQuestion.state === QuestionState.ANSWERED_INCORRECTLY
      ? game.livesLeft - 1
      : game.livesLeft;

    return {
      ...game,
      correctAnswerCount,
      incorrectAnswerCount,
      livesLeft,
      currentQuestion: updatedQuestion
    };
  } else {
    return game;
  }
}

function hasWon(game: Game): boolean {
  return game.state === GameState.WON;
}

function hasLost(game: Game): boolean {
  return game.state === GameState.LOST;
}

export type { Game };
export { newGame, GameState, startGame, getNextQuestion, giveAnswerToQuestion, checkAnswerToQuestion, hasWon, hasLost };
