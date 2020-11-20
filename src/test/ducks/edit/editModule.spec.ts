import {
  buildUpField,
  changeNext,
  clearEdit,
  flipField,
  slideField,
} from "ducks/edit/actions";
import {
  BuildUpFieldAction,
  ChangeNextAction,
  ClearEditAction,
  EditActionsType,
  FlipFieldAction,
  SlideFieldAction,
} from "ducks/edit/types";
import { Tetromino } from "types/core";
import { makeField } from "../../utils/tetsimu/testUtils/makeField";
import { makeNextNote } from "../../utils/tetsimu/testUtils/makeNextNote";

describe("editModule", () => {
  describe("buildUpField", () => {
    it("should buildUp", () => {
      const actual = buildUpField(makeField("IJLOSTZNNN"), 1);

      const expected: BuildUpFieldAction = {
        type: EditActionsType.BuildUpField,
        payload: {
          // prettier-ignore
          field: makeField(
            "IJLOSTZNNN",
            "GGGGGGGGGG"
          ),
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should buildDown", () => {
      const actual = buildUpField(
        // prettier-ignore
        makeField(
          "IJLOSTZNNN",
          "TTTTTTTTTT"
        ),
        -1
      );

      const expected: BuildUpFieldAction = {
        type: EditActionsType.BuildUpField,
        payload: {
          field: makeField("IJLOSTZNNN"),
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("changeNext", () => {
    it("should change next '' -> 'I'", () => {
      const actual = changeNext([], 1, [Tetromino.I]);

      const expected: ChangeNextAction = {
        type: EditActionsType.ChangeNext,
        payload: {
          nextNotes: [makeNextNote("I", 1)],
          nextsPattern: "I",
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should change next to 'I' -> 'J'", () => {
      const actual = changeNext([makeNextNote("I", 1)], 1, [Tetromino.J]);

      const expected: ChangeNextAction = {
        type: EditActionsType.ChangeNext,
        payload: {
          nextNotes: [makeNextNote("J", 1)],
          nextsPattern: "J",
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should change next to 'I' -> 'I q2 J'", () => {
      const actual = changeNext([makeNextNote("I", 1)], 4, [Tetromino.J]);

      const expected: ChangeNextAction = {
        type: EditActionsType.ChangeNext,
        payload: {
          nextNotes: [
            makeNextNote("I", 1),
            makeNextNote("", 2),
            makeNextNote("J", 1),
          ],
          nextsPattern: "I q2 J",
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should change next to 'I' -> 'II'", () => {
      const actual = changeNext([makeNextNote("I", 1)], 2, [Tetromino.I]);

      const expected: ChangeNextAction = {
        type: EditActionsType.ChangeNext,
        payload: {
          nextNotes: [makeNextNote("I", 1), makeNextNote("I", 1)],
          nextsPattern: "I I",
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should change next to 'III' -> 'I q1 I'", () => {
      const actual = changeNext(
        [makeNextNote("I", 1), makeNextNote("I", 1), makeNextNote("I", 1)],
        2,
        []
      );

      const expected: ChangeNextAction = {
        type: EditActionsType.ChangeNext,
        payload: {
          nextNotes: [
            makeNextNote("I", 1),
            makeNextNote("", 1),
            makeNextNote("I", 1),
          ],
          nextsPattern: "I q1 I",
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should change next to '[IJ]' -> '[IJ]p2'", () => {
      const actual = changeNext([makeNextNote("IJ", 1)], 2, [
        Tetromino.J,
        Tetromino.I,
      ]);

      const expected: ChangeNextAction = {
        type: EditActionsType.ChangeNext,
        payload: {
          nextNotes: [makeNextNote("IJ", 2)],
          nextsPattern: "[IJ]p2",
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should change next to '[IJ]p2' -> '[IJ]p2 [IJ]'", () => {
      const actual = changeNext([makeNextNote("IJ", 2)], 3, [
        Tetromino.I,
        Tetromino.J,
      ]);

      const expected: ChangeNextAction = {
        type: EditActionsType.ChangeNext,
        payload: {
          nextNotes: [makeNextNote("IJ", 2), makeNextNote("IJ", 1)],
          nextsPattern: "[IJ]p2 [IJ]",
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should change next to 'p2 I' -> ''", () => {
      const actual = changeNext([makeNextNote("", 2)], 3, []);

      const expected: ChangeNextAction = {
        type: EditActionsType.ChangeNext,
        payload: {
          nextNotes: [],
          nextsPattern: "",
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("clearEdit", () => {
    it("should clear", () => {
      const actual = clearEdit();

      const expected: ClearEditAction = {
        type: EditActionsType.Clear,
        payload: {
          field: makeField(),
          hold: {
            canHold: true,
            type: Tetromino.NONE,
          },
          nexts: {
            nextNotes: [],
          },
          tools: {
            nextBaseNo: 1,
            nextsPattern: "",
          },
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("flipField", () => {
    it("should flip field horizontally", () => {
      const actual = flipField(
        // prettier-ignore
        makeField(
          "GGGZNSSNNJ",
          "OOZZSSTTTJ",
          "OOZIIIITJJ",
        )
      );

      const expected: FlipFieldAction = {
        type: EditActionsType.FlipField,
        payload: {
          // prettier-ignore
          field: makeField(
            "LNNZZNSGGG",
            "LTTTZZSSOO",
            "LLTIIIISOO"),
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("slide", () => {
    it("should slide left", () => {
      const actual = slideField(
        // prettier-ignore
        makeField(
          "NGGGGGGGGG",
          "NGGGGGGGGG",
          "NIJLOSTZGG",
        ),
        -1
      );

      const expected: SlideFieldAction = {
        type: EditActionsType.SlideField,
        payload: {
          // prettier-ignore
          field: makeField(
            "GGGGGGGGGN",
            "GGGGGGGGGN",
            "IJLOSTZGGN",
          ),
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should slide right", () => {
      const actual = slideField(
        // prettier-ignore
        makeField(
          "GGGGGGGGGN",
          "GGGGGGGGGN",
          "IJLOSTZGGN",
        ),
        1
      );

      const expected: SlideFieldAction = {
        type: EditActionsType.SlideField,
        payload: {
          // prettier-ignore
          field: makeField(
            "NGGGGGGGGG",
            "NGGGGGGGGG",
            "NIJLOSTZGG",
            ),
        },
      };

      expect(actual).toEqual(expected);
    });
  });
});
