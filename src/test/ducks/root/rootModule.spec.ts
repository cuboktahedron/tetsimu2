import {
  changeTetsimuMode,
  editToSimuMode,
  initializeApp,
  replayToSimuMode,
  simuToEditMode,
  simuToReplayMode,
} from "ducks/root/actions";
import {
  ChangeTetsimuModeAction,
  EditToSimuAction,
  InitializeAppAction,
  ReplayToSimuAction,
  RootActionsType,
  SimuToEditAction,
  SimuToReplayAction,
} from "ducks/root/types";
import { initialReplayState, ReplayState } from "stores/ReplayState";
import { initialRootState } from "stores/RootState";
import { initialSimuState, SimuState } from "stores/SimuState";
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
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep,
} from "../../utils/tetsimu/testUtils/makeReplayStep";
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
            selectedCellValues: [Tetromino.None],
          },
        })
      );

      const expected: EditToSimuAction = {
        type: RootActionsType.EditToSimuMode,
        payload: {
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
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
          current: makeCurrent(Direction.Down, 5, 8, Tetromino.I),
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
          current: makeCurrent(Direction.Down, 4, 19, Tetromino.L),
          field: makeField("IJLOSTZNNN"),
          histories: [
            {
              ...historyBase,
              current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
              nexts: makeTetrominos("JLOSTZIZTSOLJIIJLOSTZ"),
              noOfCycle: 1,
            },
            {
              ...historyBase,
              current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
              nexts: makeTetrominos("LOSTZIZTSOLJIIJLOSTZ"),
              noOfCycle: 2,
            },
            {
              ...historyBase,
              current: makeCurrent(Direction.Up, 4, 19, Tetromino.L),
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
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.L),
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
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.T),
          field: makeField("IJLOSTZNNN"),
          histories: [
            {
              current: makeCurrent(Direction.Up, 4, 19, Tetromino.T),
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

  describe("initializeApp", () => {
    it("should initialize replay state", () => {
      const actual = initializeApp(
        "f=EjRWeAA_&ns=sOZa0vPY&ss=ALAAgB8_&h=b&nc=3&nn=7&m=1&v=2.00",
        initialRootState
      );

      const expectedReplay: ReplayState = {
        ...initialReplayState,
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.S),
        field: makeField("IJLOSTZGNN"),
        hold: makeHold(Tetromino.S, false),
        histories: [
          {
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.S),
            field: makeField("IJLOSTZGNN"),
            hold: makeHold(Tetromino.S, false),
            isDead: false,
            nexts: makeTetrominos("OITLILJTOSZIZL"),
            noOfCycle: 4,
          },
        ],
        isDead: false,
        nexts: makeTetrominos("OITLILJTOSZIZL"),
        noOfCycle: 4,
        replayInfo: {
          nextNum: 7,
        },
        replaySteps: [
          makeReplayDropStep(Direction.Up, 1, 1),
          makeReplayHardDropStep(),
          makeReplayDropStep(Direction.Up, 8, 0),
          makeReplayHardDropStep(),
          makeReplayHoldStep(),
        ],
        step: 0,
      };

      const expected: InitializeAppAction = {
        type: RootActionsType.InitializeApp,
        payload: {
          ...initialRootState,
          replay: { ...expectedReplay },
          mode: TetsimuMode.Replay,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should initialize simu state with np", () => {
      const actual = initializeApp(
        "f=EjRWeAA_&np=I_J.p1LOSIJLOSTq1I&h=9&nc=3&nn=5&m=0&v=2.00",
        initialRootState
      );
      const expectedSimu: SimuState = {
        ...initialSimuState,
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
        field: makeField("IJLOSTZGNN"),
        hold: makeHold(Tetromino.O, false),
        histories: [
          {
            currentType: Tetromino.I,
            field: makeField("IJLOSTZGNN"),
            hold: makeHold(Tetromino.O, false),
            isDead: false,
            lastRoseUpColumn: -1,
            nexts: {
              bag: makeNextNote("JLOSTZ", 6),
              settled: makeTetrominos("JLOSIJLOSTZI"),
              unsettled: [],
            },
            replayNextStep: 12,
            replayStep: 0,
            seed: actual.payload.simu.seed,
          },
        ],
        isDead: false,
        lastRoseUpColumn: -1,
        nexts: {
          bag: makeNextNote("JLOSTZ", 6),
          settled: makeTetrominos("JLOSIJLOSTZI"),
          unsettled: [],
        },
        replayNexts: makeTetrominos("JLOSIJLOSTZI"),
        replayNextStep: 12,
        replayStep: 0,
        replaySteps: [],
        retryState: {
          bag: makeNextNote("IJLOSTZ", 5),
          field: makeField("IJLOSTZGNN"),
          hold: makeHold(Tetromino.O, false),
          lastRoseUpColumn: -1,
          seed: actual.payload.simu.retryState.seed,
          unsettledNexts: makeNextNotes("I[J]p1LOS IJLOSTq1 I"),
        },
        seed: actual.payload.simu.seed,
        step: 0,
      };

      const expected: InitializeAppAction = {
        type: RootActionsType.InitializeApp,
        payload: {
          ...initialRootState,
          simu: { ...expectedSimu },
          mode: TetsimuMode.Simu,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should initialize simu state with ns", () => {
      const actual = initializeApp("ns=Kcu5TlwA&m=0&v=2.00", initialRootState);
      const expectedSimu: SimuState = {
        ...initialSimuState,
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.None, true),
        histories: [
          {
            currentType: Tetromino.I,
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.None, true),
            isDead: false,
            lastRoseUpColumn: -1,
            nexts: {
              bag: makeNextNote("Z", 1),
              settled: makeTetrominos("JLOSTZIJLOST"),
              unsettled: [],
            },
            replayNextStep: 12,
            replayStep: 0,
            seed: actual.payload.simu.seed,
          },
        ],
        isDead: false,
        lastRoseUpColumn: -1,
        nexts: {
          bag: makeNextNote("Z", 1),
          settled: makeTetrominos("JLOSTZIJLOST"),
          unsettled: [],
        },
        replayNexts: makeTetrominos("JLOSTZIJLOST"),
        replayNextStep: 12,
        replayStep: 0,
        replaySteps: [],
        retryState: {
          bag: makeNextNote("IJLOSTZ", 7),
          field: makeField("NNNNNNNNNN"),
          hold: makeHold(Tetromino.None, true),
          lastRoseUpColumn: -1,
          seed: actual.payload.simu.retryState.seed,
          unsettledNexts: makeNextNotes("IJLOSTZIJLOST"),
        },
        seed: actual.payload.simu.seed,
        step: 0,
      };

      const expected: InitializeAppAction = {
        type: RootActionsType.InitializeApp,
        payload: {
          ...initialRootState,
          simu: { ...expectedSimu },
          mode: TetsimuMode.Simu,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should initialize simu state with s + nc=0", () => {
      const actual1 = initializeApp("s=1&nc=0&m=0&v=2.00", initialRootState);
      const actual2 = initializeApp("s=1&nc=0&m=0&v=2.00", initialRootState);
      const actual3 = initializeApp("s=2&nc=0&m=0&v=2.00", initialRootState);

      expect(actual1).toEqual(actual2);
      expect(actual1.payload.simu.nexts).not.toEqual(
        actual3.payload.simu.nexts
      );
      expect(actual1.payload.simu.retryState).not.toEqual(
        actual3.payload.simu.retryState
      );
    });
  });
});
