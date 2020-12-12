import { getReplayConductor } from "ducks/replay/selectors";
import { ReplayState } from "stores/ReplayState";
import { Direction, Tetromino } from "types/core";
import { makeCurrent } from "../testUtils/makeCurrent";
import { makeField } from "../testUtils/makeField";
import { makeHold } from "../testUtils/makeHold";
import { makeNextTypes } from "../testUtils/makeNextTypes";
import { makeReplayState } from "../testUtils/makeReplayState";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep,
} from "../testUtils/makeReplayStep";

describe("replayConductor", () => {
  describe("forwardStep", () => {
    it("should be forward drop step", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.UP, 1, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.UP, 1, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.NONE, true),
            isDead: false,
            nexts: makeNextTypes("J"),
            noOfCycle: 1,
          },
        ],
        hold: makeHold(Tetromino.NONE, true),
        nexts: makeNextTypes("J"),
        replaySteps: [makeReplayDropStep(Direction.UP, 1, 0)],
      });
      const conductor = getReplayConductor(state);
      expect(conductor.forwardStep()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        current: makeCurrent(Direction.UP, 1, 0, Tetromino.I),
        histories: [
          {
            ...state.histories[0],
          },
          {
            ...state.histories[0],
            current: makeCurrent(Direction.UP, 1, 0, Tetromino.I),
          },
        ],
        step: 1,
      };

      expect(actual).toEqual(expected);
    });

    it("should be forward hold step", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.UP, 1, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.UP, 1, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.NONE, true),
            isDead: false,
            nexts: makeNextTypes("J"),
            noOfCycle: 1,
          },
        ],
        hold: makeHold(Tetromino.NONE, true),
        nexts: makeNextTypes("J"),
        replaySteps: [makeReplayHoldStep()],
      });
      const conductor = getReplayConductor(state);
      expect(conductor.forwardStep()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            ...state.histories[0],
          },
          {
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.I, false),
            isDead: false,
            nexts: makeNextTypes(""),
            noOfCycle: 2,
          },
        ],
        hold: makeHold(Tetromino.I, false),
        nexts: [],
        noOfCycle: 2,
        step: 1,
      };

      expect(actual).toEqual(expected);
    });

    it("should be forward hard drop step without attacked", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.UP, 1, 0, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.UP, 1, 0, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.NONE, true),
            isDead: false,
            nexts: makeNextTypes("J"),
            noOfCycle: 1,
          },
        ],
        hold: makeHold(Tetromino.NONE, true),
        nexts: makeNextTypes("J"),
        replaySteps: [makeReplayHardDropStep()],
      });
      const conductor = getReplayConductor(state);
      expect(conductor.forwardStep()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
        field: makeField("IIIINNNNNN"),
        histories: [
          {
            ...state.histories[0],
          },
          {
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
            field: makeField("IIIINNNNNN"),
            hold: makeHold(Tetromino.NONE, true),
            isDead: false,
            nexts: makeNextTypes(""),
            noOfCycle: 2,
          },
        ],
        hold: makeHold(Tetromino.NONE, true),
        nexts: [],
        noOfCycle: 2,
        step: 1,
      };

      expect(actual).toEqual(expected);
    });

    it("should be forward drop step with attacked", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.UP, 1, 0, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.UP, 1, 0, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeNextTypes("J"),
            noOfCycle: 1,
          },
        ],
        hold: makeHold(Tetromino.T, false),
        nexts: makeNextTypes("J"),
        replaySteps: [makeReplayHardDropStep([1, 2, 3])],
      });
      const conductor = getReplayConductor(state);
      expect(conductor.forwardStep()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
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
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
            field: makeField(
              // prettier-ignore
              "IIIINNNNNN",
              "GNGGGGGGGG",
              "GGNGGGGGGG",
              "GGGNGGGGGG"
            ),
            hold: makeHold(Tetromino.T, true),
            isDead: false,
            nexts: makeNextTypes(""),
            noOfCycle: 2,
          },
        ],
        nexts: [],
        noOfCycle: 2,
        step: 1,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("backwardStep", () => {
    it("should be backward step", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
        field: makeField("IIIINNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.UP, 1, 0, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeNextTypes("J"),
            noOfCycle: 1,
          },
          {
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
            field: makeField("IIIINNNNNN"),
            hold: makeHold(Tetromino.T, true),
            isDead: false,
            nexts: makeNextTypes(""),
            noOfCycle: 2,
          },
        ],
        hold: makeHold(Tetromino.T, true),
        nexts: makeNextTypes(""),
        replaySteps: [makeReplayHardDropStep()],
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

  describe("changeStep", () => {
    it("should be change forward without histories", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.UP, 4, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeNextTypes("JO"),
            noOfCycle: 1,
          },
        ],
        hold: makeHold(Tetromino.T, false),
        nexts: makeNextTypes("JO"),
        noOfCycle: 1,
        replaySteps: [
          makeReplayDropStep(Direction.DOWN, 1, 1),
          makeReplayHardDropStep(),
        ],
        step: 0,
      });

      const conductor = getReplayConductor(state);
      expect(conductor.changeStep(2)).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
        field: makeField("IIIINNNNNN"),
        hold: makeHold(Tetromino.T, true),
        isDead: false,
        nexts: makeNextTypes("O"),
        noOfCycle: 2,
        histories: [
          { ...state.histories[0] },
          {
            ...state.histories[0],
            current: makeCurrent(Direction.DOWN, 1, 1, Tetromino.I),
          },
          {
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
            field: makeField("IIIINNNNNN"),
            hold: makeHold(Tetromino.T, true),
            isDead: false,
            nexts: makeNextTypes("O"),
            noOfCycle: 2,
          },
        ],
        step: 2,
      };

      expect(actual).toEqual(expected);
    });

    it("should be change forward with histories", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.UP, 4, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeNextTypes("JO"),
            noOfCycle: 1,
          },
          {
            current: makeCurrent(Direction.DOWN, 1, 1, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeNextTypes("JO"),
            noOfCycle: 1,
          },
          {
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
            field: makeField("IIIINNNNNN"),
            hold: makeHold(Tetromino.T, true),
            isDead: false,
            nexts: makeNextTypes("O"),
            noOfCycle: 2,
          },
        ],
        hold: makeHold(Tetromino.T, false),
        nexts: makeNextTypes("JO"),
        noOfCycle: 1,
        replaySteps: [
          makeReplayDropStep(Direction.DOWN, 1, 1),
          makeReplayHardDropStep(),
        ],
        step: 0,
      });

      const conductor = getReplayConductor(state);
      expect(conductor.changeStep(2)).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        ...state.histories[2],
        histories: [
          { ...state.histories[0] },
          {
            ...state.histories[1],
          },
          {
            ...state.histories[2],
          },
        ],
        step: 2,
      };

      expect(actual).toEqual(expected);
    });

    it("should be change backward", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
        field: makeField("IIIINNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeNextTypes("JO"),
            noOfCycle: 1,
          },
          {
            current: makeCurrent(Direction.DOWN, 1, 1, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeNextTypes("JO"),
            noOfCycle: 1,
          },
          {
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.J),
            field: makeField("IIIINNNNNN"),
            hold: makeHold(Tetromino.T, true),
            isDead: false,
            nexts: makeNextTypes("O"),
            noOfCycle: 2,
          },
        ],
        hold: makeHold(Tetromino.T, true),
        isDead: false,
        nexts: makeNextTypes("O"),
        noOfCycle: 2,
        replaySteps: [
          makeReplayDropStep(Direction.DOWN, 1, 1),
          makeReplayHardDropStep(),
        ],
        step: 2,
      });

      const conductor = getReplayConductor(state);
      expect(conductor.changeStep(0)).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: ReplayState = {
        ...state,
        ...state.histories[0],
        histories: [
          { ...state.histories[0] },
          {
            ...state.histories[1],
          },
          {
            ...state.histories[2],
          },
        ],
        step: 0,
      };

      expect(actual).toEqual(expected);
    });
  });
});
