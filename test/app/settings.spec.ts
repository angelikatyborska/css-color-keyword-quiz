import { loadSettings, setAutoNewQuestion, setAutoNewQuestionTimeout } from "../../src/app/settings";

describe("Settings", () => {
  const defaultSettings = loadSettings();

  describe("loadSettings", () => {
    test("auto progressing to the next question is the default", () => {
      expect(loadSettings().autoNewQuestion).toBe(true);
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
