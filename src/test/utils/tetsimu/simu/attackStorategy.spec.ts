import { AttackType, SpinType } from "types/core";
import { Pytt2Strategy } from "utils/tetsimu/putt2Strategy";

describe("Pytt2Strategy", () => {
  const pytt2 = new Pytt2Strategy();

  describe("calculateAttack", () => {
    it("should return attack amount", () => {
      expect(pytt2.calculateAttack(0, SpinType.None, 0, false, false)).toEqual({
        attack: 0,
        attackTypes: [],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 0, false, false)).toEqual({
        attack: 0,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(2, SpinType.None, 0, false, false)).toEqual({
        attack: 1,
        attackTypes: [AttackType.Double],
      });
      expect(pytt2.calculateAttack(3, SpinType.None, 0, false, false)).toEqual({
        attack: 2,
        attackTypes: [AttackType.Triple],
      });
      expect(pytt2.calculateAttack(4, SpinType.None, 0, false, false)).toEqual({
        attack: 4,
        attackTypes: [AttackType.Tetris],
      });
      expect(pytt2.calculateAttack(1, SpinType.Mini, 0, false, false)).toEqual({
        attack: 0,
        attackTypes: [AttackType.Tsm],
      });
      expect(pytt2.calculateAttack(2, SpinType.Mini, 0, false, false)).toEqual({
        attack: 1,
        attackTypes: [AttackType.Tsdm],
      });
      expect(pytt2.calculateAttack(1, SpinType.Spin, 0, false, false)).toEqual({
        attack: 2,
        attackTypes: [AttackType.Tss],
      });
      expect(pytt2.calculateAttack(2, SpinType.Spin, 0, false, false)).toEqual({
        attack: 4,
        attackTypes: [AttackType.Tsd],
      });
      expect(pytt2.calculateAttack(3, SpinType.Spin, 0, false, false)).toEqual({
        attack: 6,
        attackTypes: [AttackType.Tst],
      });

      // btb patterns
      expect(pytt2.calculateAttack(4, SpinType.None, 0, true, false)).toEqual({
        attack: 5,
        attackTypes: [AttackType.BtbTetris],
      });
      expect(pytt2.calculateAttack(1, SpinType.Mini, 0, true, false)).toEqual({
        attack: 1,
        attackTypes: [AttackType.BtbTsm],
      });
      expect(pytt2.calculateAttack(2, SpinType.Mini, 0, true, false)).toEqual({
        attack: 2,
        attackTypes: [AttackType.BtbTsdm],
      });
      expect(pytt2.calculateAttack(1, SpinType.Spin, 0, true, false)).toEqual({
        attack: 3,
        attackTypes: [AttackType.BtbTss],
      });
      expect(pytt2.calculateAttack(2, SpinType.Spin, 0, true, false)).toEqual({
        attack: 5,
        attackTypes: [AttackType.BtbTsd],
      });
      expect(pytt2.calculateAttack(3, SpinType.Spin, 0, true, false)).toEqual({
        attack: 7,
        attackTypes: [AttackType.BtbTst],
      });

      // ren
      expect(pytt2.calculateAttack(1, SpinType.None, 0, false, false)).toEqual({
        attack: 0,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 1, false, false)).toEqual({
        attack: 0,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 2, false, false)).toEqual({
        attack: 1,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 3, false, false)).toEqual({
        attack: 1,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 4, false, false)).toEqual({
        attack: 2,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 5, false, false)).toEqual({
        attack: 2,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 6, false, false)).toEqual({
        attack: 3,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 7, false, false)).toEqual({
        attack: 3,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 8, false, false)).toEqual({
        attack: 4,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 9, false, false)).toEqual({
        attack: 4,
        attackTypes: [AttackType.Single],
      });
      expect(pytt2.calculateAttack(1, SpinType.None, 10, false, false)).toEqual(
        {
          attack: 4,
          attackTypes: [AttackType.Single],
        }
      );
      expect(pytt2.calculateAttack(1, SpinType.None, 11, false, false)).toEqual(
        {
          attack: 5,
          attackTypes: [AttackType.Single],
        }
      );
      expect(pytt2.calculateAttack(1, SpinType.None, 12, false, false)).toEqual(
        {
          attack: 5,
          attackTypes: [AttackType.Single],
        }
      );

      // perfect clear
      expect(pytt2.calculateAttack(1, SpinType.None, 0, false, true)).toEqual({
        attack: 10,
        attackTypes: [AttackType.PerfectClear, AttackType.Single],
      });

      // irregular pattern
      expect(pytt2.calculateAttack(5, SpinType.None, 0, false, false)).toEqual({
        attack: 4,
        attackTypes: [AttackType.Tetris],
      });
    });

    it("should return attack amount with multiple factors", () => {
      // btbTsd + 3ren
      const actual1 = pytt2.calculateAttack(2, SpinType.Spin, 3, true, false);

      expect(actual1.attack).toBe(6);
      expect(actual1.attackTypes).toEqual([AttackType.BtbTsd]);

      // pc is always 10
      const actual2 = pytt2.calculateAttack(3, SpinType.Spin, 10, true, true);
      expect(actual2.attack).toBe(10);
      expect(actual2.attackTypes.length).toBe(2);
      expect(actual2.attackTypes).toContain(AttackType.BtbTst);
      expect(actual2.attackTypes).toContain(AttackType.PerfectClear);
    });
  });
});
