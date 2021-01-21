import { Direction, SpinType, Tetromino, TetsimuMode } from "types/core";
import SimuUrl, { SimuStateFragments, UNSPECIFIED_SEED } from "utils/tetsimu/simu/simuUrl";
import { makeField } from "../testUtils/makeField";
import { makeHold } from "../testUtils/makeHold";
import { makeNextNote, makeNextNotes } from "../testUtils/makeNextNote";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep,
} from "../testUtils/makeReplayStep";
import { makeSimuState } from "../testUtils/makeSimuState";
import { makeTetrominos } from "../testUtils/makeTetrominos";

describe("simuUrl", () => {
  describe("fromState", () => {
    it("should generate url(v2.00) of states", () => {
      const state = makeSimuState({
        config: {
          nextNum: 12,
        },
        histories: [
          {
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
      const ss = "AAAS0GUxI-A_";
      const h = "3";
      const nc = "7";
      const nn = "12";
      const m = TetsimuMode.Replay;
      const v = "2.00";
      const expected = `${loc}?f=${f}&ns=${ns}&ss=${ss}&h=${h}&nc=${nc}&nn=${nn}&m=${m}&v=${v}`;
      expect(actual).toBe(expected);
    });

    it("should generate url(v2.00) of minimum states", () => {
      const state = makeSimuState({
        config: {
          nextNum: 5,
        },
        histories: [
          {
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
      const v = "2.00";
      const expected = `${loc}?ns=${ns}&m=${m}&v=${v}`;
      expect(actual).toBe(expected);
    });
  });

  describe("toState", () => {
    it("should generate states from url(v2.00) with ns", () => {
      const f = "EjRWeBI0VngA";
      const ns = "Kcu4";
      const h = "3";
      const nc = "6";
      const nn = "12";
      const s = "1";
      const m = `${TetsimuMode.Simu}`;
      const v = "2.00";

      const params = {
        f,
        ns,
        h,
        nc,
        nn,
        m,
        s,
        v,
      };
      const gen = new SimuUrl();
      const actual = gen.toState(params);

      const expected: SimuStateFragments = {
        nextNum: 12,
        field: makeField(
          // prettier-ignore
          "NNIJLOSTZG",
          "IJLOSTZGNN"
        ),
        hold: makeHold(Tetromino.I, false),
        numberOfCycle: 6,
        nextNotes: makeNextNotes("IJLOSTZ"),
        seed: 1,
      };

      expect(actual).toEqual(expected);
    });

    it("should generate states from url(v2.00) with np", () => {
      const ns = "Kcu4";
      const np = "q2_IJ.p2LOS";
      const m = `${TetsimuMode.Simu}`;
      const v = "2.00";

      const params = {
        ns,
        np,
        m,
        v,
      };
      const gen = new SimuUrl();
      const actual = gen.toState(params);

      const expected: SimuStateFragments = {
        nextNum: 5,
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.None, true),
        numberOfCycle: 1,
        nextNotes: makeNextNotes("q2 [IJ]p2 LOS"),
        seed: UNSPECIFIED_SEED,
      };

      expect(actual).toEqual(expected);
    });

    it("should generate states from url(v2.00) with no params", () => {
      const gen = new SimuUrl();
      const actual = gen.toState({});

      const expected: SimuStateFragments = {
        nextNum: 5,
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.None, true),
        numberOfCycle: 1,
        nextNotes: [],
        seed: UNSPECIFIED_SEED,
      };

      expect(actual).toEqual(expected);
    });
  });
});
