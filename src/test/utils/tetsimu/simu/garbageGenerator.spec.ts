import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";
import GarbageGenerator from "utils/tetsimu/simu/garbageGenerator";

describe("garbageGenerator", () => {
  describe("next", () => {
    it("should not generate more", function () {
      const gen = new GarbageGenerator(new RandomNumberGenerator(1), 100, []);

      const actual = gen.next(false);
      expect(actual).toEqual([]);
    });

    it("should generate garbages info", function () {
      const gen = new GarbageGenerator(new RandomNumberGenerator(1), 9990, []);

      const actual = gen.next(true);
      expect(actual).toEqual([
        {
          amount: 5,
          restStep: 4,
        },
        {
          amount: 5,
          restStep: 5,
        },
        {
          amount: 5,
          restStep: 5,
        },
      ]);
    });
  });
});
