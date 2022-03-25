import "@testing-library/jest-dom";
import { hexToHSL, loadData } from "../src/color";
import jsonData from "../src/data.json";

describe("color", () => {
  describe("HexToHSL", () => {
    test("black", () => expect(hexToHSL("#000000")).toEqual({ h: 0, s: 0, l: 0 }));
    test("white", () => expect(hexToHSL("#ffffff")).toEqual({ h: 0, s: 0, l: 100 }));
    test("gray", () => expect(hexToHSL("#808080")).toEqual({ h: 0, s: 0, l: 50 }));
    test("red", () => expect(hexToHSL("#ff0000")).toEqual({ h: 0, s: 100, l: 50 }));
    test("cyan", () => expect(hexToHSL("#00ffff")).toEqual({ h: 180, s: 100, l: 50 }));
    test("indigo", () => expect(hexToHSL("#4b0082")).toEqual({ h: 275, s: 100, l: 25 }));
  });

  describe("loadData", () => {
    test("returns an array of valid colors", () => {
      const data = [
        { keyword: "cyan", hex: "#00ffff", alternativeKeywords: ["aqua"] },
        { keyword: "red", hex: "#ff0000" },
      ];

      expect(loadData(data)).toEqual(
        [
          {
            alternativeKeywords: [
              "aqua",
            ],
            keyword: "cyan",
            hex: "#00ffff",
          },
          {
            alternativeKeywords: [],
            keyword: "red",
            hex: "#ff0000",
          },
        ],
      );
    });

    test("normalizes data", () => {
      const data = [
        { keyword: "CYAN  ", hex: "#00FFFF", alternativeKeywords: ["   aqua "] },
        { keyword: "  red", hex: "  #ff0000  " },
      ];

      expect(loadData(data)).toEqual(
        [
          {
            alternativeKeywords: [
              "aqua",
            ],
            keyword: "cyan",
            hex: "#00ffff",
          },
          {
            alternativeKeywords: [],
            keyword: "red",
            hex: "#ff0000",
          },
        ],
      );
    });

    test("rejects duplicate keywords, after normalization", () => {
      const data = [
        { keyword: "cyan", hex: "#00ffff", alternativeKeywords: ["  RED   "] },
        { keyword: "red", hex: "#ff0000" },
        { keyword: "cyan", hex: "#00fffe" },
      ];

      expect(() => loadData(data))
        .toThrow("found duplicate keywords and/or alternativeKeywords: 'red,cyan'");
    });

    test("rejects duplicate hexes, after normalization", () => {
      const data = [
        { keyword: "cyan", hex: "#00ffff" },
        { keyword: "red", hex: "#ff0000" },
        { keyword: "red", hex: "#FF0000" },
        { keyword: "cyan", hex: "  #00ffff  " },
      ];

      expect(() => loadData(data))
        .toThrow("found duplicate hex values: '#00ffff,#ff0000'. Use alternativeKeywords instead.");
    });

    test("rejects objects with missing keyword", () => {
      const data = [
        { hex: "#00ffff" },
      ];

      expect(() => loadData(data))
        .toThrow("missing keyword: '{\"hex\":\"#00ffff\"}'");
    });

    test("rejects objects with missing hex", () => {
      const data = [
        { keyword: "cyan" },
      ];

      expect(() => loadData(data))
        .toThrow("missing hex: '{\"keyword\":\"cyan\"}'");
    });

    test("rejects unknown keys", () => {
      const data = [
        { keyword: "cyan", hex: "#00FFFF", name: "cyan", extraName: "aqua" },
      ];

      expect(() => loadData(data))
        .toThrow("unknown keys 'name,extraName' in object '{\"keyword\":\"cyan\",\"hex\":\"#00FFFF\",\"name\":\"cyan\",\"extraName\":\"aqua\"}'");
    });

    test("real app data is valid", () => {
      const realData = loadData(jsonData);
      expect(Array.isArray(realData)).toBeTruthy();
      expect(realData.length).toBeGreaterThan(0);
    });
  });
});
