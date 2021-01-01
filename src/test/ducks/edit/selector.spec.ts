import { getClippedEditNexts } from "ducks/edit/selectors";
import { FieldCellValue, NextNote } from "types/core";
import { makeEditState } from "../../utils/tetsimu/testUtils/makeEditState";
import { makeNextNote } from "../../utils/tetsimu/testUtils/makeNextNote";

describe("EditSelector", () => {
  describe("getClippedEditNexts", () => {
    it("should return nexts of q7 pattern", () => {
      const state = makeEditState({});
      const actual = getClippedEditNexts(state);
      const expected: NextNote[] = [makeNextNote("", 7)];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of Iq6 pattern", () => {
      const state = makeEditState({
        nexts: {
          nextNotes: [makeNextNote("I", 1)],
        },
      });
      const actual = getClippedEditNexts(state);
      const expected: NextNote[] = [makeNextNote("I", 1), makeNextNote("", 6)];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of [JOT]p2[TZ]p2q3 pattern", () => {
      const state = makeEditState({
        nexts: {
          nextNotes: [
            makeNextNote("I", 1),
            makeNextNote("JLO", 3),
            makeNextNote("ST", 2),
          ],
        },
        tools: {
          isCellValueMultiSelection: false,
          nextBaseNo: 3,
          nextsPattern: "",
          noOfCycle: 1,
          selectedCellValues: [FieldCellValue.None],
        },
      });
      const actual = getClippedEditNexts(state);
      const expected: NextNote[] = [
        makeNextNote("JLO", 2),
        makeNextNote("ST", 2),
        makeNextNote("", 3),
      ];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of q7 pattern", () => {
      const state = makeEditState({
        nexts: {
          nextNotes: [makeNextNote("", 100), makeNextNote("I", 1)],
        },
      });
      const actual = getClippedEditNexts(state);
      const expected: NextNote[] = [makeNextNote("", 7)];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of q2Iq4 pattern", () => {
      const state = makeEditState({
        nexts: {
          nextNotes: [makeNextNote("", 100), makeNextNote("I", 1)],
        },
        tools: {
          isCellValueMultiSelection: false,
          nextBaseNo: 98,
          nextsPattern: "",
          noOfCycle: 1,
          selectedCellValues: [FieldCellValue.None],
        },
      });
      const actual = getClippedEditNexts(state);
      const expected: NextNote[] = [
        makeNextNote("", 3),
        makeNextNote("I", 1),
        makeNextNote("", 3),
      ];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of q7 pattern", () => {
      const state = makeEditState({
        nexts: {
          nextNotes: [makeNextNote("", 100)],
        },
        tools: {
          isCellValueMultiSelection: false,
          nextBaseNo: 90,
          nextsPattern: "",
          noOfCycle: 1,
          selectedCellValues: [FieldCellValue.None],
        },
      });
      const actual = getClippedEditNexts(state);
      const expected: NextNote[] = [makeNextNote("", 7)];

      expect(actual).toEqual(expected);
    });

    it("should return nexts of q7 pattern", () => {
      const state = makeEditState({
        nexts: {
          nextNotes: [],
        },
        tools: {
          isCellValueMultiSelection: false,
          nextBaseNo: 993,
          nextsPattern: "",
          noOfCycle: 1,
          selectedCellValues: [FieldCellValue.None],
        },
      });
      const actual = getClippedEditNexts(state);
      const expected: NextNote[] = [makeNextNote("", 7)];

      expect(actual).toEqual(expected);
    });
  });
});
