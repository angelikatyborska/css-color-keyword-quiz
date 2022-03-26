import { hexToHSL, hexToRGB, calculateColorDiff, calculateDiffMatrix, findTopSimilar } from "../src/color";
import { dataObjectToColor } from "../src/data/tranform";

describe("color", () => {
  describe("hexToHSL", () => {
    test("black", () => expect(hexToHSL("#000000")).toEqual({ h: 0, s: 0, l: 0 }));
    test("white", () => expect(hexToHSL("#ffffff")).toEqual({ h: 0, s: 0, l: 100 }));
    test("gray", () => expect(hexToHSL("#808080")).toEqual({ h: 0, s: 0, l: 50 }));
    test("red", () => expect(hexToHSL("#ff0000")).toEqual({ h: 0, s: 100, l: 50 }));
    test("cyan", () => expect(hexToHSL("#00ffff")).toEqual({ h: 180, s: 100, l: 50 }));
    test("indigo", () => expect(hexToHSL("#4b0082")).toEqual({ h: 275, s: 100, l: 25 }));
  });

  describe("hexToRGB", () => {
    test("black", () => expect(hexToRGB("#000000")).toEqual({ r: 0, g: 0, b: 0 }));
    test("white", () => expect(hexToRGB("#ffffff")).toEqual({ r: 255, g: 255, b: 255 }));
    test("gray", () => expect(hexToRGB("#808080")).toEqual({ r: 128, g: 128, b: 128 }));
    test("red", () => expect(hexToRGB("#ff0000")).toEqual({ r: 255, g: 0, b: 0 }));
    test("cyan", () => expect(hexToRGB("#00ffff")).toEqual({ r: 0, g: 255, b: 255 }));
    test("indigo", () => expect(hexToRGB("#4b0082")).toEqual({ r: 75, g: 0, b: 130 }));
  });

  describe("calculateColorDiff", () => {
    const white = dataObjectToColor({ keyword: "white", hex: "#ffffff" });
    const black = dataObjectToColor({ keyword: "black", hex: "#000000" });
    const gray = dataObjectToColor({ keyword: "gray", hex: "#808080" });
    const lightGreen = dataObjectToColor({ keyword: "lightGreen", hex: "#90ee90" });
    const darkGreen = dataObjectToColor({ keyword: "darkGreen", hex: "#006400" });

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
      expect(calculateColorDiff(lightGreen, black)).toEqual(calculateColorDiff(black, lightGreen));
      expect(calculateColorDiff(lightGreen, white)).toEqual(calculateColorDiff(white, lightGreen));
    });

    test("assigns a known value for colors that can be mixed up by name", () => {
      const fakeLightGreen = dataObjectToColor({ keyword: "lightgreen", hex: "#ffffff" });
      const fakeDarkGreen = dataObjectToColor({ keyword: "darkgreen", hex: "#000000" });
      expect(calculateColorDiff(fakeLightGreen, fakeDarkGreen)).toBeLessThan(calculateColorDiff(black, white));
      expect(calculateColorDiff(fakeLightGreen, fakeDarkGreen)).toEqual(50);
    });
  });

  describe("calculateDiffMatrix", () => {
    test("works", () => {
      const white = dataObjectToColor({ keyword: "white", hex: "#ffffff" });
      const black = dataObjectToColor({ keyword: "black", hex: "#000000" });
      const gray = dataObjectToColor({ keyword: "gray", hex: "#808080" });

      const colors = { white, black, gray };

      expect(calculateDiffMatrix(colors)).toEqual({
        black: { black: 0, gray: 384, white: 765 },
        gray: { black: 384, gray: 0, white: 381 },
        white: { black: 765, gray: 381, white: 0 }
      });
    });
  });

  describe("findTopSimilar", () => {
    test("sorts by difference asc, filters out self", () => {
      const colors = ["white", "black", "gray", "red"];
      const diffMatrix = {
        white: { white: 0, black: 700, gray: 300, red: 200 },
        black: { white: 700, black: 0, gray: 450, red: 50 },
        gray: { white: 300, black: 450, gray: 0, red: 400 },
        red: { white: 200, black: 50, gray: 400, red: 0 }
      };

      expect(findTopSimilar(colors, diffMatrix, "white", 2)).toEqual(["red", "gray"]);
      expect(findTopSimilar(colors, diffMatrix, "black", 2)).toEqual(["red", "gray"]);
      expect(findTopSimilar(colors, diffMatrix, "gray", 2)).toEqual(["white", "red"]);
      expect(findTopSimilar(colors, diffMatrix, "red", 2)).toEqual(["black", "white"]);
    });

    test("stable sort order in case of more than X identical diffs", () => {
      const colors = ["white", "black", "gray", "red"];
      const diffMatrix = {
        red: { white: 200, black: 200, gray: 200, red: 0 }
      };

      expect(findTopSimilar(colors, diffMatrix, "red", 2)).toEqual(["white", "black"]);
    });
  });
});
