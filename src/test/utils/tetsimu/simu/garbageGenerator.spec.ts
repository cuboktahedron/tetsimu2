import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";
import GarbageGenerator from "utils/tetsimu/simu/garbageGenerator";

describe("garbageGenerator", () => {
  describe("next", () => {
    it("should not generate more", function () {
      const gen = new GarbageGenerator(
        new RandomNumberGenerator(1),
        {
          a1: 150,
          a2: 100,
          b1: 150,
          b2: 100,
        },
        []
      );

      const actual = gen.next(false);
      expect(actual).toEqual([]);
    });

    it("should generate garbages info", function () {
      const gen = new GarbageGenerator(
        new RandomNumberGenerator(1),
        {
          a1: 150,
          a2: 100,
          b1: 50,
          b2: 100,
        },
        []
      );

      const actual = gen.next(true);
      expect(actual).toEqual([
        {
          amount: 15,
          offset: 0,
          restStep: 4,
        },
        {
          amount: 15,
          offset: 0,
          restStep: 5,
        },
        {
          amount: 15,
          offset: 0,
          restStep: 5,
        },
      ]);
    });
  });
});
