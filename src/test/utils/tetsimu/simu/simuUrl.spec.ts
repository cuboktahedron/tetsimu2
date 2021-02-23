import {
  BtbState,
  Direction,
  SpinType,
  Tetromino,
  TetsimuMode
} from "types/core";
import SimuUrl, {
  SimuStateFragments,
  UNSPECIFIED_SEED
} from "utils/tetsimu/simu/simuUrl";
import { makeField } from "../testUtils/makeField";
import { makeHold } from "../testUtils/makeHold";
import { makeNextNote, makeNextNotes } from "../testUtils/makeNextNote";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep
} from "../testUtils/makeReplayStep";
import { makeSimuState } from "../testUtils/makeSimuState";
import { makeTetrominos } from "../testUtils/makeTetrominos";

describe("simuUrl", () => {
  describe("fromState", () => {
    it("should generate url of states", () => {
      const state = makeSimuState({
        btbState: BtbState.None,
        config: {
          nextNum: 12,
          offsetRange: 3,
        },
        histories: [
          {
            attackTypes: [],
            btbState: BtbState.None,
            currentType: Tetromino.I,
            field: makeField(
              // prettier-ignore
              "NNIJLOSTZG",
              "IJLOSTZGNN"
            ),
            garbages: [],
            hold: makeHold(Tetromino.I, false),
            isDead: false,
            lastRoseUpColumn: -1,
            nexts: {
              bag: makeNextNote("IJLOSTZ", 2),
              settled: [],
              unsettled: [],
            },
            ren: -1,
            replayNextStep: 5,
            replayStep: 3,
            seed: 0,
          },
        ],
        replayNexts: makeTetrominos("JLOSTZ"),
        replaySteps: [
          makeReplayDropStep(Direction.Up, 0, 0),
          makeReplayHardDropStep(),
          makeReplayHoldStep(),
          makeReplayDropStep(Direction.Left, 8, 20, SpinType.Spin),
          makeReplayHardDropStep({ cols: [1, 2, 3], line: 5 }),
        ],
      });

      const gen = new SimuUrl();
      const actual = gen.fromState(state);
      const loc = location.href.replace(/\?.*$/, "");

      const f = "EjRWeBI0VngA";
      const ns = "Kcu4";
      const ss = "ABAS5WUxI-A_";
      const h = "3";
      const nc = "7";
      const nn = "12";
      const or = "3";
      const m = TetsimuMode.Replay;
      const v = "2.02";
      const expected = `${loc}?f=${f}&ns=${ns}&ss=${ss}&h=${h}&nc=${nc}&nn=${nn}&or=${or}&m=${m}&v=${v}`;
      expect(actual).toBe(expected);
    });

    it("should generate url of minimum states", () => {
      const state = makeSimuState({
        config: {
          nextNum: 5,
        },
        histories: [
          {
            attackTypes: [],
            btbState: BtbState.None,
            currentType: Tetromino.I,
            field: makeField("NNNNNNNNNN"),
            garbages: [],
            isDead: false,
            hold: makeHold(Tetromino.None, true),
            lastRoseUpColumn: -1,
            nexts: {
              bag: makeNextNote("IJLOSTZ", 1),
              settled: [],
              unsettled: [],
            },
            ren: -1,
            replayNextStep: 0,
            replayStep: 0,
            seed: 0,
          },
        ],
        replayNexts: [],
        replaySteps: [],
      });

      const gen = new SimuUrl();
      const actual = gen.fromState(state);
      const loc = location.href.replace(/\?.*$/, "");
      const ns = "IA__";
      const m = TetsimuMode.Replay;
      const v = "2.02";
      const expected = `${loc}?ns=${ns}&m=${m}&v=${v}`;
      expect(actual).toBe(expected);
    });
  });

  describe("toState", () => {
    it("should generate states from url(v2.01 <= v) with ns", () => {
      const f = "EjRWeBI0VngA";
      const ns = "Kcu4";
      const h = "3";
      const nc = "6";
      const nn = "12";
      const or = "3";
      const s = "1";
      const m = `${TetsimuMode.Simu}`;
      const v = "2.02";

      const params = {
        f,
        ns,
        h,
        nc,
        nn,
        or,
        m,
        s,
        v,
      };
      const gen = new SimuUrl();
      const actual = gen.toState(params);

      const expected: SimuStateFragments = {
        field: makeField(
          // prettier-ignore
          "NNIJLOSTZG",
          "IJLOSTZGNN"
        ),
        hold: makeHold(Tetromino.I, false),
        offsetRange: 3,
        nextNum: 12,
        numberOfCycle: 6,
        nextNotes: makeNextNotes("IJLOSTZ"),
        seed: 1,
      };

      expect(actual).toEqual(expected);
    });

    it("should generate states from url(v2.01 <= v) with np", () => {
      const ns = "Kcu4";
      const np = "q2_IJ.p2LOS";
      const m = `${TetsimuMode.Simu}`;
      const v = "2.01";

      const params = {
        ns,
        np,
        m,
        v,
      };
      const gen = new SimuUrl();
      const actual = gen.toState(params);

      const expected: SimuStateFragments = {
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.None, true),
        offsetRange: 2,
        nextNum: 5,
        numberOfCycle: 1,
        nextNotes: makeNextNotes("q2 [IJ]p2 LOS"),
        seed: UNSPECIFIED_SEED,
      };

      expect(actual).toEqual(expected);
    });

    it("should generate states from url with no params", () => {
      const gen = new SimuUrl();
      const actual = gen.toState({});

      const expected: SimuStateFragments = {
        field: makeField("NNNNNNNNNN"),
        offsetRange: 2,
        hold: makeHold(Tetromino.None, true),
        nextNum: 5,
        numberOfCycle: 1,
        nextNotes: [],
        seed: UNSPECIFIED_SEED,
      };

      expect(actual).toEqual(expected);
    });
  });

  it("should generate states from url(v = 0.97)", () => {
    const f = "04zhmu918QlDyg";
    const ns = "a0s6E";
    const h = "5";
    const s = "3";
    const m = `${TetsimuMode.Simu}`;
    const v = "0.97";

    const params = {
      f,
      ns,
      h,
      m,
      s,
      v,
    };
    const gen = new SimuUrl();
    const actual = gen.toState(params);

    const expected: SimuStateFragments = {
      field: makeField(
        // prettier-ignore
        "NIJLOSTZGG",
        "IJLOSTZGGN"
      ),
      hold: makeHold(Tetromino.J, false),
      offsetRange: 2,
      nextNum: 5,
      numberOfCycle: 1,
      nextNotes: makeNextNotes("IJq1q1LOq1TS"),
      seed: 3,
    };

    expect(actual).toEqual(expected);
  });
});
