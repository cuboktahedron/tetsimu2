import { getClippedEditNexts } from "ducks/edit/selectors";
import { NextNote } from "types/core";
import { makeNextNote } from "../../utils/tetsimu/testUtils/makeNextNote";

describe("EditSelector", () => {
  describe("getClippedEditNexts", () => {
    it("should return nexts of q7 pattern", () => {
      const actual = getClippedEditNexts([], 1);
      const expected: NextNote[] = [makeNextNote("", 7)];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of Iq6 pattern", () => {
      const actual = getClippedEditNexts([makeNextNote("I", 1)], 1);
      const expected: NextNote[] = [makeNextNote("I", 1), makeNextNote("", 6)];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of [JOT]p2[TZ]p2q3 pattern", () => {
      const actual = getClippedEditNexts(
        [makeNextNote("I", 1), makeNextNote("JLO", 3), makeNextNote("ST", 2)],
        3
      );
      const expected: NextNote[] = [
        makeNextNote("JLO", 2),
        makeNextNote("ST", 2),
        makeNextNote("", 3),
      ];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of q7 pattern", () => {
      const actual = getClippedEditNexts(
        [makeNextNote("", 100), makeNextNote("I", 1)],
        1
      );
      const expected: NextNote[] = [makeNextNote("", 7)];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of q2Iq4 pattern", () => {
      const actual = getClippedEditNexts(
        [makeNextNote("", 100), makeNextNote("I", 1)],
        98
      );
      const expected: NextNote[] = [
        makeNextNote("", 3),
        makeNextNote("I", 1),
        makeNextNote("", 3),
      ];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of q7 pattern", () => {
      const actual = getClippedEditNexts([makeNextNote("", 100)], 90);
      const expected: NextNote[] = [makeNextNote("", 7)];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of q7 pattern", () => {
      const actual = getClippedEditNexts([], 993);
      const expected: NextNote[] = [makeNextNote("", 7)];

      expect(actual).toEqual(expected);
    });
  });
});
