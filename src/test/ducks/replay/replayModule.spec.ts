import {
  changeStep,
  downReplaySpeed,
  upReplaySpeed,
} from "ducks/replay/actions";
import { getReplayConductor } from "ducks/replay/selectors";
import {
  ChangeReplaySpeedAction,
  ChangeStepAction,
  ReplayActionsType,
} from "ducks/replay/types";
import { Direction, Tetromino } from "types/core";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
} from "../../..//test/utils/tetsimu/testUtils/makeReplayStep";
import { makeCurrent } from "../../../test/utils/tetsimu/testUtils/makeCurrent";
import { makeField } from "../../../test/utils/tetsimu/testUtils/makeField";
import { makeHold } from "../../../test/utils/tetsimu/testUtils/makeHold";
import { makeReplayState } from "../../../test/utils/tetsimu/testUtils/makeReplayState";
import { makeTetrominos } from "../../../test/utils/tetsimu/testUtils/makeTetrominos";
describe("replayModule", () => {
  describe("upReplaySpeed", () => {
    it("should up replay speed to next upper speed", () => {
      const actual = upReplaySpeed(0.25);

      const expected: ChangeReplaySpeedAction = {
        type: ReplayActionsType.ChangeReplaySpeed,
        payload: {
          speed: 0.5,
        },
      };

      expect(actual).toEqual(expected);
      expect(upReplaySpeed(0.5).payload.speed).toBe(0.75);
      expect(upReplaySpeed(0.75).payload.speed).toBe(1);
      expect(upReplaySpeed(1).payload.speed).toBe(1.33);
      expect(upReplaySpeed(1.33).payload.speed).toBe(2);
      expect(upReplaySpeed(2).payload.speed).toBe(4);
      expect(upReplaySpeed(4).payload.speed).toBe(4);
    });
  });

  describe("upReplaySpeed", () => {
    it("should up replay speed to next lower speed", () => {
      const actual = downReplaySpeed(4);

      const expected: ChangeReplaySpeedAction = {
        type: ReplayActionsType.ChangeReplaySpeed,
        payload: {
          speed: 2,
        },
      };

      expect(actual).toEqual(expected);
      expect(downReplaySpeed(2).payload.speed).toBe(1.33);
      expect(downReplaySpeed(1.33).payload.speed).toBe(1);
      expect(downReplaySpeed(1).payload.speed).toBe(0.75);
      expect(downReplaySpeed(0.75).payload.speed).toBe(0.5);
      expect(downReplaySpeed(0.5).payload.speed).toBe(0.25);
      expect(downReplaySpeed(0.25).payload.speed).toBe(0.25);
    });
  });

  describe("changeStep", () => {
    it("should be change forward without histories", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeTetrominos("JO"),
            noOfCycle: 1,
          },
        ],
        hold: makeHold(Tetromino.T, false),
        nexts: makeTetrominos("JO"),
        noOfCycle: 1,
        replaySteps: [
          makeReplayDropStep(Direction.Down, 1, 1),
          makeReplayHardDropStep(),
        ],
        step: 0,
      });

      const conductor = getReplayConductor(state);
      const actual = changeStep(conductor, 2);

      const expected: ChangeStepAction = {
        type: ReplayActionsType.ChangeStep,
        payload: {
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
          field: makeField("IIIINNNNNN"),
          hold: makeHold(Tetromino.T, true),
          isDead: false,
          nexts: makeTetrominos("O"),
          noOfCycle: 2,
          histories: [
            { ...state.histories[0] },
            {
              ...state.histories[0],
              current: makeCurrent(Direction.Down, 1, 1, Tetromino.I),
            },
            {
              current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
              field: makeField("IIIINNNNNN"),
              hold: makeHold(Tetromino.T, true),
              isDead: false,
              nexts: makeTetrominos("O"),
              noOfCycle: 2,
            },
          ],
          step: 2,
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should be change forward with histories", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeTetrominos("JO"),
            noOfCycle: 1,
          },
          {
            current: makeCurrent(Direction.Down, 1, 1, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeTetrominos("JO"),
            noOfCycle: 1,
          },
          {
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
            field: makeField("IIIINNNNNN"),
            hold: makeHold(Tetromino.T, true),
            isDead: false,
            nexts: makeTetrominos("O"),
            noOfCycle: 2,
          },
        ],
        hold: makeHold(Tetromino.T, false),
        nexts: makeTetrominos("JO"),
        noOfCycle: 1,
        replaySteps: [
          makeReplayDropStep(Direction.Down, 1, 1),
          makeReplayHardDropStep(),
        ],
        step: 0,
      });

      const conductor = getReplayConductor(state);
      const actual = changeStep(conductor, 2);

      const expected: ChangeStepAction = {
        type: ReplayActionsType.ChangeStep,
        payload: {
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
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should be change backward", () => {
      const state = makeReplayState({
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
        field: makeField("IIIINNNNNN"),
        histories: [
          {
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeTetrominos("JO"),
            noOfCycle: 1,
          },
          {
            current: makeCurrent(Direction.Down, 1, 1, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            nexts: makeTetrominos("JO"),
            noOfCycle: 1,
          },
          {
            current: makeCurrent(Direction.Up, 4, 19, Tetromino.J),
            field: makeField("IIIINNNNNN"),
            hold: makeHold(Tetromino.T, true),
            isDead: false,
            nexts: makeTetrominos("O"),
            noOfCycle: 2,
          },
        ],
        hold: makeHold(Tetromino.T, true),
        isDead: false,
        nexts: makeTetrominos("O"),
        noOfCycle: 2,
        replaySteps: [
          makeReplayDropStep(Direction.Down, 1, 1),
          makeReplayHardDropStep(),
        ],
        step: 2,
      });

      const conductor = getReplayConductor(state);
      const actual = changeStep(conductor, 0);

      const expected: ChangeStepAction = {
        type: ReplayActionsType.ChangeStep,
        payload: {
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
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });
  });
});
