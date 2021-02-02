import { getReplayConductor } from "ducks/replay/selectors";
import { ReplayState } from "stores/ReplayState";
import { AttackType, BtbState, Direction, Tetromino } from "types/core";
import { makeCurrent } from "../testUtils/makeCurrent";
import { makeField } from "../testUtils/makeField";
import { makeHold } from "../testUtils/makeHold";
import { makeReplayState } from "../testUtils/makeReplayState";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep,
} from "../testUtils/makeReplayStep";
import { makeTetrominos } from "../testUtils/makeTetrominos";

describe("replayConductor", () => {
  describe("forwardStep", () => {
    it("should be forward drop step", () => {
      const state = makeReplayState({
        attackTypes: [AttackType.BtbTst],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 1, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            attackTypes: [AttackType.BtbTst],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 1, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
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

    it("should be forward hold step", () => {
      const state = makeReplayState({
        attackTypes: [AttackType.BtbTsd],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 1, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            attackTypes: [AttackType.BtbTsd],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 1, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
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
            attackTypes: [AttackType.BtbTsd],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.I, false),
            isDead: false,
            nexts: makeTetrominos(""),
            noOfCycle: 2,
            ren: 3,
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

    it("should be forward hard drop step without attacked", () => {
      const state = makeReplayState({
        attackTypes: [],
        btbState: BtbState.None,
        current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            attackTypes: [],
            btbState: BtbState.None,
            current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
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
        histories: [
          {
            ...state.histories[0],
          },
          {
            attackTypes: [],
            btbState: BtbState.None,
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
            field: makeField("IIIINNNNNN"),
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

    it("should be forward drop step with attacked", () => {
      const state = makeReplayState({
        attackTypes: [AttackType.BtbTetris],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            attackTypes: [AttackType.BtbTetris],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
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
    it("should be backward step", () => {
      const state = makeReplayState({
        attackTypes: [],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
        field: makeField("IIIINNNNNN"),
        histories: [
          {
            attackTypes: [AttackType.Tetris],
            btbState: BtbState.Btb,
            current: makeCurrent(Direction.Up, 1, 0, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
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
