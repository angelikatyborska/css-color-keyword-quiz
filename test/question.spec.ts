import { newQuestion, QuestionDifficulty, QuestionState, giveAnswer, checkAnswer } from "../src/question";
import { range, unique } from "../src/array";
import { dataObjectToColor } from "../src/data/tranform";

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

describe("question", () => {
  describe("newQuestion", () => {
    test("new empty question", () => {
      const question = newQuestion("c0", QuestionDifficulty.EASY, diffMatrix);
      expect(question.colorKey).toEqual("c0");
      expect(question.state).toEqual(QuestionState.PENDING_ANSWER);
      expect(question.difficulty).toEqual(QuestionDifficulty.EASY);
      expect(question.suggestedAnswers.length).toEqual(4);
      expect(question.suggestedAnswers).toContain("c0");
    });

    test("easy questions don't contain very similar answers", () => {
      range(0, 100).forEach(() => {
        const question = newQuestion("c0", QuestionDifficulty.EASY, diffMatrix);

        expect(question.suggestedAnswers.length).toEqual(4);
        expect(question.suggestedAnswers).toContain("c0");
        range(1, 20).forEach(n => expect(question.suggestedAnswers).not.toContain(`c${n}`));
      });
    });

    test("easy questions suggested answers are always unique", () => {
      range(0, 100).forEach(() => {
        const question = newQuestion("c0", QuestionDifficulty.EASY, diffMatrix);

        expect(question.suggestedAnswers.length).toEqual(4);
        expect(question.suggestedAnswers).toContain("c0");
        expect(unique(question.suggestedAnswers)).toEqual(question.suggestedAnswers);
      });
    });

    test("medium questions contain only very similar answers", () => {
      range(0, 100).forEach(() => {
        const question = newQuestion("c0", QuestionDifficulty.MEDIUM, diffMatrix);

        expect(question.suggestedAnswers.length).toEqual(4);
        expect(question.suggestedAnswers).toContain("c0");
        range(20, 50).forEach(n => expect(question.suggestedAnswers).not.toContain(`c${n}`));
      });
    });

    test("medium questions suggested answers are always unique", () => {
      range(0, 100).forEach(() => {
        const question = newQuestion("c0", QuestionDifficulty.MEDIUM, diffMatrix);

        expect(question.suggestedAnswers.length).toEqual(4);
        expect(question.suggestedAnswers).toContain("c0");
        expect(unique(question.suggestedAnswers)).toEqual(question.suggestedAnswers);
      });
    });

    test("hard questions have no suggested answers", () => {
      const question = newQuestion("c0", QuestionDifficulty.HARD, diffMatrix);
      expect(question.colorKey).toEqual("c0");
      expect(question.state).toEqual(QuestionState.PENDING_ANSWER);
      expect(question.difficulty).toEqual(QuestionDifficulty.HARD);
      expect(question.suggestedAnswers).toBeNull();
    });
  });

  describe("giveAnswer", () => {
    test("sets new question state", () => {
      let question = newQuestion("c0", QuestionDifficulty.EASY, diffMatrix);
      question = giveAnswer(question, "c0");
      expect(question.state).toEqual(QuestionState.ANSWERED);
    });

    test("normalizes answer", () => {
      let question = newQuestion("c0", QuestionDifficulty.EASY, diffMatrix);
      question = giveAnswer(question, "   C0  ");
      expect(question.answer).toEqual("c0");
    });

    test("can only answer unanswered questions", () => {
      const question = {
        ...newQuestion("c0", QuestionDifficulty.EASY, diffMatrix),
        state: QuestionState.ANSWERED
      };
      expect(() => giveAnswer(question, "foo"))
        .toThrow("can only answer an unanswered question");
    });

    test("must choose one of the suggested answers if they exist", () => {
      const question = newQuestion("c0", QuestionDifficulty.EASY, diffMatrix);

      expect(() => giveAnswer(question, "foo"))
        .toThrow("can only choose one of the suggested answers");
    });

    test("can answer anything if suggested answers do not exist", () => {
      let question = newQuestion("c0", QuestionDifficulty.HARD, diffMatrix);
      question = giveAnswer(question, "foo");
      expect(question.answer).toEqual("foo");
    });
  });

  describe("checkAnswer", () => {
    test("when answered correctly", () => {
      let question = newQuestion("c0", QuestionDifficulty.EASY, diffMatrix);
      question = giveAnswer(question, "c0");
      question = checkAnswer(question, { c0: dataObjectToColor({ keyword: "c0", hex: "#F0FF00" }) });
      expect(question.state).toEqual(QuestionState.ANSWERED_CORRECTLY);
    });

    test("when answered incorrectly", () => {
      let question = {
        ...newQuestion("c0", QuestionDifficulty.EASY, diffMatrix),
        suggestedAnswers: ["c0", "c100", "c200", "c300"]
      };

      question = giveAnswer(question, "c100");
      question = checkAnswer(question, { c0: dataObjectToColor({ keyword: "c0", hex: "#F0FF00" }) });
      expect(question.state).toEqual(QuestionState.ANSWERED_INCORRECTLY);
    });

    test("can only check answer of answered questions", () => {
      const question = newQuestion("c0", QuestionDifficulty.EASY, diffMatrix);

      expect(() => checkAnswer(question, {}))
        .toThrow("can only check answer of an answered question");
    });

    test("accepts alternative keywords as correct answer", () => {
      let question = newQuestion("c0", QuestionDifficulty.HARD, diffMatrix);
      question = giveAnswer(question, "czero");
      question = checkAnswer(question, { c0: dataObjectToColor({ keyword: "c0", hex: "#F0FF00", alternativeKeywords: ["czero"] }) });
      expect(question.state).toEqual(QuestionState.ANSWERED_CORRECTLY);
    });
  });
});
