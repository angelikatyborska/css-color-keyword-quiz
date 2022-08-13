import { loadJSON, saveJSON } from "./storage";

type Settings = {
  autoNewQuestion: boolean,
  autoNewQuestionTimeout: number
}

const defaultSettings = {
  autoNewQuestion: true,
  autoNewQuestionTimeout: 2000
};

const storageKey = "settings";

function loadSettings(): Settings {
  const savedSettings = loadJSON(storageKey);
  return { ...defaultSettings, ...savedSettings };
}

function saveSettings(settings: Settings): void {
  saveJSON(storageKey, settings);
}

function setAutoNewQuestion(settings: Settings, value: boolean): Settings {
  const newSettings = { ...settings, autoNewQuestion: value };
  saveSettings(newSettings);
  return newSettings;
}

function setAutoNewQuestionTimeout(settings: Settings, value: number): Settings {
  const newSettings = { ...settings, autoNewQuestionTimeout: value };
  saveSettings(newSettings);
  return newSettings;
}

export type { Settings };
export { loadSettings, setAutoNewQuestion, setAutoNewQuestionTimeout };
