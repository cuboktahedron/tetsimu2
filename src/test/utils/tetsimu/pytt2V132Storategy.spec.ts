import { AttackType, SpinType } from "types/core";
import { Pytt2V132Strategy } from "utils/pytt2V132Strategy";

describe("Pytt2V132Strategy", () => {
  const pytt2 = new Pytt2V132Strategy();

  describe("calculateAttack", () => {
    it("should return attack amount", () => {
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
          attack: 4,
          attackTypes: [AttackType.Single],
        }
      );
      expect(pytt2.calculateAttack(1, SpinType.None, 12, false, false)).toEqual(
        {
          attack: 4,
          attackTypes: [AttackType.Single],
        }
      );
      expect(pytt2.calculateAttack(1, SpinType.None, 13, false, false)).toEqual(
        {
          attack: 5,
          attackTypes: [AttackType.Single],
        }
      );
      expect(pytt2.calculateAttack(1, SpinType.None, 14, false, false)).toEqual(
        {
          attack: 5,
          attackTypes: [AttackType.Single],
        }
      );
    });
  });
});
