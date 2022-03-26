import { range, unique } from "../src/array";

describe("array", () => {
  describe("range", () => {
    test("returns an array of numbers", () => {
      expect(range(0, 4)).toEqual([0, 1, 2, 3, 4]);
      expect(range(2, 4)).toEqual([2, 3, 4]);
      expect(range(5, 5)).toEqual([5]);
    });
  });

  describe("unique", () => {
    test("removes duplicates", () => {
      expect(unique([])).toEqual([]);
      expect(unique([5])).toEqual([5]);
      expect(unique([5, 5, 5, 5, 5])).toEqual([5]);
      expect(unique([2, 3, 4])).toEqual([2, 3, 4]);
      expect(unique([0, 0, 1, 0, 2, 2, 3, 4, 3, 0])).toEqual([0, 1, 2, 3, 4]);
    });
  });
});
