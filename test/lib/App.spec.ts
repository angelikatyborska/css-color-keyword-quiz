import '@testing-library/jest-dom';
import { render } from "@testing-library/svelte";
import App from "../../src/App.svelte";

describe("App component", () => {
  test("has a link", () => {
    const { getByTestId } = render(App);
    expect(getByTestId("some-link")).toHaveAttribute('href', 'https://svelte.dev/tutorial')
  });
});
