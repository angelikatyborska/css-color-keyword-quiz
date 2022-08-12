import { defaultSettings, setAutoNewQuestion, setAutoNewQuestionTimeout } from "../../src/app/settings";

describe("Settings", () => {
  describe("defaultSettings", () => {
    test("auto progressing to the next question is the default", () => {
      expect(defaultSettings.autoNewQuestion).toBe(true);
    });
  });

  describe("setAutoNewQuestion", () => {
    test("works", () => {
      expect(setAutoNewQuestion(
        { ...defaultSettings, autoNewQuestion: true }, false)).toEqual(
        { ...defaultSettings, autoNewQuestion: false }
      );

      expect(setAutoNewQuestion(
        { ...defaultSettings, autoNewQuestion: false },
        false)).toEqual(
        { ...defaultSettings, autoNewQuestion: false }
      );
    });
  });

  describe("setAutoNewQuestionTimeout", () => {
    test("works", () => {
      expect(setAutoNewQuestionTimeout(
        { ...defaultSettings, autoNewQuestionTimeout: 1234 }, 3322)).toEqual(
        { ...defaultSettings, autoNewQuestionTimeout: 3322 }
      );
    });
  });
});
