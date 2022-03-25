import '@testing-library/jest-dom';
import { loadData } from "../src/color";
import jsonData from "../src/data.json";

describe("color", () => {
  describe("render", () => {
    test("returns an array of valid colors", () => {
      const data = [
        {keyword: 'cyan', hex: '#00ffff', alternativeKeywords: ['aqua']},
        {keyword: 'red', hex: '#ff0000'},
      ]

      expect(loadData(data)).toEqual(
        [
          {
            "alternativeKeywords":  [
              "aqua",
            ],
            "keyword": "cyan",
            "hex": "#00ffff",
          },
          {
            "alternativeKeywords":  [],
            "keyword": "red",
            "hex": "#ff0000",
          },
        ]
      )
    })

    test("normalizes data", () => {
      const data = [
        {keyword: 'CYAN  ', hex: '#00FFFF', alternativeKeywords: ['   aqua ']},
        {keyword: '  red', hex: '  #ff0000  '},
      ]

      expect(loadData(data)).toEqual(
        [
          {
            "alternativeKeywords":  [
              "aqua",
            ],
            "keyword": "cyan",
            "hex": "#00ffff",
          },
          {
            "alternativeKeywords":  [],
            "keyword": "red",
            "hex": "#ff0000",
          },
        ]
      )
    })

    test("rejects duplicate keywords, after normalization", () => {
      const data = [
        {keyword: 'cyan', hex: '#00ffff', alternativeKeywords: ['  RED   ']},
        {keyword: 'red', hex: '#ff0000'},
        {keyword: 'cyan', hex: '#00fffe'}
      ]

      expect(() => loadData(data))
        .toThrow("found duplicate keywords and/or alternativeKeywords: 'red,cyan'");
    })

    test("rejects duplicate hexes, after normalization", () => {
      const data = [
        {keyword: 'cyan', hex: '#00ffff'},
        {keyword: 'red', hex: '#ff0000'},
        {keyword: 'red', hex: '#FF0000'},
        {keyword: 'cyan', hex: '  #00ffff  '}
      ]

      expect(() => loadData(data))
        .toThrow("found duplicate hex values: '#00ffff,#ff0000'. Use alternativeKeywords instead.");
    })

    test("rejects objects with missing keyword", () => {
      const data = [
        {hex: '#00ffff'},
      ]

      expect(() => loadData(data))
        .toThrow("missing keyword: '{\"hex\":\"#00ffff\"}'");
    })

    test("rejects objects with missing hex", () => {
      const data = [
        {keyword: 'cyan'},
      ]

      expect(() => loadData(data))
        .toThrow("missing hex: '{\"keyword\":\"cyan\"}'");
    })

    test("rejects unknown keys", () => {
      const data = [
        {keyword: 'cyan', hex: '#00FFFF', name: 'cyan', extraName: 'aqua'},
      ]

      expect(() => loadData(data))
        .toThrow("unknown keys 'name,extraName' in object '{\"keyword\":\"cyan\",\"hex\":\"#00FFFF\",\"name\":\"cyan\",\"extraName\":\"aqua\"}'");
    })

    test("real app data is valid", () => {
      const realData = loadData(jsonData)
      expect(Array.isArray(realData)).toBeTruthy()
      expect(realData.length).toBeGreaterThan(0)
    })
  })
});
