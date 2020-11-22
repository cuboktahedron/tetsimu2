import {
  changeTetsimuMode,
  editToSimuMode,
  simuToEditMode
} from "ducks/root/actions";
import {
  ChangeTetsimuModeAction,
  EditToSimuAction,
  RootActionsType,
  SimuToEditAction
} from "ducks/root/types";
import { Direction, Tetromino, TetsimuMode } from "types/core";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import { makeCurrent } from "../../utils/tetsimu/testUtils/makeCurrent";
import { makeEditState } from "../../utils/tetsimu/testUtils/makeEditState";
import { makeField } from "../../utils/tetsimu/testUtils/makeField";
import { makeHold } from "../../utils/tetsimu/testUtils/makeHold";
import { makeNextNote } from "../../utils/tetsimu/testUtils/makeNextNote";
import { makeSimuState } from "../../utils/tetsimu/testUtils/makeSimuState";

describe("rootModule", () => {
  describe("changeTetsimuMode", () => {
    it("should change tetsimu mode", () => {
      const actual = changeTetsimuMode(TetsimuMode.Simu);

      const expected: ChangeTetsimuModeAction = {
        type: RootActionsType.ChangeTetsimuMode,
        payload: {
          mode: TetsimuMode.Simu,
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("editToSimuMode", () => {
    it("should change mode and take over state", () => {
      const actual = editToSimuMode(
        makeEditState({
          field: makeField("IJLOSTZNNN"),
          hold: makeHold(Tetromino.I, false),
          tools: {
            isCellValueMultiSelection: false,
            nextBaseNo: 1,
            nextsPattern: "IJ, LOSTZIJ, ZTSOL",
            noOfCycle: 6,
            selectedCellValues: [Tetromino.NONE],
          },
        })
      );

      const expected: EditToSimuAction = {
        type: RootActionsType.EditToSimuMode,
        payload: {
          current: makeCurrent(Direction.UP, 4, 19, Tetromino.I),
          field: makeField("IJLOSTZNNN"),
          hold: makeHold(Tetromino.I, false),
          lastRoseUpColumn: -1,
          nexts: {
            settled: [
              Tetromino.J,
              Tetromino.L,
              Tetromino.O,
              Tetromino.S,
              Tetromino.T,
              Tetromino.Z,
              Tetromino.I,
              Tetromino.J,
              Tetromino.Z,
              Tetromino.T,
              Tetromino.S,
              Tetromino.O,
            ],
            unsettled: [makeNextNote("L", 1)],
            bag: makeNextNote("IJL", 3),
          },
          retryState: {
            bag: {
              candidates: [
                Tetromino.I,
                Tetromino.J,
                Tetromino.L,
                Tetromino.O,
                Tetromino.S,
                Tetromino.T,
                Tetromino.Z,
              ],
              take: 2,
            },
            field: makeField("IJLOSTZNNN"),
            hold: makeHold(Tetromino.I, false),
            lastRoseUpColumn: -1,
            seed: actual.payload.retryState.seed,
            unsettledNexts: new NextNotesInterpreter().interpret(
              "IJ, LOSTZIJ, ZTSOL"
            ),
          },
          seed: actual.payload.seed,
        },
      };

      expect(actual).toEqual(expected);
      expect(actual.payload.seed).not.toBe(actual.payload.retryState.seed);
    });
  });

  describe("simuToEditMode", () => {
    it("should change mode and take over state", () => {
      const actual = simuToEditMode(
        makeSimuState({
          config: {
            nextNum: 5,
          },
          current: makeCurrent(Direction.DOWN, 5, 8, Tetromino.I),
          field: makeField("IJLOSTZNNN"),
          hold: makeHold(Tetromino.I, false),
          nexts: {
            bag: makeNextNote("IJL", 3),
            settled: [
              Tetromino.J,
              Tetromino.L,
              Tetromino.O,
              Tetromino.S,
              Tetromino.T,
              Tetromino.Z,
              Tetromino.I,
              Tetromino.J,
              Tetromino.Z,
              Tetromino.T,
              Tetromino.S,
              Tetromino.O,
            ],
            unsettled: [makeNextNote("L", 1)],
          },
        })
      );

      const expected: SimuToEditAction = {
        type: RootActionsType.SimuToEditMode,
        payload: {
          field: makeField("IJLOSTZNNN"),
          hold: makeHold(Tetromino.I, false),
          nexts: {
            nextNotes: new NextNotesInterpreter().interpret("IJ, LOST"),
          },
          tools: {
            nextsPattern: "I J L O S T",
            noOfCycle: 6,
          },
        },
      };

      expect(actual).toEqual(expected);
    });
  });
});
