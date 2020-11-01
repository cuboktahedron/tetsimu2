import { buildUpField, clearEdit } from "ducks/edit/actions";
import {
  BuildUpFieldAction,
  ClearEditAction,
  EditActionsType,
} from "ducks/edit/types";
import { Tetromino } from "types/core";
import { makeField } from "../../utils/tetsimu/testUtils/makeField";

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
});
