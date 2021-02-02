import { getSimuConductor } from "ducks/simu/selectors";
import { SimuState } from "stores/SimuState";
import {
  AttackType,
  BtbState,
  Direction,
  SpinType,
  Tetromino,
} from "types/core";
import { makeCurrent } from "../../../utils/tetsimu/testUtils/makeCurrent";
import { makeField } from "../../../utils/tetsimu/testUtils/makeField";
import { makeHold } from "../../../utils/tetsimu/testUtils/makeHold";
import {
  makeNextNote,
  makeNextNotes,
} from "../../../utils/tetsimu/testUtils/makeNextNote";
import { makeSeed } from "../../../utils/tetsimu/testUtils/makeSeed";
import { makeSimuState } from "../../../utils/tetsimu/testUtils/makeSimuState";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep,
} from "../testUtils/makeReplayStep";
import { makeTetrominos } from "../testUtils/makeTetrominos";

describe("simuConductor", () => {
  describe("holdTetrimino", () => {
    it("should hold", () => {
      const state = makeSimuState({
        attackTypes: [AttackType.BtbTetris],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Down, 1, 5, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.None, true),
        nexts: {
          bag: makeNextNote("JI", 2),
          settled: makeTetrominos("SZ"),
          unsettled: makeNextNotes("J I"),
        },
        ren: 3,
        replayNexts: makeTetrominos("SZ"),
        replayNextStep: 2,
        seed: makeSeed(1),
      });
      const conductor = getSimuConductor(state);
      expect(conductor.holdTetromino()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: SimuState = {
        ...state,
        attackTypes: [AttackType.BtbTetris],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.S),
        garbages: [],
        histories: [
          {
            attackTypes: [AttackType.BtbTetris],
            btbState: BtbState.Btb,
            currentType: Tetromino.S,
            field: state.field,
            garbages: [],
            hold: makeHold(Tetromino.I, false),
            isDead: false,
            lastRoseUpColumn: -1,
            nexts: {
              bag: makeNextNote("I", 1),
              settled: makeTetrominos("ZJ"),
              unsettled: makeNextNotes("I"),
            },
            ren: 3,
            replayNextStep: 3,
            replayStep: 1,
            seed: makeSeed(41702199),
          },
        ],
        hold: makeHold(Tetromino.I, false),
        isDead: false,
        nexts: {
          bag: makeNextNote("I", 1),
          settled: makeTetrominos("ZJ"),
          unsettled: makeNextNotes("I"),
        },
        ren: 3,
        replayNexts: makeTetrominos("SZJ"),
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
        attackTypes: [AttackType.Tsd],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Down, 1, 5, Tetromino.T),
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.L, true),
        nexts: {
          bag: makeNextNote("JI", 2),
          settled: makeTetrominos("SZ"),
          unsettled: makeNextNotes("J I"),
        },
        ren: 5,
        replayNexts: makeTetrominos("SZ"),
        replayNextStep: 2,
        seed: makeSeed(2),
      });
      const conductor = getSimuConductor(state);
      expect(conductor.holdTetromino()).toBeTruthy();

      const actual = { ...conductor.state };

      const expected: SimuState = {
        ...state,
        attackTypes: [AttackType.Tsd],
        btbState: BtbState.Btb,
        current: makeCurrent(Direction.Up, 4, 19, Tetromino.L),
        garbages: [],
        histories: [
          {
            attackTypes: [AttackType.Tsd],
            btbState: BtbState.Btb,
            currentType: Tetromino.L,
            field: state.field,
            garbages: [],
            hold: makeHold(Tetromino.T, false),
            isDead: false,
            lastRoseUpColumn: -1,
            nexts: {
              bag: makeNextNote("JI", 2),
              settled: makeTetrominos("SZ"),
              unsettled: makeNextNotes("J I"),
            },
            ren: 5,
            replayNextStep: 2,
            replayStep: 1,
            seed: makeSeed(2),
          },
        ],
        hold: makeHold(Tetromino.T, false),
        isDead: false,
        nexts: {
          bag: makeNextNote("JI", 2),
          settled: makeTetrominos("SZ"),
          unsettled: makeNextNotes("J I"),
        },
        ren: 5,
        replayNexts: makeTetrominos("SZ"),
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
        current: makeCurrent(Direction.Up, 1, 5, Tetromino.I),
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.None, false),
        nexts: {
          settled: makeTetrominos("SZ"),
          unsettled: makeNextNotes("J I"),
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
          attackTypes: [AttackType.PerfectClear, AttackType.Single],
          btbState: BtbState.Btb,
          current: makeCurrent(Direction.Up, 1, 3, Tetromino.I),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
            "IJLOSTZNNN"
          ),
          hold: makeHold(Tetromino.I, false),
          nexts: {
            bag: makeNextNote("JI", 2),
            settled: makeTetrominos("SZ"),
            unsettled: makeNextNotes("J I"),
          },
          ren: 3,
          replayNexts: makeTetrominos("SZ"),
          replayNextStep: 2,
          seed: makeSeed(3),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.hardDropTetromino()).toBeTruthy();

        const actual = { ...conductor.state };

        const expected: SimuState = {
          ...state,
          attackTypes: [],
          btbState: BtbState.Btb,
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.S),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "IIIINNNNNN",
            "IJLOSTZNNN"
          ),
          garbages: [],
          histories: [
            {
              attackTypes: [],
              btbState: BtbState.Btb,
              currentType: Tetromino.S,
              // prettier-ignore
              field: makeField(
                "NNNNNNNNNN",
                "IIIINNNNNN",
                "IJLOSTZNNN"
              ),
              garbages: [],
              hold: makeHold(Tetromino.I, true),
              isDead: false,
              lastRoseUpColumn: -1,
              nexts: {
                bag: makeNextNote("I", 1),
                settled: makeTetrominos("ZJ"),
                unsettled: makeNextNotes("I"),
              },
              ren: -1,
              replayNextStep: 3,
              replayStep: 2,
              seed: makeSeed(55079790),
            },
          ],
          hold: makeHold(Tetromino.I, true),
          isDead: false,
          nexts: {
            bag: makeNextNote("I", 1),
            settled: makeTetrominos("ZJ"),
            unsettled: makeNextNotes("I"),
          },
          ren: -1,
          replayNexts: makeTetrominos("SZJ"),
          replayNextStep: 3,
          replayStep: 2,
          replaySteps: [
            makeReplayDropStep(Direction.Up, 1, 1),
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
          current: makeCurrent(Direction.Up, 2, 3, Tetromino.I, SpinType.Spin),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.Left)).toBeTruthy();

        const actual = { ...conductor.state };

        const expected: SimuState = {
          ...state,
          current: makeCurrent(Direction.Up, 1, 3, Tetromino.I, SpinType.None),
        };

        expect(actual).toEqual(expected);
      });

      it("should not move left because it reaches left edge", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Up, 1, 3, Tetromino.I, SpinType.Spin),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.Left)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should not move left because block exists", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Up, 2, 1, Tetromino.I, SpinType.Mini),
          // prettier-ignore
          field: makeField(
            "ZNNNNNNNNN",
            "NNNNNNNNNN"),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.Left)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should move right", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Up, 7, 3, Tetromino.T, SpinType.Mini),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN"),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.Right)).toBeTruthy();

        const actual = { ...conductor.state };

        const expected: SimuState = {
          ...state,
          current: makeCurrent(Direction.Up, 8, 3, Tetromino.T, SpinType.None),
        };

        expect(actual).toEqual(expected);
      });

      it("should not move right because it reaches right edge", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Up, 8, 3, Tetromino.T, SpinType.Spin),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN"),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.Right)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should not move right because block exists", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Up, 7, 1, Tetromino.T, SpinType.Spin),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNI",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.Right)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should move down", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Up, 1, 3, Tetromino.O, SpinType.Spin),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.Down)).toBeTruthy();

        const actual = { ...conductor.state };

        const expected: SimuState = {
          ...state,
          current: makeCurrent(Direction.Up, 1, 2, Tetromino.O, SpinType.None),
        };

        expect(actual).toEqual(expected);
      });

      it("should not move down because it reaches bottom edge", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Up, 3, 0, Tetromino.O, SpinType.Spin),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNNNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.Down)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });

      it("should not move down because block exists", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Up, 3, 1, Tetromino.O, SpinType.Mini),
          // prettier-ignore
          field: makeField(
            "NNNNNNNNNN",
            "NNNTNNNNNN",
          ),
        });
        const conductor = getSimuConductor(state);
        expect(conductor.moveTetromino(Direction.Down)).toBeFalsy();

        const actual = { ...conductor.state };

        expect(actual).toEqual(state);
      });
    });

    describe("rotateTetromino", () => {
      it("should rotate right", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.T, SpinType.Spin),
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
            direction: Direction.Right,
            pos: { x: 4, y: 19 },
            spinType: SpinType.None,
            type: Tetromino.T,
          },
        };

        expect(actual).toEqual(expected);
      });

      it("should not rotate right", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Left, 0, 1, Tetromino.I),
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
          current: makeCurrent(Direction.Up, 4, 19, Tetromino.T),
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
            direction: Direction.Left,
            pos: { x: 4, y: 19 },
            spinType: SpinType.None,
            type: Tetromino.T,
          },
        };

        expect(actual).toEqual(expected);
      });

      it("should not rotate left", () => {
        const state = makeSimuState({
          current: makeCurrent(Direction.Left, 0, 1, Tetromino.I),
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
