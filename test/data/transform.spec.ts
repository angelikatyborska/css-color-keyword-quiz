import { loadColors } from "../../src/data/tranform";
import jsonData from "../../src/data/source.json";

describe("transform", () => {
  describe("loadColors", () => {
    test("returns an array of valid colors", () => {
      const data = [
        { keyword: "cyan", hex: "#00ffff", alternativeKeywords: ["aqua"] },
        { keyword: "red", hex: "#ff0000" },
      ];

      expect(loadColors(data)).toEqual(
        {
          cyan: {
            alternativeKeywords: [
              "aqua",
            ],
            keyword: "cyan",
            hex: "#00ffff",
            rgb: { r: 0, g: 255, b: 255 }
          },
          red: {
            alternativeKeywords: [],
            keyword: "red",
            hex: "#ff0000",
            rgb: { r: 255, g: 0, b: 0 }
          },
        },
      );
    });

    test("normalizes data", () => {
      const data = [
        { keyword: "CYAN  ", hex: "#00FFFF", alternativeKeywords: ["   aqua "] },
        { keyword: "  red", hex: "  #ff0000  " },
      ];

      expect(loadColors(data)).toEqual(
        {
          cyan: {
            alternativeKeywords: [
              "aqua",
            ],
            keyword: "cyan",
            hex: "#00ffff",
            rgb: { r: 0, g: 255, b: 255 }
          },
          red: {
            alternativeKeywords: [],
            keyword: "red",
            hex: "#ff0000",
            rgb: { r: 255, g: 0, b: 0 }
          },
        },
      );
    });

    test("rejects duplicate keywords, after normalization", () => {
      const data = [
        { keyword: "cyan", hex: "#00ffff", alternativeKeywords: ["  RED   "] },
        { keyword: "red", hex: "#ff0000" },
        { keyword: "cyan", hex: "#00fffe" },
      ];

      expect(() => loadColors(data))
        .toThrow("found duplicate keywords and/or alternativeKeywords: 'red,cyan'");
    });

    test("rejects duplicate hexes, after normalization", () => {
      const data = [
        { keyword: "cyan", hex: "#00ffff" },
        { keyword: "red", hex: "#ff0000" },
        { keyword: "red", hex: "#FF0000" },
        { keyword: "cyan", hex: "  #00ffff  " },
      ];

      expect(() => loadColors(data))
        .toThrow("found duplicate hex values: '#00ffff,#ff0000'. Use alternativeKeywords instead.");
    });

    test("rejects objects with missing keyword", () => {
      const data = [
        { hex: "#00ffff" },
      ];

      expect(() => loadColors(data))
        .toThrow("missing keyword: '{\"hex\":\"#00ffff\"}'");
    });

    test("rejects objects with missing hex", () => {
      const data = [
        { keyword: "cyan" },
      ];

      expect(() => loadColors(data))
        .toThrow("missing hex: '{\"keyword\":\"cyan\"}'");
    });

    test("rejects unknown keys", () => {
      const data = [
        { keyword: "cyan", hex: "#00FFFF", name: "cyan", extraName: "aqua" },
      ];

      expect(() => loadColors(data))
        .toThrow("unknown keys 'name,extraName' in object '{\"keyword\":\"cyan\",\"hex\":\"#00FFFF\",\"name\":\"cyan\",\"extraName\":\"aqua\"}'");
    });

    test("real app data is valid", () => {
      const realData = loadColors(jsonData);
      expect(realData).toBeTruthy();
      expect(Object.values(realData).length).toBeGreaterThan(0);
    });
  });
});
