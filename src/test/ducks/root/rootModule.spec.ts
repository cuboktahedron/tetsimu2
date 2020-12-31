import {
  changeTetsimuMode,
  editToSimuMode,
  replayToSimuMode,
  simuToEditMode,
  simuToReplayMode,
} from "ducks/root/actions";
import {
  ChangeTetsimuModeAction,
  EditToSimuAction,
  ReplayToSimuAction,
  RootActionsType,
  SimuToEditAction,
  SimuToReplayAction,
} from "ducks/root/types";
import { Direction, Tetromino, TetsimuMode } from "types/core";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import { makeCurrent } from "../../utils/tetsimu/testUtils/makeCurrent";
import { makeEditState } from "../../utils/tetsimu/testUtils/makeEditState";
import { makeField } from "../../utils/tetsimu/testUtils/makeField";
import { makeHold } from "../../utils/tetsimu/testUtils/makeHold";
import {
  makeNextNote,
  makeNextNotes,
} from "../../utils/tetsimu/testUtils/makeNextNote";
import { makeReplayState } from "../../utils/tetsimu/testUtils/makeReplayState";
import { makeReplayHoldStep } from "../../utils/tetsimu/testUtils/makeReplayStep";
import { makeSimuState } from "../../utils/tetsimu/testUtils/makeSimuState";
import { makeTetrominos } from "../../utils/tetsimu/testUtils/makeTetrominos";

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
            settled: makeTetrominos("JLOSTZIJZTSO"),
            unsettled: makeNextNotes("L"),
            bag: makeNextNote("IJL", 3),
          },
          retryState: {
            bag: {
              candidates: makeTetrominos("IJLOSTZ"),
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
            settled: makeTetrominos("JLOSTZIJZTSO"),
            unsettled: makeNextNotes("L"),
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

  describe("replayToSimuMode", () => {
    it("should change mode and take over state", () => {
      const historyBase = {
        field: [],
        hold: makeHold(Tetromino.I, false),
        isDead: false,
      };

      const actual = replayToSimuMode(
        makeReplayState({
          current: makeCurrent(Direction.DOWN, 4, 19, Tetromino.L),
          field: makeField("IJLOSTZNNN"),
          histories: [
            {
              ...historyBase,
              current: makeCurrent(Direction.UP, 4, 19, Tetromino.I),
              nexts: makeTetrominos("JLOSTZIZTSOLJIIJLOSTZ"),
              noOfCycle: 1,
            },
            {
              ...historyBase,
              current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
              nexts: makeTetrominos("LOSTZIZTSOLJIIJLOSTZ"),
              noOfCycle: 2,
            },
            {
              ...historyBase,
              current: makeCurrent(Direction.UP, 4, 19, Tetromino.L),
              nexts: makeTetrominos("OSTZIZTSOLJIIJLOSTZ"),
              noOfCycle: 3,
            },
          ],
          hold: makeHold(Tetromino.I, false),
          isDead: false,
          nexts: makeTetrominos("OSTZIZTSOLJIIJLOSTZ"),
          noOfCycle: 3,
          replayInfo: {
            nextNum: 12,
          },
        })
      );

      const expected: ReplayToSimuAction = {
        type: RootActionsType.ReplayToSimuMode,
        payload: {
          current: makeCurrent(Direction.UP, 4, 19, Tetromino.L),
          field: makeField("IJLOSTZNNN"),
          hold: makeHold(Tetromino.I, false),
          isDead: false,
          lastRoseUpColumn: -1,
          nexts: {
            bag: makeNextNote("", 0),
            nextNum: 12,
            settled: makeTetrominos("OSTZIZTSOLJI"),
            unsettled: [],
          },
          retryState: {
            bag: {
              candidates: makeTetrominos("ILOSTZ"),
              take: 6,
            },
            field: makeField("IJLOSTZNNN"),
            hold: makeHold(Tetromino.I, false),
            lastRoseUpColumn: -1,
            seed: actual.payload.retryState.seed,
            unsettledNexts: new NextNotesInterpreter().interpret(
              "LOSTZIZTSOLJI"
            ),
          },
          seed: actual.payload.seed,
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("simuToReplayMode", () => {
    it("should change mode and take over state", () => {
      const takeOfBag = 5;
      const actual = simuToReplayMode(
        makeSimuState({
          config: {
            nextNum: 12,
          },
          histories: [
            {
              currentType: Tetromino.T,
              field: makeField("IJLOSTZNNN"),
              hold: makeHold(Tetromino.I, false),
              isDead: false,
              lastRoseUpColumn: -1,
              nexts: {
                bag: makeNextNote("IJLTZ", takeOfBag),
                settled: [Tetromino.Z],
                unsettled: [],
              },
              replayNextStep: 12,
              replayStep: 1,
              seed: 1,
            },
          ],
          replayNexts: makeTetrominos("ZTSOLJIIJLOS"),
          replayNextStep: 12,
          replayStep: 1,
          replaySteps: [makeReplayHoldStep()],
        })
      );

      const expected: SimuToReplayAction = {
        type: RootActionsType.SimuToReplayMode,
        payload: {
          current: makeCurrent(Direction.UP, 4, 19, Tetromino.T),
          field: makeField("IJLOSTZNNN"),
          histories: [
            {
              current: makeCurrent(Direction.UP, 4, 19, Tetromino.T),
              field: makeField("IJLOSTZNNN"),
              hold: makeHold(Tetromino.I, false),
              isDead: false,
              nexts: makeTetrominos("ZTSOLJIIJLOS"),
              noOfCycle: 5,
            },
          ],
          hold: makeHold(Tetromino.I, false),
          isDead: false,
          nexts: makeTetrominos("ZTSOLJIIJLOS"),
          noOfCycle: 5,
          replayInfo: {
            nextNum: 12,
          },
          replaySteps: [makeReplayHoldStep()],
          step: 0,
        },
      };

      expect(actual).toEqual(expected);
    });
  });
});
