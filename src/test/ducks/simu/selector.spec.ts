import {
  getNextAttacks,
  getStats,
  getUrgentAttack
} from "ducks/simu/selectors";
import { AttackType, Direction, PlayStats } from "types/core";
import { makeGarbage } from "../../utils/tetsimu/testUtils/makeGarbage";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep
} from "../../utils/tetsimu/testUtils/makeReplayStep";
import { makeSimuHistory } from "../../utils/tetsimu/testUtils/makeSimuHistory";
import { makeSimuState } from "../../utils/tetsimu/testUtils/makeSimuState";

describe("selector", () => {
  describe("getNextAttacks", () => {
    it("should return amount of each next(steps < nextNum)", () => {
      const actual = getNextAttacks([makeGarbage(0, 3), makeGarbage(5, 2)], 8);

      const expected = [0, 0, 0, 0, 2, 0, 0, 0];
      expect(actual).toEqual(expected);
    });

    it("should return amount of each next(step >= nextNum)", () => {
      const actual = getNextAttacks([makeGarbage(1, 3), makeGarbage(4, 2)], 4);

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

  describe("getStats", () => {
    const statsBase: PlayStats = {
      [AttackType.Single]: 0,
      [AttackType.Double]: 0,
      [AttackType.Triple]: 0,
      [AttackType.Tetris]: 0,
      [AttackType.Tsm]: 0,
      [AttackType.Tsdm]: 0,
      [AttackType.Tss]: 0,
      [AttackType.Tsd]: 0,
      [AttackType.Tst]: 0,
      [AttackType.BtbTetris]: 0,
      [AttackType.BtbTsm]: 0,
      [AttackType.BtbTsdm]: 0,
      [AttackType.BtbTss]: 0,
      [AttackType.BtbTsd]: 0,
      [AttackType.BtbTst]: 0,
      [AttackType.PerfectClear]: 0,
      attacks: [],
      drops: 0,
      lines: 0,
      maxRen: 0,
      totalBtb: 0,
      totalHold: 0,
    };

    it("should count drop", () => {
      const actual = getStats(
        makeSimuState({
          histories: [
            makeSimuHistory({ replayStep: 0 }),
            makeSimuHistory({ replayStep: 2 }),
          ],
          replayStep: 2,
          replaySteps: [
            makeReplayDropStep(Direction.Up, 0, 0),
            makeReplayHardDropStep(),
          ],
          step: 1,
        })
      );

      const expected = {
        ...statsBase,
        attacks: [0, 0],
        drops: 1,
      };
      expect(actual).toEqual(expected);
    });

    test.each([
      [AttackType.Single, 1, 0],
      [AttackType.Double, 2, 1],
      [AttackType.Triple, 3, 2],
      [AttackType.Tetris, 4, 4],
      [AttackType.Tsm, 1, 0],
      [AttackType.Tsdm, 2, 1],
      [AttackType.Tss, 1, 2],
      [AttackType.Tsd, 2, 4],
      [AttackType.Tst, 3, 6],
      [AttackType.BtbTetris, 4, 5],
      [AttackType.BtbTsm, 1, 1],
      [AttackType.BtbTsdm, 2, 2],
      [AttackType.BtbTss, 1, 3],
      [AttackType.BtbTsd, 2, 5],
      [AttackType.BtbTst, 3, 7],
    ])("should count attack(%i)", (attackType, line, attack) => {
      const totalBtb =
        AttackType.BtbTetris <= attackType && attackType <= AttackType.BtbTst
          ? 1
          : 0;
      const actual = getStats(
        makeSimuState({
          histories: [
            makeSimuHistory({ replayStep: 0 }),
            makeSimuHistory({
              attackTypes: [attackType],
              replayStep: 2,
            }),
          ],
          replayStep: 2,
          replaySteps: [
            makeReplayDropStep(Direction.Up, 0, 0),
            makeReplayHardDropStep(),
          ],
          step: 1,
        })
      );

      const expected = {
        ...statsBase,
        [attackType]: 1,
        attacks: [0, attack],
        drops: 1,
        lines: line,
        totalBtb,
      };
      expect(actual).toEqual(expected);
    });

    it("should count perfect clear", () => {
      const actual = getStats(
        makeSimuState({
          histories: [
            makeSimuHistory({ replayStep: 0 }),
            makeSimuHistory({
              attackTypes: [AttackType.PerfectClear, AttackType.BtbTsd],
              replayStep: 2,
            }),
          ],
          replayStep: 2,
          replaySteps: [
            makeReplayDropStep(Direction.Up, 0, 0),
            makeReplayHardDropStep(),
          ],
          step: 1,
        })
      );

      const expected = {
        ...statsBase,
        [AttackType.BtbTsd]: 1,
        [AttackType.PerfectClear]: 1,
        attacks: [0, 10],
        drops: 1,
        lines: 2,
        totalBtb: 1,
      };
      expect(actual).toEqual(expected);
    });

    it("should count hold", () => {
      const actual = getStats(
        makeSimuState({
          histories: [
            makeSimuHistory({ replayStep: 0 }),
            makeSimuHistory({ replayStep: 1 }),
          ],
          replayStep: 1,
          replaySteps: [makeReplayHoldStep()],
          step: 1,
        })
      );

      const expected = {
        ...statsBase,
        attacks: [0],
        totalHold: 1,
      };
      expect(actual).toEqual(expected);
    });

    it("should count garbage", () => {
      const actual = getStats(
        makeSimuState({
          histories: [
            makeSimuHistory({ replayStep: 0 }),
            makeSimuHistory({
              replayStep: 2,
              garbages: [makeGarbage(0, 3), makeGarbage(1, 5)],
            }),
            makeSimuHistory({
              replayStep: 4,
              garbages: [makeGarbage(0, 5)],
            }),
          ],
          replayStep: 4,
          replaySteps: [
            makeReplayDropStep(Direction.Up, 0, 0),
            makeReplayHardDropStep({ cols: [1, 2], line: 3 }),
            makeReplayDropStep(Direction.Up, 0, 0),
            makeReplayHardDropStep({ cols: [1], line: 5 }),
          ],
          step: 2,
        })
      );

      const expected = {
        ...statsBase,
        attacks: [0, 0, 0],
        drops: 2,
      };
      expect(actual).toEqual(expected);
    });

    it("should count ren", () => {
      const actual = getStats(
        makeSimuState({
          histories: [
            makeSimuHistory({ replayStep: 0, ren: 1 }),
            makeSimuHistory({ replayStep: 2, ren: 2 }),
            makeSimuHistory({ replayStep: 4, ren: -1 }),
          ],
          replayStep: 4,
          replaySteps: [
            makeReplayDropStep(Direction.Up, 0, 0),
            makeReplayHardDropStep(),
            makeReplayDropStep(Direction.Up, 0, 0),
            makeReplayHardDropStep(),
          ],
          step: 2,
        })
      );

      const expected = {
        ...statsBase,
        attacks: [0, 1, 0],
        drops: 2,
        maxRen: 2,
      };
      expect(actual).toEqual(expected);
    });
  });
});
