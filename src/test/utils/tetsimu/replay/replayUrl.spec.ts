import {
  BtbState,
  Direction,
  SpinType,
  Tetromino,
  TetsimuMode,
} from "types/core";
import ReplayUrl, {
  ReplayStateFragments,
} from "utils/tetsimu/replay/replayUrl";
import { makeField } from "../testUtils/makeField";
import { makeGarbage } from "../testUtils/makeGarbage";
import { makeHold } from "../testUtils/makeHold";
import { makeReplayState } from "../testUtils/makeReplayState";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep,
} from "../testUtils/makeReplayStep";
import { makeTetrominos } from "../testUtils/makeTetrominos";

describe("replayUrl", () => {
  describe("fromState", () => {
    it("should generate url of states", () => {
      const state = makeReplayState({
        histories: [
          {
            attackTypes: [],
            btbState: BtbState.None,
            current: {
              direction: Direction.Up,
              pos: { x: 4, y: 19 },
              type: Tetromino.I,
              spinType: SpinType.None,
            },
            field: makeField(
              // prettier-ignore
              "NNIJLOSTZG",
              "IJLOSTZGNN"
            ),
            garbages: [makeGarbage(0, 2), makeGarbage(1, 5)],
            hold: makeHold(Tetromino.I, false),
            isDead: false,
            nexts: makeTetrominos("JLOSTZ"),
            noOfCycle: 7,
            ren: -1,
          },
        ],
        nexts: makeTetrominos("JLOSTZ"),
        replayInfo: {
          nextNum: 12,
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
      });

      const gen = new ReplayUrl();
      const actual = gen.fromState(state);
      const loc = location.href.replace(/\?.*$/, "");

      const f = "EjRWeBI0VngA";
      const ns = "Kcu4";
      const ss = "IBAiExLlZTEj8A__";
      const h = "3";
      const nc = "6";
      const nn = "12";
      const or = "3";
      const m = TetsimuMode.Replay;
      const v = "2.02";
      const expected = `${loc}?f=${f}&ns=${ns}&ss=${ss}&h=${h}&nc=${nc}&nn=${nn}&or=${or}&m=${m}&v=${v}`;
      expect(actual).toBe(expected);
    });

    it("should generate url of minimum states", () => {
      const state = makeReplayState({
        garbages: [],
        histories: [
          {
            attackTypes: [],
            btbState: BtbState.None,
            current: {
              type: Tetromino.I,
              direction: Direction.Up,
              pos: { x: 4, y: 19 },
              spinType: SpinType.None,
            },
            field: makeField("NNNNNNNNNN"),
            garbages: [],
            isDead: false,
            hold: makeHold(Tetromino.None, true),
            nexts: [],
            noOfCycle: 2,
            ren: -1,
          },
        ],
        nexts: [],
        replayInfo: {
          nextNum: 5,
          offsetRange: 2,
        },
        replaySteps: [],
        step: 0,
      });

      const gen = new ReplayUrl();
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
    it("should generate states from url(v2.01 <= v)", () => {
      const f = "EjRWeBI0VngA";
      const ns = "Kcu4";
      const ss = "ABAS5WUxI-A_";
      const nc = "6";
      const h = "3";
      const nn = "12";
      const or = "3";
      const m = `${TetsimuMode.Replay}`;
      const v = "2.02";

      const params = {
        f,
        ns,
        ss,
        h,
        nc,
        nn,
        or,
        m,
        v,
      };
      const gen = new ReplayUrl();
      const actual = gen.toState(params);

      const expected: ReplayStateFragments = {
        field: makeField(
          // prettier-ignore
          "NNIJLOSTZG",
          "IJLOSTZGNN"
        ),
        hold: makeHold(Tetromino.I, false),
        nextNum: 12,
        offsetRange: 3,
        numberOfCycle: 6,
        replayNexts: makeTetrominos("IJLOSTZ"),
        replaySteps: [
          makeReplayDropStep(Direction.Up, 0, 0),
          makeReplayHardDropStep(),
          makeReplayHoldStep(),
          makeReplayDropStep(Direction.Left, 8, 20, SpinType.Spin),
          makeReplayHardDropStep({ cols: [1, 2, 3], line: 5 }),
        ],
      };

      expect(actual).toEqual(expected);
    });

    it("should generate states from url with no params", () => {
      const gen = new ReplayUrl();
      const actual = gen.toState({});

      const expected: ReplayStateFragments = {
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.None, true),
        nextNum: 5,
        offsetRange: 2,
        numberOfCycle: 1,
        replayNexts: makeTetrominos(""),
        replaySteps: [],
      };

      expect(actual).toEqual(expected);
    });
  });
});
