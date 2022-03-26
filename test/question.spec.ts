import {newQuestion, QuestionDifficulty, QuestionState} from "../src/question";
import {range, unique} from "../src/array";

const diffMatrix = {
  c0: {
    c0: 0,
    ...range(1, 50).reduce((acc, n) => ({...acc, [`c${n}`]: n }), {})
  },
  c1: {
    c0: 1,
    c1: 0,
    ...range(2, 50).reduce((acc, n) => ({...acc, [`c${n}`]: n }), {})
  },
  ...range(2, 50).reduce((acc, n) => ({...acc, [`c${n}`]: {} }), {})
}

describe("question", () => {
  describe("newQuestion", () => {
    test("new empty question", () => {
      const question = newQuestion('c0', QuestionDifficulty.EASY, diffMatrix)
      expect(question.colorKey).toEqual("c0")
      expect(question.state).toEqual(QuestionState.PENDING_ANSWER)
      expect(question.difficulty).toEqual(QuestionDifficulty.EASY)
      expect(question.suggestedAnswers.length).toEqual(4)
      expect(question.suggestedAnswers).toContain("c0")
    })

    test("easy questions don't contain very similar answers", () => {
      range(0, 100).forEach(_x => {
        const question = newQuestion('c0', QuestionDifficulty.EASY, diffMatrix)

        expect(question.suggestedAnswers.length).toEqual(4)
        expect(question.suggestedAnswers).toContain("c0")
        range(1, 20).forEach(n => expect(question.suggestedAnswers).not.toContain(`c${n}`))
      })
    })

    test("easy questions suggested answers are always unique", () => {
      range(0, 100).forEach(_x => {
        const question = newQuestion('c0', QuestionDifficulty.EASY, diffMatrix)

        expect(question.suggestedAnswers.length).toEqual(4)
        expect(question.suggestedAnswers).toContain("c0")
        expect(unique(question.suggestedAnswers)).toEqual(question.suggestedAnswers)
      })
    })

    test("medium questions contain only very similar answers", () => {
      range(0, 100).forEach(_x => {
        const question = newQuestion('c0', QuestionDifficulty.MEDIUM, diffMatrix)

        expect(question.suggestedAnswers.length).toEqual(4)
        expect(question.suggestedAnswers).toContain("c0")
        range(20, 50).forEach(n => expect(question.suggestedAnswers).not.toContain(`c${n}`))
      })
    })

    test("medium questions suggested answers are always unique", () => {
      range(0, 100).forEach(_x => {
        const question = newQuestion('c0', QuestionDifficulty.MEDIUM, diffMatrix)

        expect(question.suggestedAnswers.length).toEqual(4)
        expect(question.suggestedAnswers).toContain("c0")
        expect(unique(question.suggestedAnswers)).toEqual(question.suggestedAnswers)
      })
    })

    test("hard questions have no suggested answers", () => {
      const question = newQuestion('c0', QuestionDifficulty.HARD, diffMatrix)
      expect(question.colorKey).toEqual("c0")
      expect(question.state).toEqual(QuestionState.PENDING_ANSWER)
      expect(question.difficulty).toEqual(QuestionDifficulty.HARD)
      expect(question.suggestedAnswers).toBeNull()
    })
  });
});
