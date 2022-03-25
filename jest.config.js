/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  coverageProvider: "v8",
  moduleFileExtensions: [
    "js",
    "ts",
    "json",
    "svelte",
  ],
  testEnvironment: "jsdom",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
  transform: {
    "^.+\\.js$": "ts-jest",
    "^.+\\.ts": "ts-jest",
    "^.+\\.svelte$": ["svelte-jester", { preprocess: true }]
  },
};
