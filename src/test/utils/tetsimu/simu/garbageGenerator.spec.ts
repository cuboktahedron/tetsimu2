import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";
import GarbageGenerator from "utils/tetsimu/simu/garbageGenerator";

describe("garbageGenerator", () => {
  describe("next", () => {
    it("should not generate more", function () {
      const gen = new GarbageGenerator(new RandomNumberGenerator(1), 100, [
        {
          amount: -1,
          restStep: -1,
        },
      ]);

      const actual = gen.next();
      expect(actual).toEqual([
        {
          amount: -1,
          restStep: -1,
        },
      ]);
    });

    it("should generate garbages info", function () {
      const gen = new GarbageGenerator(new RandomNumberGenerator(1), 9990, []);

      const actual = gen.next();
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
