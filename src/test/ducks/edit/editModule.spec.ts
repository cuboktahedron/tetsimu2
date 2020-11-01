import { buildUpField } from "ducks/edit/actions";
import { BuildUpFieldAction, EditActionsType } from "ducks/edit/types";
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
            "GGGGGGGGGG"),
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should buildDown", () => {
      const actual = buildUpField(
        // prettier-ignore
        makeField(
          "IJLOSTZNNN",
          "TTTTTTTTTT"),
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
});
