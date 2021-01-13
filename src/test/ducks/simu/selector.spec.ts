import { getNextAttacks, getUrgentAttack } from "ducks/simu/selectors";
import { makeGarbage } from "../../utils/tetsimu/testUtils/makeGarbage";
import { makeSimuState } from "../../utils/tetsimu/testUtils/makeSimuState";

describe("selector", () => {
  describe("getNextAttacks", () => {
    it("should return amount of each next(steps < nextNum)", () => {
      const actual = getNextAttacks(
        makeSimuState({
          config: {
            nextNum: 8,
          },
          garbages: [makeGarbage(0, 3), makeGarbage(5, 2)],
        })
      );

      const expected = [0, 0, 0, 0, 2, 0, 0, 0];
      expect(actual).toEqual(expected);
    });

    it("should return amount of each next(step >= nextNum)", () => {
      const actual = getNextAttacks(
        makeSimuState({
          config: {
            nextNum: 4,
          },
          garbages: [makeGarbage(1, 3), makeGarbage(4, 2)],
        })
      );

      const expected = [3, 0, 0, 0];
      expect(actual).toEqual(expected);
    });
  });

  describe("getUrgentAttack", () => {
    it("should return top of gargabe", () => {
      const actual = getUrgentAttack(
        makeSimuState({ garbages: [makeGarbage(0, 5)] })
      );

      expect(actual).toBe(5);
    });

    it("should return null", () => {
      expect(
        getUrgentAttack(makeSimuState({ garbages: [makeGarbage(1, 5)] }))
      ).toBeNull();

      expect(getUrgentAttack(makeSimuState({ garbages: [] }))).toBeNull();

      expect(
        getUrgentAttack(makeSimuState({ garbages: [makeGarbage(0, 0)] }))
      ).toBeNull();
    });
  });
});
