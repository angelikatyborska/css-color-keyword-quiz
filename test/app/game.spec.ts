import { GameState, getNextQuestion, newGame, startGame } from "../../src/app/game";
import { range } from "../../src/app/array";
import { dataObjectToColor } from "../../src/app/data/tranform";
import { QuestionDifficulty } from "../../src/app/question";

const colorMap = range(1, 50).reduce((acc, n) => (
  {
    ...acc,
    [`c${n}`]: dataObjectToColor({
      keyword: `c${n}`,
      hex: `#00FF${n < 16 ? "0" : ""}${n.toString(16)}`
    })
  }
), {});

const diffMatrix = {
  c0: {
    c0: 0,
    ...range(1, 50).reduce((acc, n) => ({ ...acc, [`c${n}`]: n }), {})
  },
  c1: {
    c0: 1,
    c1: 0,
    ...range(2, 50).reduce((acc, n) => ({ ...acc, [`c${n}`]: n }), {})
  },
  ...range(2, 50).reduce((acc, n) => ({ ...acc, [`c${n}`]: {} }), {})
};

describe("game", () => {
  describe("newGame", () => {
    test("new empty game", () => {
      const game = newGame(colorMap, diffMatrix, QuestionDifficulty.EASY);
      expect(game.difficulty).toEqual(QuestionDifficulty.EASY);
      expect(game.state).toEqual(GameState.NEW);
      expect(game.correctAnswerCount).toEqual(0);
      expect(game.incorrectAnswerCount).toEqual(0);
      expect(game.livesLeft).toEqual(3);
      expect(game.livesTotal).toEqual(3);
      expect(game.currentQuestion).toBeNull();
      expect(game.totalQuestionCount).toEqual(50);
      expect(game.upcomingColorKeys.length).toEqual(50);
    });

    test("upcoming colors are shuffled", () => {
      const game1 = newGame(colorMap, diffMatrix, QuestionDifficulty.EASY);
      const game2 = newGame(colorMap, diffMatrix, QuestionDifficulty.EASY);
      expect(game1.upcomingColorKeys).not.toEqual(game2.upcomingColorKeys);
      expect(game1.upcomingColorKeys.sort()).toEqual(game2.upcomingColorKeys.sort());
    });

    test("can choose difficulty", () => {
      const game = newGame(colorMap, diffMatrix, QuestionDifficulty.HARD);
      expect(game.difficulty).toEqual(QuestionDifficulty.HARD);
    });
  });

  describe("startGame", () => {
    test("updates game state", () => {
      let game = newGame(colorMap, diffMatrix, QuestionDifficulty.EASY);
      game = startGame(game);
      expect(game.state).toEqual(GameState.IN_PROGRESS);
    });

    test("can only start a new game", () => {
      const game = {
        ...newGame(colorMap, diffMatrix, QuestionDifficulty.EASY),
        state: GameState.IN_PROGRESS
      };
      expect(() => startGame(game)).toThrow("can only start a new game");
    });
  });

  describe("getNextQuestion", () => {
    test("when there's more questions", () => {
      let game = newGame(colorMap, diffMatrix, QuestionDifficulty.EASY);
      game = startGame(game);
      expect(game.totalQuestionCount).toEqual(50);
      expect(game.upcomingColorKeys.length).toEqual(50);
      expect(game.currentQuestion).toBeNull();
      game = getNextQuestion(game);
      expect(game.state).toEqual(GameState.IN_PROGRESS);
      expect(game.currentQuestion).not.toBeNull();
      expect(game.currentQuestion.difficulty).toEqual(QuestionDifficulty.EASY);
      expect(game.currentQuestion.colorKey).not.toBeNull();
      expect(game.totalQuestionCount).toEqual(50);
      expect(game.upcomingColorKeys.length).toEqual(49);
      expect(game.upcomingColorKeys).not.toContain(game.currentQuestion.colorKey);
    });

    test("question difficulty matches game difficulty", () => {
      let game = newGame(colorMap, diffMatrix, QuestionDifficulty.MEDIUM);
      game = startGame(game);
      game = getNextQuestion(game);
      expect(game.currentQuestion.difficulty).toEqual(QuestionDifficulty.MEDIUM);
    });

    test("game must be in progress", () => {
      const game = newGame(colorMap, diffMatrix, QuestionDifficulty.EASY);

      expect(() => getNextQuestion(game)).toThrow("can only get a new question for a completely new game or when previous question was answered and checked");
    });

    test("current question must have been already answered", () => {
      let game = newGame(colorMap, diffMatrix, QuestionDifficulty.EASY);
      game = startGame(game);
      game = getNextQuestion(game);

      expect(() => getNextQuestion(game)).toThrow("can only get a new question for a completely new game or when previous question was answered and checked");
    });

    test("when there are no more lives", () => {
      let game = newGame(colorMap, diffMatrix, QuestionDifficulty.EASY);
      game = startGame(game);
      game = { ...game, livesLeft: 0 };
      game = getNextQuestion(game);
      expect(game.state).toEqual(GameState.LOST);
      expect(game.currentQuestion).toBeNull();
    });

    test("when there are no more upcoming questions or lives", () => {
      let game = newGame(colorMap, diffMatrix, QuestionDifficulty.EASY);
      game = startGame(game);
      game = { ...game, livesLeft: 0, upcomingColorKeys: [] };
      game = getNextQuestion(game);
      expect(game.state).toEqual(GameState.LOST);
      expect(game.currentQuestion).toBeNull();
    });

    test("when there are no more upcoming questions but spare lives", () => {
      let game = newGame(colorMap, diffMatrix, QuestionDifficulty.EASY);
      game = startGame(game);
      game = { ...game, upcomingColorKeys: [] };
      game = getNextQuestion(game);
      expect(game.state).toEqual(GameState.WON);
      expect(game.currentQuestion).toBeNull();
    });
  });
});
