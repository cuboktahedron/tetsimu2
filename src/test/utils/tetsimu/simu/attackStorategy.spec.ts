import { SpinType } from "types/core";
import { Pytt2Strategy } from "utils/tetsimu/putt2Strategy";

describe("Pytt2Strategy", () => {
  const pytt2 = new Pytt2Strategy();

  describe("calculateAttack", () => {
    it("should return attack amount", () => {
      expect(pytt2.calculateAttack(0, SpinType.None, 0, false, false)).toBe(0);
      expect(pytt2.calculateAttack(1, SpinType.None, 0, false, false)).toBe(0);
      expect(pytt2.calculateAttack(2, SpinType.None, 0, false, false)).toBe(1);
      expect(pytt2.calculateAttack(3, SpinType.None, 0, false, false)).toBe(2);
      expect(pytt2.calculateAttack(4, SpinType.None, 0, false, false)).toBe(4);
      expect(pytt2.calculateAttack(1, SpinType.Mini, 0, false, false)).toBe(0);
      expect(pytt2.calculateAttack(2, SpinType.Mini, 0, false, false)).toBe(1);
      expect(pytt2.calculateAttack(1, SpinType.Spin, 0, false, false)).toBe(2);
      expect(pytt2.calculateAttack(2, SpinType.Spin, 0, false, false)).toBe(4);
      expect(pytt2.calculateAttack(3, SpinType.Spin, 0, false, false)).toBe(6);

      // btb patterns
      expect(pytt2.calculateAttack(4, SpinType.None, 0, true, false)).toBe(5);
      expect(pytt2.calculateAttack(1, SpinType.Mini, 0, true, false)).toBe(1);
      expect(pytt2.calculateAttack(2, SpinType.Mini, 0, true, false)).toBe(2);
      expect(pytt2.calculateAttack(1, SpinType.Spin, 0, true, false)).toBe(3);
      expect(pytt2.calculateAttack(2, SpinType.Spin, 0, true, false)).toBe(5);
      expect(pytt2.calculateAttack(3, SpinType.Spin, 0, true, false)).toBe(7);

      // ren
      expect(pytt2.calculateAttack(1, SpinType.None, 0, false, false)).toBe(0);
      expect(pytt2.calculateAttack(1, SpinType.None, 1, false, false)).toBe(0);
      expect(pytt2.calculateAttack(1, SpinType.None, 2, false, false)).toBe(1);
      expect(pytt2.calculateAttack(1, SpinType.None, 3, false, false)).toBe(1);
      expect(pytt2.calculateAttack(1, SpinType.None, 4, false, false)).toBe(2);
      expect(pytt2.calculateAttack(1, SpinType.None, 5, false, false)).toBe(2);
      expect(pytt2.calculateAttack(1, SpinType.None, 6, false, false)).toBe(3);
      expect(pytt2.calculateAttack(1, SpinType.None, 7, false, false)).toBe(3);
      expect(pytt2.calculateAttack(1, SpinType.None, 8, false, false)).toBe(4);
      expect(pytt2.calculateAttack(1, SpinType.None, 9, false, false)).toBe(4);
      expect(pytt2.calculateAttack(1, SpinType.None, 10, false, false)).toBe(4);
      expect(pytt2.calculateAttack(1, SpinType.None, 11, false, false)).toBe(5);
      expect(pytt2.calculateAttack(1, SpinType.None, 12, false, false)).toBe(5);

      // perfect clear
      expect(pytt2.calculateAttack(1, SpinType.None, 0, false, true)).toBe(10);

      // irregular pattern
      expect(pytt2.calculateAttack(5, SpinType.None, 0, false, false)).toBe(4);
    });

    it("should return attack amount with multiple factors", () => {
      // btbTsd + 3ren
      expect(pytt2.calculateAttack(2, SpinType.Spin, 3, true, false)).toBe(6);

      // pc is always 10
      expect(pytt2.calculateAttack(3, SpinType.Spin, 10, true, true)).toBe(10);
    });
  });
});
