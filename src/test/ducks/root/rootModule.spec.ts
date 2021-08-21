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
import { EditState, initialEditState } from "stores/EditState";
import { initialReplayState, ReplayState } from "stores/ReplayState";
import { initialRootState } from "stores/RootState";
import { initialSimuState, SimuState } from "stores/SimuState";
import {
  AttackType,
  BtbState,
  Direction,
  SpinType,
  Tetromino,
  TetsimuMode,
} from "types/core";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import { makeCurrent } from "../../utils/tetsimu/testUtils/makeCurrent";
import { makeEditState } from "../../utils/tetsimu/testUtils/makeEditState";
import { makeField } from "../../utils/tetsimu/testUtils/makeField";
import { makeGarbage } from "../../utils/tetsimu/testUtils/makeGarbage";
import { makeHold } from "../../utils/tetsimu/testUtils/makeHold";
import {
  makeNextNote,
  makeNextNotes,
  makeTerminalNote,
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
          garbages: [],
          hold: makeHold(Tetromino.I, false),
          lastRoseUpColumn: -1,
          nexts: {
            settled: makeTetrominos("JLOSTZIJZTSO"),
            unsettled: makeNextNotes("L"),
            bag: makeNextNote("IJL", 3),
          },
          retryState: {
            attackTypes: [],
            bag: {
              candidates: makeTetrominos("IJLOSTZ"),
              take: 2,
            },
            btbState: BtbState.None,
            field: makeField("IJLOSTZNNN"),
            garbages: [],
            hold: makeHold(Tetromino.I, false),
            lastRoseUpColumn: -1,
            ren: -1,
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
    it("should change mode and take over state with endless notes", () => {
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

    it("should change mode and take over state with not endless", () => {
      const actual = simuToEditMode(
        makeSimuState({
          config: {
            nextNum: 5,
          },
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.T),
          field: makeField("NNNNNNNNNN"),
          hold: makeHold(Tetromino.O, true),
          nexts: {
            bag: makeNextNote("IJ", 2),
            settled: makeTetrominos("JL__________"),
            unsettled: makeNextNotes("$"),
          },
        })
      );

      const expected: SimuToEditAction = {
        type: RootActionsType.SimuToEditMode,
        payload: {
          field: makeField("NNNNNNNNNN"),
          hold: makeHold(Tetromino.O, true),
          nexts: {
            nextNotes: new NextNotesInterpreter().interpret("TJL$"),
          },
          tools: {
            nextsPattern: "T J L $",
            noOfCycle: 7,
          },
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("replayToSimuMode", () => {
    const makeStateBase = (): ReplayState =>
      makeReplayState({
        attackTypes: [AttackType.BtbTsd],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Down, 4, 19, Tetromino.Z),
        field: makeField(
          // prettier-ignore
          "NNNSZZNNNN",
          "LNNSSZZNNN"
        ),
        garbages: [
          makeGarbage(0, 3, 2),
          makeGarbage(12, 5, 0),
          makeGarbage(1, 5, 0),
        ],
        histories: [
          {
            attackTypes: [],
            btbState: BtbState.None,
            current: makeCurrent(Direction.Up, 8, 1, Tetromino.O),
            field: makeField(
              // prettier-ignore
              "NNNSZZNNNN",
              "LNNSSZZNNN",
              "LNNNSJJJOO",
              "LLNIIIIJOO"
            ),
            garbages: [],
            nexts: makeTetrominos("TZIJLOSZTSOLJIIJLO"),
            noOfCycle: 1,
            hold: makeHold(Tetromino.I, true),
            isDead: false,
            ren: -1,
          },
          {
            attackTypes: [],
            btbState: BtbState.None,
            current: makeCurrent(Direction.Down, 4, 19, Tetromino.T),
            field: makeField(
              // prettier-ignore
              "NNNSZZNNNN",
              "LNNSSZZNNN",
              "LNNNSJJJOO",
              "LLNIIIIJOO"
            ),
            garbages: [],
            nexts: makeTetrominos("ZIJLOSZTSOLJIIJLO"),
            noOfCycle: 2,
            hold: makeHold(Tetromino.I, true),
            isDead: false,
            ren: -1,
          },
          {
            attackTypes: [],
            btbState: BtbState.None,
            current: makeCurrent(Direction.Down, 2, 1, Tetromino.T),
            field: makeField(
              // prettier-ignore
              "NNNSZZNNNN",
              "LNNSSZZNNN",
              "LTTTSJJJOO",
              "LLTIIIIJOO"
            ),
            garbages: [],
            nexts: makeTetrominos("ZIJLOSZTSOLJIIJLO"),
            noOfCycle: 2,
            hold: makeHold(Tetromino.I, true),
            isDead: false,
            ren: -1,
          },
          {
            attackTypes: [AttackType.BtbTsd],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Down, 4, 19, Tetromino.Z),
            field: makeField(
              // prettier-ignore
              "NNNSZZNNNN",
              "LNNSSZZNNN"
            ),
            garbages: [
              makeGarbage(0, 3, 2),
              makeGarbage(12, 5, 0),
              makeGarbage(1, 5, 0),
            ],
            nexts: makeTetrominos("IJLOSZTSOLJIIJLO"),
            noOfCycle: 3,
            hold: makeHold(Tetromino.I, true),
            isDead: false,
            ren: 0,
          },
        ],
        hold: makeHold(Tetromino.I, true),
        isDead: false,
        nexts: makeTetrominos("IJLOSZTSOLJIIJLO"),
        noOfCycle: 3,
        ren: 0,
        replaySteps: [
          makeReplayHardDropStep(),
          makeReplayDropStep(Direction.Down, 2, 1, SpinType.Spin),
          makeReplayHardDropStep({ cols: [], line: 2 }),
          makeReplayDropStep(Direction.Up, 1, 2, SpinType.None),
          makeReplayHardDropStep({ cols: [], line: 2 }),
        ],
        step: 3,
        replayInfo: {
          nextNum: 12,
          offsetRange: 5,
        },
      });

    it("should change mode and take over state", () => {
      const state = makeStateBase();
      state.config = {
        passesAllToSimu: false,
        showsCycle: false,
        showsGhost: true,
        showsPivot: true,
        showsTrace: false,
      };

      const actual = replayToSimuMode(state, initialSimuState);

      const expected: ReplayToSimuAction = {
        type: RootActionsType.ReplayToSimuMode,
        payload: {
          attackTypes: [AttackType.BtbTsd],
          btbState: BtbState.Btb,
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.Z),
          field: makeField(
            // prettier-ignore
            "NNNSZZNNNN",
            "LNNSSZZNNN"
          ),
          garbages: [makeGarbage(0, 1, 0), makeGarbage(12, 5, 0)],
          hold: makeHold(Tetromino.I, true),
          isDead: false,
          lastRoseUpColumn: -1,
          nexts: {
            bag: makeNextNote("", 0),
            nextNum: 12,
            settled: makeTetrominos("IJLOSZTSOLJI"),
            unsettled: [],
          },
          offsetRange: 5,
          ren: 0,
          retryState: {
            attackTypes: [AttackType.BtbTsd],
            bag: {
              candidates: makeTetrominos("IJLOSZ"),
              take: 6,
            },
            btbState: BtbState.Btb,
            field: makeField(
              // prettier-ignore
              "NNNSZZNNNN",
              "LNNSSZZNNN"
            ),
            garbages: [makeGarbage(0, 1, 0), makeGarbage(12, 5, 0)],
            hold: makeHold(Tetromino.I, true),
            lastRoseUpColumn: -1,
            ren: 0,
            seed: actual.payload.retryState.seed,
            unsettledNexts: new NextNotesInterpreter().interpret(
              "ZIJLOSZTSOLJI"
            ),
          },
          seed: actual.payload.seed,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should change mode and take over all state", () => {
      const state = makeStateBase();
      const actual = replayToSimuMode(state, initialSimuState);

      const expected: ReplayToSimuAction = {
        type: RootActionsType.ReplayToSimuMode,
        payload: {
          attackTypes: [AttackType.BtbTsd],
          btbState: BtbState.Btb,
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.Z),
          field: makeField(
            // prettier-ignore
            "NNNSZZNNNN",
            "LNNSSZZNNN"
          ),
          garbages: [
            makeGarbage(0, 1, 0),
            makeGarbage(12, 5, 0),
            makeGarbage(1, 5, 0),
          ],
          hold: makeHold(Tetromino.I, true),
          isDead: false,
          lastRoseUpColumn: -1,
          nexts: {
            bag: makeNextNote("", 0),
            nextNum: 12,
            settled: makeTetrominos("IJLOSZTSOLJI"),
            unsettled: makeNextNotes("IJLO"),
          },
          offsetRange: 5,
          ren: 0,
          retryState: {
            attackTypes: [AttackType.BtbTsd],
            bag: {
              candidates: makeTetrominos("IJLOSZ"),
              take: 6,
            },
            btbState: BtbState.Btb,
            field: makeField(
              // prettier-ignore
              "NNNSZZNNNN",
              "LNNSSZZNNN"
            ),
            garbages: [
              makeGarbage(0, 1, 0),
              makeGarbage(12, 5, 0),
              makeGarbage(1, 5, 0),
            ],
            hold: makeHold(Tetromino.I, true),
            lastRoseUpColumn: -1,
            ren: 0,
            seed: actual.payload.retryState.seed,
            unsettledNexts: new NextNotesInterpreter().interpret(
              "ZIJLOSZTSOLJIIJLO"
            ),
          },
          seed: actual.payload.seed,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should change mode and ganerates lack of garbages", () => {
      const state = makeStateBase();
      state.garbages = [makeGarbage(0, 1, 0), makeGarbage(8, 5, 0)];

      const simuState = makeSimuState({
        config: {
          garbage: {
            a1: 20,
            a2: 100,
            b1: 10,
            b2: 100,
            generates: true,
            level: 1,
          },
        },
      });

      const actual = replayToSimuMode(state, simuState);
      expect(actual.payload.garbages).toEqual([
        makeGarbage(0, 1, 0),
        makeGarbage(8, 5, 0),
        makeGarbage(1, 2, 0),
        makeGarbage(1, 2, 0),
        makeGarbage(1, 2, 0),
        makeGarbage(1, 2, 0),
        makeGarbage(1, 2, 0),
      ]);
      expect(actual.payload.retryState.garbages).toEqual([
        makeGarbage(0, 1, 0),
        makeGarbage(8, 5, 0),
      ]);
    });
  });

  describe("simuToReplayMode", () => {
    it("should change mode and take over state", () => {
      const takeOfBag = 5;
      const actual = simuToReplayMode(
        makeSimuState({
          attackTypes: [AttackType.BtbTetris],
          btbState: BtbState.Btb,
          config: {
            nextNum: 12,
            offsetRange: 5,
          },
          histories: [
            {
              attackTypes: [],
              btbState: BtbState.None,
              currentType: Tetromino.T,
              field: makeField("IJLOSTZNNN"),
              garbages: [],
              hold: makeHold(Tetromino.I, false),
              isDead: false,
              lastRoseUpColumn: -1,
              nexts: {
                bag: makeNextNote("IJLTZ", takeOfBag),
                settled: [Tetromino.Z],
                unsettled: [],
              },
              ren: -1,
              replayNextStep: 12,
              replayStep: 1,
              seed: 1,
              settleSteps: [],
            },
          ],
          ren: 3,
          replayNexts: makeTetrominos("ZTSOLJIIJLOS"),
          replayNextStep: 12,
          replayStep: 1,
          replaySteps: [
            makeReplayHoldStep(),
            makeReplayDropStep(Direction.Up, 5, 0),
            makeReplayHardDropStep({ cols: [1, 2], line: 5 }),
            makeReplayDropStep(Direction.Up, 5, 0),
            makeReplayHardDropStep(),
            makeReplayDropStep(Direction.Up, 5, 0),
            makeReplayHardDropStep({ cols: [1], line: 3 }),
          ],
        })
      );

      const expected: SimuToReplayAction = {
        type: RootActionsType.SimuToReplayMode,
        payload: {
          attackTypes: [],
          auto: {
            playing: false,
          },
          btbState: BtbState.None,
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.T),
          field: makeField("IJLOSTZNNN"),
          garbages: [makeGarbage(0, 5), makeGarbage(2, 3)],
          histories: [
            {
              attackTypes: [],
              btbState: BtbState.None,
              current: makeCurrent(Direction.Up, 4, 19, Tetromino.T),
              field: makeField("IJLOSTZNNN"),
              garbages: [makeGarbage(0, 5), makeGarbage(2, 3)],
              hold: makeHold(Tetromino.I, false),
              isDead: false,
              nexts: makeTetrominos("ZTSOLJIIJLOS"),
              noOfCycle: 5,
              ren: -1,
            },
          ],
          hold: makeHold(Tetromino.I, false),
          isDead: false,
          nexts: makeTetrominos("ZTSOLJIIJLOS"),
          noOfCycle: 5,
          ren: -1,
          replayInfo: {
            nextNum: 12,
            offsetRange: 5,
          },
          replaySteps: [
            makeReplayHoldStep(),
            makeReplayDropStep(Direction.Up, 5, 0),
            makeReplayHardDropStep({ cols: [1, 2], line: 5 }),
            makeReplayDropStep(Direction.Up, 5, 0),
            makeReplayHardDropStep(),
            makeReplayDropStep(Direction.Up, 5, 0),
            makeReplayHardDropStep({ cols: [1], line: 3 }),
          ],
          step: 0,
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("initializeApp", () => {
    describe("replay mode", () => {
      it("should initialize replay state", () => {
        const actual = initializeApp(
          "f=EjRWeAA_&ns=sOZa0vPY&ss=IBAiExLlZTEj8A__&h=b&nc=3&nn=7&or=3&m=1&v=2.02",
          initialRootState
        );

        const expectedReplay: ReplayState = {
          ...initialReplayState,
          attackTypes: [],
          btbState: BtbState.None,
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.S),
          field: makeField("IJLOSTZGNN"),
          garbages: [makeGarbage(0, 2), makeGarbage(1, 5)],
          hold: makeHold(Tetromino.S, false),
          histories: [
            {
              attackTypes: [],
              btbState: BtbState.None,
              current: makeCurrent(Direction.Up, 4, 19, Tetromino.S),
              field: makeField("IJLOSTZGNN"),
              garbages: [makeGarbage(0, 2), makeGarbage(1, 5)],
              hold: makeHold(Tetromino.S, false),
              isDead: false,
              nexts: makeTetrominos("OITLILJTOSZIZL"),
              noOfCycle: 4,
              ren: -1,
            },
          ],
          isDead: false,
          nexts: makeTetrominos("OITLILJTOSZIZL"),
          noOfCycle: 4,
          ren: -1,
          replayInfo: {
            nextNum: 7,
            offsetRange: 3,
          },
          replaySteps: [
            makeReplayDropStep(Direction.Up, 0, 0),
            makeReplayHardDropStep({ cols: [1, 3], line: 2 }),
            makeReplayHoldStep(),
            makeReplayDropStep(Direction.Left, 8, 20, SpinType.Spin),
            makeReplayHardDropStep({ cols: [1, 2, 3], line: 5 }),
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

      it("should initialize replay state(v0.97)", () => {
        const actual = initializeApp(
          "f=307s000300tM003c14h00&ns=IOvbg&ss=1x6gwSw00&h=0&m=1&v=0.97",
          initialRootState
        );

        const expectedReplay: ReplayState = {
          ...initialReplayState,
          attackTypes: [],
          btbState: BtbState.None,
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.S, SpinType.None),
          field: makeField(
            // prettier-ignore
            "LNNZZNNNNN",
            "LNNNZZNNNN",
            "LLNIIIINNN"
          ),
          garbages: [],
          hold: makeHold(Tetromino.None, true),
          histories: [
            {
              attackTypes: [],
              btbState: BtbState.None,
              current: makeCurrent(
                Direction.Up,
                4,
                19,
                Tetromino.S,
                SpinType.None
              ),
              field: makeField(
                // prettier-ignore
                "LNNZZNNNNN",
                "LNNNZZNNNN",
                "LLNIIIINNN"
              ),
              garbages: [],
              hold: makeHold(Tetromino.None, true),
              isDead: false,
              nexts: makeTetrominos("OTJLZILJ"),
              noOfCycle: 2,
              ren: -1,
            },
          ],
          isDead: false,
          nexts: makeTetrominos("OTJLZILJ"),
          noOfCycle: 2,
          ren: -1,
          replayInfo: {
            nextNum: 5,
            offsetRange: 2,
          },
          replaySteps: [
            makeReplayDropStep(Direction.Left, 7, 1),
            makeReplayHardDropStep(),
            makeReplayDropStep(Direction.Up, 8, 0),
            makeReplayHardDropStep(),
            makeReplayDropStep(Direction.Down, 2, 1, SpinType.Spin),
            makeReplayHardDropStep(),
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
    });

    describe("simu mode", () => {
      it("should initialize simu state with np", () => {
        const actual = initializeApp(
          "f=EjRWeAA_&np=I_J.p1LOSIJLOSTq1I-&h=9&nc=3&nn=12&or=3&m=0&v=2.01",
          initialRootState
        );
        const expectedSimu: SimuState = {
          ...initialSimuState,
          attackTypes: [],
          btbState: BtbState.None,
          config: {
            ...initialSimuState.config,
            garbage: initialSimuState.config.garbage,
            nextNum: 12,
            offsetRange: 3,
          },
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
          field: makeField("IJLOSTZGNN"),
          hold: makeHold(Tetromino.O, false),
          histories: [
            {
              attackTypes: [],
              btbState: BtbState.None,
              currentType: Tetromino.I,
              field: makeField("IJLOSTZGNN"),
              garbages: [],
              hold: makeHold(Tetromino.O, false),
              isDead: false,
              lastRoseUpColumn: -1,
              nexts: {
                bag: makeNextNote("JLOSTZ", 6),
                settled: makeTetrominos("JLOSIJLOSTZI"),
                unsettled: [makeTerminalNote()],
              },
              ren: -1,
              replayNextStep: 12,
              replayStep: 0,
              seed: actual.payload.simu.seed,
              settleSteps: [],
            },
          ],
          isDead: false,
          lastRoseUpColumn: -1,
          nexts: {
            bag: makeNextNote("JLOSTZ", 6),
            settled: makeTetrominos("JLOSIJLOSTZI"),
            unsettled: [makeTerminalNote()],
          },
          ren: -1,
          replayNexts: makeTetrominos("JLOSIJLOSTZI"),
          replayNextStep: 12,
          replayStep: 0,
          replaySteps: [],
          retryState: {
            attackTypes: [],
            bag: makeNextNote("IJLOSTZ", 5),
            btbState: BtbState.None,
            field: makeField("IJLOSTZGNN"),
            garbages: [],
            hold: makeHold(Tetromino.O, false),
            lastRoseUpColumn: -1,
            ren: -1,
            seed: actual.payload.simu.retryState.seed,
            unsettledNexts: makeNextNotes("I[J]p1LOS IJLOSTq1 I $"),
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
        const actual = initializeApp(
          "ns=Kcu5TlwA&m=0&v=2.01",
          initialRootState
        );
        const expectedSimu: SimuState = {
          ...initialSimuState,
          attackTypes: [],
          btbState: BtbState.None,
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
          field: makeField("NNNNNNNNNN"),
          hold: makeHold(Tetromino.None, true),
          histories: [
            {
              attackTypes: [],
              btbState: BtbState.None,
              currentType: Tetromino.I,
              field: makeField("NNNNNNNNNN"),
              garbages: [],
              hold: makeHold(Tetromino.None, true),
              isDead: false,
              lastRoseUpColumn: -1,
              nexts: {
                bag: makeNextNote("Z", 1),
                settled: makeTetrominos("JLOSTZIJLOST"),
                unsettled: [],
              },
              ren: -1,
              replayNextStep: 12,
              replayStep: 0,
              seed: actual.payload.simu.seed,
              settleSteps: [],
            },
          ],
          isDead: false,
          lastRoseUpColumn: -1,
          nexts: {
            bag: makeNextNote("Z", 1),
            settled: makeTetrominos("JLOSTZIJLOST"),
            unsettled: [],
          },
          ren: -1,
          replayNexts: makeTetrominos("JLOSTZIJLOST"),
          replayNextStep: 12,
          replayStep: 0,
          replaySteps: [],
          retryState: {
            attackTypes: [],
            bag: makeNextNote("IJLOSTZ", 7),
            btbState: BtbState.None,
            field: makeField("NNNNNNNNNN"),
            garbages: [],
            hold: makeHold(Tetromino.None, true),
            lastRoseUpColumn: -1,
            ren: -1,
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
        const actual1 = initializeApp("s=1&nc=0&m=0&v=2.01", initialRootState);
        const actual2 = initializeApp("s=1&nc=0&m=0&v=2.01", initialRootState);
        const actual3 = initializeApp("s=2&nc=0&m=0&v=2.01", initialRootState);

        expect(actual1).toEqual(actual2);
        expect(actual1.payload.simu.nexts).not.toEqual(
          actual3.payload.simu.nexts
        );
        expect(actual1.payload.simu.retryState).not.toEqual(
          actual3.payload.simu.retryState
        );
      });

      it("should initialize simu state(v0.97)", () => {
        const actual = initializeApp(
          "f=04zhmu918QlDyg&ns=asK_Rzh&h=5&s=3&m=0&v=0.97",
          initialRootState
        );
        const expectedSimu: SimuState = {
          ...initialSimuState,
          attackTypes: [],
          btbState: BtbState.None,
          config: {
            ...initialSimuState.config,
            garbage: initialSimuState.config.garbage,
            nextNum: 5,
            offsetRange: 2,
          },
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
          field: makeField(
            // prettier-ignore
            "NIJLOSTZGG",
            "IJLOSTZGGN"
          ),
          hold: makeHold(Tetromino.J, false),
          histories: [
            {
              attackTypes: [],
              btbState: BtbState.None,
              currentType: Tetromino.I,
              field: makeField(
                // prettier-ignore
                "NIJLOSTZGG",
                "IJLOSTZGGN"
              ),
              garbages: [],
              hold: makeHold(Tetromino.J, false),
              isDead: false,
              lastRoseUpColumn: -1,
              nexts: {
                bag: makeNextNote("I", 1),
                settled: makeTetrominos("JLOSTZZTSOLJ"),
                unsettled: makeNextNotes("I"),
              },
              ren: -1,
              replayNextStep: 12,
              replayStep: 0,
              seed: actual.payload.simu.seed,
              settleSteps: [],
            },
          ],
          isDead: false,
          lastRoseUpColumn: -1,
          nexts: {
            bag: makeNextNote("I", 1),
            settled: makeTetrominos("JLOSTZZTSOLJ"),
            unsettled: makeNextNotes("I"),
          },
          ren: -1,
          replayNexts: makeTetrominos("JLOSTZZTSOLJ"),
          replayNextStep: 12,
          replayStep: 0,
          replaySteps: [],
          retryState: {
            attackTypes: [],
            bag: makeNextNote("IJLOSTZ", 7),
            btbState: BtbState.None,
            field: makeField(
              // prettier-ignore
              "NIJLOSTZGG",
              "IJLOSTZGGN"
            ),
            garbages: [],
            hold: makeHold(Tetromino.J, false),
            lastRoseUpColumn: -1,
            ren: -1,
            seed: 3,
            unsettledNexts: makeNextNotes("IJLOSTZZTSOLJI"),
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
    });

    describe("edit mode", () => {
      it("should initialize edit state", () => {
        const actual = initializeApp(
          "f=EjRWeAA_&np=I_J.p1LOSIJLOSTq1I-&h=9&nc=3&m=2&v=2.03",
          initialRootState
        );
        const expectedEdit: EditState = {
          ...initialEditState,
          field: makeField("IJLOSTZGNN"),
          hold: makeHold(Tetromino.O, false),
          tools: {
            ...initialEditState.tools,
            nextsPattern: "I[J]p1LOSIJLOSTq1I$",
            noOfCycle: 3,
          },
          nexts: {
            nextNotes: makeNextNotes("I[J]p1LOSIJLOSTq1I$"),
          },
        };

        const expected: InitializeAppAction = {
          type: RootActionsType.InitializeApp,
          payload: {
            ...initialRootState,
            edit: { ...expectedEdit },
            mode: TetsimuMode.Edit,
          },
        };

        expect(actual).toEqual(expected);
      });

      it("should initialize edit state(v0.97)", () => {
        const actual = initializeApp(
          "f=04zhmu918QlDyg&ns=a0s6E&h=5&s=3&m=2&v=0.97",
          initialRootState
        );
        const expectedEdit: EditState = {
          ...initialEditState,
          field: makeField(
            // prettier-ignore
            "NIJLOSTZGG",
            "IJLOSTZGGN"
          ),
          hold: makeHold(Tetromino.J, false),
          tools: {
            ...initialEditState.tools,
            nextsPattern: "IJq1q1LOq1TS",
            noOfCycle: 1,
          },
          nexts: {
            nextNotes: makeNextNotes("IJq1q1LOq1TS"),
          },
        };

        const expected: InitializeAppAction = {
          type: RootActionsType.InitializeApp,
          payload: {
            ...initialRootState,
            edit: { ...expectedEdit },
            mode: TetsimuMode.Edit,
          },
        };

        expect(actual).toEqual(expected);
      });
    });
  });
});
