import { loadJSON, saveJSON } from "./storage";

enum ColorScheme {
  LIGHT = "LIGHT",
  DARK = "DARK",
  AUTO = "AUTO",
}

type Settings = {
  colorScheme: ColorScheme,
  autoNewQuestion: boolean,
  autoNewQuestionTimeout: number
}

const defaultSettings = {
  colorScheme: ColorScheme.AUTO,
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

function setColorScheme(settings: Settings, value: ColorScheme): Settings {
  const newSettings = { ...settings, colorScheme: value };
  saveSettings(newSettings);
  return newSettings;
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

const colorSchemes = [ColorScheme.LIGHT, ColorScheme.DARK, ColorScheme.AUTO];

export type { Settings };
export { loadSettings, setColorScheme, setAutoNewQuestion, setAutoNewQuestionTimeout, colorSchemes, ColorScheme };
