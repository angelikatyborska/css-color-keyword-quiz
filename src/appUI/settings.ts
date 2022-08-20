import type { Settings } from "../app/settings";
import { ColorScheme } from "../app/settings";

const colorSchemeToClass = {
  [ColorScheme.LIGHT]: "color-scheme-light",
  [ColorScheme.DARK]: "color-scheme-dark",
  [ColorScheme.AUTO]: "color-scheme-auto"
};

function synchronizeSettingsWithBodyClass(settings: Settings): void {
  document.body.classList.remove(...Object.values(colorSchemeToClass));
  document.body.classList.add(colorSchemeToClass[settings.colorScheme]);
}

export { synchronizeSettingsWithBodyClass };
