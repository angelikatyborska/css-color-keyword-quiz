const keyPrefix = "css-color-keyword-quiz-";

function saveJSON(key: string, value: Record<string, unknown>): void {
  const stringValue = JSON.stringify(value);
  const fullKey = keyPrefix + key;
  localStorage.setItem(fullKey, stringValue);
}

function loadJSON(key: string): Record<string, unknown> {
  const fullKey = keyPrefix + key;
  const stringValue = localStorage.getItem(fullKey);
  if (stringValue) {
    try {
      return JSON.parse(stringValue);
    } catch (e) {
      console.error(e);
      return {};
    }
  } else {
    return {};
  }
}

export { saveJSON, loadJSON };
