import { getNextAttacks, getUrgentAttack } from "ducks/replay/selectors";
import { Direction } from "types/core";
import { makeReplayState } from "../../utils/tetsimu/testUtils/makeReplayState";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep,
} from "../../utils/tetsimu/testUtils/makeReplayStep";

describe("selector", () => {
  describe("getNextAttacks", () => {
    it("should return amount of each next(hardDropSteps < nextNum)", () => {
      const actual = getNextAttacks(
        makeReplayState({
          replayInfo: {
            nextNum: 3,
          },

          replaySteps: [],
          step: 0,
        })
      );
      const expected = [0, 0, 0];
      expect(actual).toEqual(expected);
    });

    it("should return amount of each next(hardDropSteps >= nextNum)", () => {
      const actual = getNextAttacks(
        makeReplayState({
          replayInfo: {
            nextNum: 3,
          },

          replaySteps: [
            makeReplayHardDropStep(),
            makeReplayDropStep(Direction.Up, 1, 1),
            makeReplayHardDropStep({ cols: [1], line: 2 }),
            makeReplayHoldStep(),
            makeReplayHardDropStep(),
            makeReplayHardDropStep({ cols: [1], line: 3 }),
            makeReplayHardDropStep({ cols: [1], line: 4 }),
            makeReplayHardDropStep({ cols: [1], line: 5 }),
          ],
          step: 1,
        })
      );
      const expected = [0, 3, 4];
      expect(actual).toEqual(expected);
    });
  });

  describe("getUrgentAttack", () => {
    it("should return top of gargabe", () => {
      const actual = getUrgentAttack(
        makeReplayState({
          replaySteps: [
            makeReplayHardDropStep(),
            makeReplayHoldStep(),
            makeReplayDropStep(Direction.Up, 1, 1),
            makeReplayHardDropStep({ cols: [1, 2], line: 3 }),
          ],
          step: 1,
        })
      );

      expect(actual).toBe(3);
    });

    it("should return null", () => {
      const actual = getUrgentAttack(
        makeReplayState({
          replaySteps: [
            makeReplayHardDropStep(),
            makeReplayHoldStep(),
            makeReplayDropStep(Direction.Up, 1, 1),
            makeReplayHardDropStep({ cols: [1, 2], line: 3 }),
          ],
          step: 0,
        })
      );

      expect(actual).toBeNull();

      expect(
        getUrgentAttack(makeReplayState({ replaySteps: [], step: 0 }))
      ).toBeNull();
    });
  });
});
