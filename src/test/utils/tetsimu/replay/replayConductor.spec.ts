import { getReplayConductor } from "ducks/replay/selectors";
import { ReplayState } from "stores/ReplayState";
import { AttackType, BtbState, Direction, SpinType, Tetromino } from "types/core";
import { makeCurrent } from "../testUtils/makeCurrent";
import { makeField } from "../testUtils/makeField";
import { makeGarbage } from "../testUtils/makeGarbage";
import { makeHold } from "../testUtils/makeHold";
import { makeReplayState } from "../testUtils/makeReplayState";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep
} from "../testUtils/makeReplayStep";
import { makeTetrominos } from "../testUtils/makeTetrominos";

describe("replayConductor", () => {
  describe("forward", () => {
    it("should forward", () => {
      const state = makeReplayState({
        attackTypes: [],
        btbState: BtbState.None,
        current: makeCurrent(Direction.Up, 3, 11, Tetromino.T),
        field: makeField(
          // prettier-ignore
          "NNNNGGGGGG",
          "NNNNNGGGGG",
          "GGGGNGGGGG",
          "GGGNNGGGGG",
          "GGGNNGGGGG",
          "GGNNNGGGGG",
          "GGNGGGGGGG",
          "GGNNNNGGGG",
          "GGNNNNGGGG",
          "GGGGNNNGGG",
          "GGGGGNGGGG"
        ),
        garbages: [],
        histories: [
          {
            attackTypes: [],
            btbState: BtbState.None,
            current: makeCurrent(Direction.Up, 3, 11, Tetromino.T),
            field: makeField(
              // prettier-ignore
              "NNNNGGGGGG",
              "NNNNNGGGGG",
              "GGGGNGGGGG",
              "GGGNNGGGGG",
              "GGGNNGGGGG",
              "GGNNNGGGGG",
              "GGNGGGGGGG",
              "GGNNNNGGGG",
              "GGNNNNGGGG",
              "GGGGNNNGGG",
              "GGGGGNGGGG"
            ),
            garbages: [],
            hold: makeHold(Tetromino.None, true),
            isDead: false,
            nexts: makeTetrominos(""),
            noOfCycle: 1,
            ren: 0,
          },
        ],
        hold: makeHold(Tetromino.None, true),
        nexts: makeTetrominos(""),
        ren: 0,
        replaySteps: [makeReplayDropStep(Direction.Down, 5, 1, SpinType.Spin)],
      });
      const conductor = getReplayConductor(state);

      expect(conductor.forward()).toBeTruthy();
      expect(conductor.state.current).toEqual({
        direction: Direction.Up,
        pos: {
          x: 2,
          y: 11
        },
        spinType: SpinType.None,
        type: Tetromino.T 
      });

      conductor.forward();
      conductor.forward();
      conductor.forward();
      conductor.forward();
      conductor.forward();
      conductor.forward();
      conductor.forward();
      conductor.forward();
      conductor.forward();
      conductor.forward();
      conductor.forward();

      expect(conductor.state.current).toEqual({
        direction: Direction.Down,
        pos: {
          x: 5,
          y: 1, 
        },
        spinType: SpinType.Spin,
        type: Tetromino.T 
      });

      expect(conductor.state.step).toBe(0);
      conductor.forward();
      expect(conductor.state.step).toBe(1);
    });
  });

  describe("forwardStep", () => {
    it("should forward drop step", () => {
      const state = makeReplayState({
        attackTypes: [AttackType.BtbTst],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 1, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        garbages: [makeGarbage(3, 2, 1)],
        histories: [
          {
            attackTypes: [AttackType.BtbTst],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 1, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            garbages: [makeGarbage(3, 2, 1)],
            hold: makeHold(Tetromino.None, true),
            isDead: false,
            nexts: makeTetrominos("J"),
            noOfCycle: 1,
            ren: 2,
          },
        ],
        hold: makeHold(Tetromino.None, true),
        nexts: makeTetrominos("J"),
        ren: 2,
        replaySteps: [makeReplayDropStep(Direction.Up, 1, 0)],
      });
      const conductor = getReplayConductor(state);
      expect(conductor.forwardStep()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        attackTypes: [AttackType.BtbTst],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
        histories: [
          {
            ...state.histories[0],
          },
          {
            ...state.histories[0],
            current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
          },
        ],
        ren: 2,
        step: 1,
      };

      expect(actual).toEqual(expected);
    });

    it("should forward hold step", () => {
      const state = makeReplayState({
        attackTypes: [AttackType.BtbTsd],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 1, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        garbages: [makeGarbage(3, 2, 1)],
        histories: [
          {
            attackTypes: [AttackType.BtbTsd],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 1, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            garbages: [makeGarbage(3, 2, 1)],
            hold: makeHold(Tetromino.None, true),
            isDead: false,
            nexts: makeTetrominos("J"),
            noOfCycle: 1,
            ren: 3,
          },
        ],
        hold: makeHold(Tetromino.None, true),
        nexts: makeTetrominos("J"),
        replaySteps: [makeReplayHoldStep()],
        ren: 3,
      });
      const conductor = getReplayConductor(state);
      expect(conductor.forwardStep()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        attackTypes: [AttackType.BtbTsd],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            ...state.histories[0],
          },
          {
            ...state.histories[0],
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
            hold: makeHold(Tetromino.I, false),
            isDead: false,
            nexts: makeTetrominos(""),
            noOfCycle: 2,
          },
        ],
        hold: makeHold(Tetromino.I, false),
        nexts: [],
        noOfCycle: 2,
        ren: 3,
        step: 1,
      };

      expect(actual).toEqual(expected);
    });

    it("should forward hard drop step without attacked", () => {
      const state = makeReplayState({
        attackTypes: [],
        btbState: BtbState.None,
        current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        garbages: [makeGarbage(3, 2, 1), makeGarbage(3, 5, 0)],
        histories: [
          {
            attackTypes: [],
            btbState: BtbState.None,
            current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            garbages: [makeGarbage(3, 2, 1), makeGarbage(3, 5, 0)],
            hold: makeHold(Tetromino.None, true),
            isDead: false,
            nexts: makeTetrominos("J"),
            noOfCycle: 1,
            ren: -1,
          },
        ],
        hold: makeHold(Tetromino.None, true),
        nexts: makeTetrominos("J"),
        ren: -1,
        replaySteps: [makeReplayHardDropStep()],
        step: 0,
      });
      const conductor = getReplayConductor(state);
      expect(conductor.forwardStep()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        attackTypes: [],
        btbState: BtbState.None,
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
        field: makeField("IIIINNNNNN"),
        garbages: [makeGarbage(2, 2, 1), makeGarbage(3, 5, 0)],
        histories: [
          {
            ...state.histories[0],
          },
          {
            attackTypes: [],
            btbState: BtbState.None,
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
            field: makeField("IIIINNNNNN"),
            garbages: [makeGarbage(2, 2, 1), makeGarbage(3, 5, 0)],
            hold: makeHold(Tetromino.None, true),
            isDead: false,
            nexts: makeTetrominos(""),
            noOfCycle: 2,
            ren: -1,
          },
        ],
        hold: makeHold(Tetromino.None, true),
        nexts: [],
        noOfCycle: 2,
        step: 1,
        ren: -1,
      };

      expect(actual).toEqual(expected);
    });

    it("should forward drop step with attacked", () => {
      const state = makeReplayState({
        attackTypes: [AttackType.BtbTetris],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        garbages: [makeGarbage(0, 5, 2), makeGarbage(3, 5, 0)],
        histories: [
          {
            attackTypes: [AttackType.BtbTetris],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            garbages: [makeGarbage(0, 5, 2), makeGarbage(3, 5, 0)],
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeTetrominos("J"),
            noOfCycle: 1,
            ren: 2,
          },
        ],
        hold: makeHold(Tetromino.T, false),
        nexts: makeTetrominos("J"),
        ren: 2,
        replaySteps: [makeReplayHardDropStep({ cols: [1, 2, 3], line: 3 })],
      });
      const conductor = getReplayConductor(state);
      expect(conductor.forwardStep()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        attackTypes: [],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
        field: makeField(
          // prettier-ignore
          "IIIINNNNNN",
          "GNGGGGGGGG",
          "GGNGGGGGGG",
          "GGGNGGGGGG"
        ),
        garbages: [makeGarbage(2, 5, 0)],
        hold: makeHold(Tetromino.T, true),
        histories: [
          {
            ...state.histories[0],
          },
          {
            attackTypes: [],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
            field: makeField(
              // prettier-ignore
              "IIIINNNNNN",
              "GNGGGGGGGG",
              "GGNGGGGGGG",
              "GGGNGGGGGG"
            ),
            garbages: [makeGarbage(2, 5, 0)],
            hold: makeHold(Tetromino.T, true),
            isDead: false,
            nexts: makeTetrominos(""),
            noOfCycle: 2,
            ren: -1,
          },
        ],
        nexts: [],
        noOfCycle: 2,
        ren: -1,
        step: 1,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("backwardStep", () => {
    it("should backward step", () => {
      const state = makeReplayState({
        attackTypes: [],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
        field: makeField("IIIINNNNNN"),
        garbages: [makeGarbage(2, 2, 1), makeGarbage(3, 5, 0)],
        histories: [
          {
            attackTypes: [AttackType.Tetris],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            garbages: [makeGarbage(3, 2, 1), makeGarbage(3, 5, 0)],
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeTetrominos("J"),
            noOfCycle: 1,
            ren: 1,
          },
          {
            attackTypes: [],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
            field: makeField("IIIINNNNNN"),
            garbages: [makeGarbage(2, 2, 1), makeGarbage(3, 5, 0)],
            hold: makeHold(Tetromino.T, true),
            isDead: false,
            nexts: makeTetrominos(""),
            noOfCycle: 2,
            ren: -1,
          },
        ],
        hold: makeHold(Tetromino.T, true),
        nexts: makeTetrominos(""),
        replaySteps: [makeReplayHardDropStep()],
        ren: -1,
        step: 1,
      });

      const conductor = getReplayConductor(state);
      expect(conductor.backwardStep()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        ...state.histories[0],
        histories: [...state.histories],
        step: 0,
      };

      expect(actual).toEqual(expected);
    });
  });
});
