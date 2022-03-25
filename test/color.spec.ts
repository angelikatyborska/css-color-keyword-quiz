import { hexToRGB, calculateColorDiff } from "../src/color";

describe("color", () => {
  describe("hexToRGB", () => {
    test("black", () => expect(hexToRGB("#000000")).toEqual({ r: 0, g: 0, b: 0 }));
    test("white", () => expect(hexToRGB("#ffffff")).toEqual({ r: 255, g: 255, b: 255 }));
    test("gray", () => expect(hexToRGB("#808080")).toEqual({ r: 128, g: 128, b: 128 }));
    test("red", () => expect(hexToRGB("#ff0000")).toEqual({ r: 255, g: 0, b: 0 }));
    test("cyan", () => expect(hexToRGB("#00ffff")).toEqual({ r: 0, g: 255, b: 255 }));
    test("indigo", () => expect(hexToRGB("#4b0082")).toEqual({ r: 75, g: 0, b: 130 }));
  });

  describe("calculateColorDiff", () => {
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };
    const gray = { r: 128, g: 128, b: 128 };
    const lightGreen = { r: 144, g: 238, b: 144 };
    const darkGreen = { r: 0, g: 100, b: 0 };

    test("black is identical to black", () => {
      expect(calculateColorDiff(black, black)).toEqual(0);
    });

    test("white is identical to white", () => {
      expect(calculateColorDiff(white, white)).toEqual(0);
    });

    test("white is more similar to gray than to black", () => {
      expect(calculateColorDiff(white, gray)).toBeLessThan(calculateColorDiff(white, black));
    });

    test("white is more similar to light green than to dark green", () => {
      expect(calculateColorDiff(white, lightGreen))
        .toBeLessThan(calculateColorDiff(white, darkGreen));
    });

    test("black is more similar to dark green than to light green", () => {
      expect(calculateColorDiff(black, darkGreen))
        .toBeLessThan(calculateColorDiff(black, lightGreen));
    });

    test("is symmetrical", () => {
      expect(calculateColorDiff(white, black)).toEqual(calculateColorDiff(black, white));
    });
  });
});
