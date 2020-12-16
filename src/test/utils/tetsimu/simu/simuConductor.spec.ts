import { getSimuConductor } from "ducks/simu/selectors";
import { SimuState } from "stores/SimuState";
import { Direction, Tetromino } from "types/core";
import { makeCurrent } from "../../../utils/tetsimu/testUtils/makeCurrent";
import { makeField } from "../../../utils/tetsimu/testUtils/makeField";
import { makeHold } from "../../../utils/tetsimu/testUtils/makeHold";
import { makeNextNote } from "../../../utils/tetsimu/testUtils/makeNextNote";
import { makeSeed } from "../../../utils/tetsimu/testUtils/makeSeed";
import { makeSimuState } from "../../../utils/tetsimu/testUtils/makeSimuState";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep,
} from "../testUtils/makeReplayStep";

describe("simuConductor", () => {
  describe("holdTetrimino", () => {
    it("should hold", () => {
      const state = makeSimuState({
        current: makeCurrent(Direction.DOWN, 1, 5, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.NONE, true),
        nexts: {
          settled: [Tetromino.S, Tetromino.Z],
          unsettled: [makeNextNote("J", 1), makeNextNote("I", 1)],
          bag: makeNextNote("JI", 2),
        },
        replayNexts: [Tetromino.S, Tetromino.Z],
        replayNextStep: 2,
        seed: makeSeed(1),
      });
      const conductor = getSimuConductor(state);
      expect(conductor.holdTetromino()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: SimuState = {
        ...state,
        current: makeCurrent(Direction.UP, 4, 19, Tetromino.S),
        histories: [
          {
            currentType: Tetromino.S,
            field: state.field,
            hold: makeHold(Tetromino.I, false),
            isDead: false,
            lastRoseUpColumn: -1,
            nexts: {
              settled: [Tetromino.Z, Tetromino.J],
              unsettled: [makeNextNote("I", 1)],
              bag: makeNextNote("I", 1),
            },
            replayNextStep: 3,
            replayStep: 1,
            seed: makeSeed(41702199),
          },
        ],
        hold: makeHold(Tetromino.I, false),
        isDead: false,
        nexts: {
          settled: [Tetromino.Z, Tetromino.J],
          unsettled: [makeNextNote("I", 1)],
          bag: makeNextNote("I", 1),
        },
        replayNexts: [Tetromino.S, Tetromino.Z, Tetromino.J],
        replayNextStep: 3,
        replayStep: 1,
        replaySteps: [makeReplayHoldStep()],
        step: 1,
        seed: makeSeed(41702199),
      };

      expect(actual).toEqual(expected);
    });

    it("should exchange current and hold", () => {
      const state = makeSimuState({
        current: makeCurrent(Direction.DOWN, 1, 5, Tetromino.T),
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.L, true),
        nexts: {
          settled: [Tetromino.S, Tetromino.Z],
          unsettled: [makeNextNote("J", 1), makeNextNote("I", 1)],
          bag: makeNextNote("JI", 2),
        },
        replayNexts: [Tetromino.S, Tetromino.Z],
        replayNextStep: 2,
        seed: makeSeed(2),
      });
      const conductor = getSimuConductor(state);
      expect(conductor.holdTetromino()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: SimuState = {
        ...state,
        current: makeCurrent(Direction.UP, 4, 19, Tetromino.L),
        histories: [
          {
            currentType: Tetromino.L,
            field: state.field,
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            lastRoseUpColumn: -1,
            nexts: {
              settled: [Tetromino.S, Tetromino.Z],
              unsettled: [makeNextNote("J", 1), makeNextNote("I", 1)],
              bag: makeNextNote("JI", 2),
            },
            replayNextStep: 2,
            replayStep: 1,
            seed: makeSeed(2),
          },
        ],
        hold: makeHold(Tetromino.T, false),
        isDead: false,
        nexts: {
          settled: [Tetromino.S, Tetromino.Z],
          unsettled: [makeNextNote("J", 1), makeNextNote("I", 1)],
          bag: makeNextNote("JI", 2),
        },
        replayNexts: [Tetromino.S, Tetromino.Z],
        replayNextStep: 2,
        replayStep: 1,
        replaySteps: [makeReplayHoldStep()],
        step: 1,
        seed: makeSeed(2),
      };

      expect(actual).toEqual(expected);
    });

    it("should not hold", () => {
      const state = makeSimuState({
        current: makeCurrent(Direction.UP, 1, 5, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.NONE, false),
        nexts: {
          settled: [Tetromino.S, Tetromino.Z],
          unsettled: [makeNextNote("J", 1), makeNextNote("I", 1)],
        },
        seed: makeSeed(),
      });
      const conductor = getSimuConductor(state);
      expect(conductor.holdTetromino()).toBeFalsy();

      const actual = { ...conductor.state };

      expect(actual).toEqual(state);
    });

    describe("hardDropTetrimino", () => {
      it("should drop and generate next", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 1, 3, Tetromino.I),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
            "IJLOSTZNNN"
          ),
          hold: makeHold(Tetromino.I, false),
          nexts: {
            settled: [Tetromino.S, Tetromino.Z],
            unsettled: [makeNextNote("J", 1), makeNextNote("I", 1)],
            bag: makeNextNote("JI", 2),
          },
          replayNexts: [Tetromino.S, Tetromino.Z],
          replayNextStep: 2,
          seed: makeSeed(3),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.hardDropTetromino()).toBeTruthy();

        const actual = { ...conductor.state };

        const expected: SimuState = {
          ...state,
          current: makeCurrent(Direction.UP, 4, 19, Tetromino.S),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "IIIINNNNNN",
            "IJLOSTZNNN"
          ),
          histories: [
            {
              currentType: Tetromino.S,
              // prettier-ignore
              field: makeField(
                "NNNNNNNNNN",
                "IIIINNNNNN",
                "IJLOSTZNNN"
              ),
              hold: makeHold(Tetromino.I, true),
              isDead: false,
              lastRoseUpColumn: -1,
              nexts: {
                settled: [Tetromino.Z, Tetromino.J],
                unsettled: [makeNextNote("I", 1)],
                bag: makeNextNote("I", 1),
              },
              replayNextStep: 3,
              replayStep: 2,
              seed: makeSeed(55079790),
            },
          ],
          hold: makeHold(Tetromino.I, true),
          isDead: false,
          nexts: {
            settled: [Tetromino.Z, Tetromino.J],
            unsettled: [makeNextNote("I", 1)],
            bag: makeNextNote("I", 1),
          },
          replayNexts: [Tetromino.S, Tetromino.Z, Tetromino.J],
          replayNextStep: 3,
          replayStep: 2,
          replaySteps: [
            makeReplayDropStep(Direction.UP, 1, 1),
            makeReplayHardDropStep(),
          ],
          seed: makeSeed(55079790),
          step: 1,
        };

        expect(actual).toEqual(expected);
      });
    });

    describe("moveTetrimino", () => {
      it("should move left", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 2, 3, Tetromino.I),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.LEFT)).toBeTruthy();

        const actual = { ...conductor.state };

        const expected: SimuState = {
          ...state,
          current: makeCurrent(Direction.UP, 1, 3, Tetromino.I),
        };

        expect(actual).toEqual(expected);
      });

      it("should not move left because it reaches left edge", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 1, 3, Tetromino.I),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.LEFT)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should not move left because block exists", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 2, 1, Tetromino.I),
          // prettier-ignore
          field: makeField(
            "ZNNNNNNNNN",
            "NNNNNNNNNN"),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.LEFT)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should move right", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 7, 3, Tetromino.T),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN"),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.RIGHT)).toBeTruthy();

        const actual = { ...conductor.state };

        const expected: SimuState = {
          ...state,
          current: makeCurrent(Direction.UP, 8, 3, Tetromino.T),
        };

        expect(actual).toEqual(expected);
      });

      it("should not move right because it reaches right edge", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 8, 3, Tetromino.T),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN"),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.RIGHT)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should not move right because block exists", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 7, 1, Tetromino.T),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNI",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.RIGHT)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should move down", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 1, 3, Tetromino.O),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.DOWN)).toBeTruthy();

        const actual = { ...conductor.state };

        const expected: SimuState = {
          ...state,
          current: makeCurrent(Direction.UP, 1, 2, Tetromino.O),
        };

        expect(actual).toEqual(expected);
      });

      it("should not move down because it reaches bottom edge", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 3, 0, Tetromino.O),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.DOWN)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should not move down because block exists", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 3, 1, Tetromino.O),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNTNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.DOWN)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });
    });

    describe("rotateTetromino", () => {
      it("should rotate right", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 4, 19, Tetromino.T),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.rotateTetrominoRight()).toBeTruthy();

        const actual = { ...conductor.state };

        const expected: SimuState = {
          ...state,
          current: {
            direction: Direction.RIGHT,
            pos: { x: 4, y: 19 },
            type: Tetromino.T,
          },
        };

        expect(actual).toEqual(expected);
      });

      it("should not rotate right", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.LEFT, 0, 1, Tetromino.I),
          // prettier-ignore
          field: makeField(
            "NGGGGGGGGG",
            "NGGGGGGGGG",
            "NGGGGGGGGG",
            "NGGGGGGGGG",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.rotateTetrominoRight()).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should rotate left", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.UP, 4, 19, Tetromino.T),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.rotateTetrominoLeft()).toBeTruthy();

        const actual = { ...conductor.state };

        const expected: SimuState = {
          ...state,
          current: {
            direction: Direction.LEFT,
            pos: { x: 4, y: 19 },
            type: Tetromino.T,
          },
        };

        expect(actual).toEqual(expected);
      });

      it("should not rotate left", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.LEFT, 0, 1, Tetromino.I),
          // prettier-ignore
          field: makeField(
            "NGGGGGGGGG",
            "NGGGGGGGGG",
            "NGGGGGGGGG",
            "NGGGGGGGGG",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.rotateTetrominoLeft()).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });
    });
  });
});
