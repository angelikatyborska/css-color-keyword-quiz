type Settings = {
  autoNewQuestion: boolean,
  autoNewQuestionTimeout: number
}

const defaultSettings = {
  autoNewQuestion: true,
  autoNewQuestionTimeout: 2000
};

function setAutoNewQuestion(settings: Settings, value: boolean): Settings {
  return { ...settings, autoNewQuestion: value };
}

function setAutoNewQuestionTimeout(settings: Settings, value: number): Settings {
  return { ...settings, autoNewQuestionTimeout: value };
}

export type { Settings };
export { defaultSettings, setAutoNewQuestion, setAutoNewQuestionTimeout };
