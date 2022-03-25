import { hexToHSL, hexToRGB, calculateColorDiff } from "../src/color";
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
});
