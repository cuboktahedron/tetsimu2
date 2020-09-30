import {
  hardDropTetromino,
  holdTetromino,
  moveTetromino,
  retry,
  rotateTetromino,
  superRetry,
} from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import {
  HardDropTetrominoAction,
  HoldTetrominoAction,
  MoveTetrominoAction,
  RotateTetrominoAction,
  SimuActionsType,
} from "ducks/simu/types";
import { Direction, FieldCellValue, Tetromino } from "types/core";
import { PlayMode, SimuRetryState } from "types/simu";
import { sleep } from "utils/function";
import { makeCurrent } from "../utils/tetsimu/testUtils/makeCurrent";
import { makeField } from "../utils/tetsimu/testUtils/makeField";
import { makeHold } from "../utils/tetsimu/testUtils/makeHold";
import { makeSeed } from "../utils/tetsimu/testUtils/makeSeed";
import { makeSimuState } from "../utils/tetsimu/testUtils/makeSimuState";

describe("simuModule", () => {
  describe("holdTetrimino", () => {
    it("should hold", () => {
      const actual = holdTetromino(
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.DOWN, 1, 5, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.NONE, true),
            nexts: {
              settled: [Tetromino.S, Tetromino.Z],
              unsettled: [
                {
                  candidates: [Tetromino.J],
                  take: 1,
                },
                {
                  candidates: [Tetromino.I],
                  take: 1,
                },
              ],
            },
            seed: makeSeed(1),
          })
        )
      );

      const expected: HoldTetrominoAction = {
        type: SimuActionsType.HoldTetromino,
        payload: {
          current: makeCurrent(Direction.UP, 4, 19, Tetromino.S),
          hold: makeHold(Tetromino.I, false),
          isDead: false,
          nexts: {
            settled: [Tetromino.Z, Tetromino.J],
            unsettled: [
              {
                candidates: [Tetromino.I],
                take: 1,
              },
            ],
          },
          seed: makeSeed(41702199),
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should exchange current and hold", () => {
      const actual = holdTetromino(
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.DOWN, 1, 5, Tetromino.T),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.L, true),
            nexts: {
              settled: [Tetromino.S, Tetromino.Z],
              unsettled: [
                {
                  candidates: [Tetromino.J],
                  take: 1,
                },
                {
                  candidates: [Tetromino.I],
                  take: 1,
                },
              ],
            },
            seed: makeSeed(2),
          })
        )
      );

      const expected: HoldTetrominoAction = {
        type: SimuActionsType.HoldTetromino,
        payload: {
          current: makeCurrent(Direction.UP, 4, 19, Tetromino.L),
          hold: makeHold(Tetromino.T, false),
          isDead: false,
          nexts: {
            settled: [Tetromino.S, Tetromino.Z],
            unsettled: [
              {
                candidates: [Tetromino.J],
                take: 1,
              },
              {
                candidates: [Tetromino.I],
                take: 1,
              },
            ],
          },
          seed: makeSeed(2),
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should not hold", () => {
      const actual = holdTetromino(
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 1, 5, Tetromino.I),
            field: makeField("NNNNNNNNNN"),
            hold: makeHold(Tetromino.NONE, false),
            nexts: {
              settled: [Tetromino.S, Tetromino.Z],
              unsettled: [
                {
                  candidates: [Tetromino.J],
                  take: 1,
                },
                {
                  candidates: [Tetromino.I],
                  take: 1,
                },
              ],
            },
            seed: makeSeed(),
          })
        )
      );

      const expected: HoldTetrominoAction = {
        type: SimuActionsType.HoldTetromino,
        payload: {
          succeeded: false,
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("hardDropTetrimino", () => {
    it("should drop and generate next", () => {
      const actual = hardDropTetromino(
        getSimuConductor(
          makeSimuState({
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
              unsettled: [
                {
                  candidates: [Tetromino.J],
                  take: 1,
                },
                {
                  candidates: [Tetromino.I],
                  take: 1,
                },
              ],
            },
            seed: makeSeed(3),
          })
        )
      );

      const expected: HardDropTetrominoAction = {
        type: SimuActionsType.HardDropTetromino,
        payload: {
          current: makeCurrent(Direction.UP, 4, 19, Tetromino.S),

          // prettier-ignore
          field: makeField(
              "NNNNNNNNNN",
              "IIIINNNNNN",
              "IJLOSTZNNN"),
          hold: makeHold(Tetromino.I, true),
          isDead: false,
          nexts: {
            settled: [Tetromino.Z, Tetromino.J],
            unsettled: [
              {
                candidates: [Tetromino.I],
                take: 1,
              },
            ],
          },
          seed: makeSeed(55079790),
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("moveTetrimino", () => {
    it("should move left", () => {
      const actual = moveTetromino(
        Direction.LEFT,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 2, 3, Tetromino.I),
            // prettier-ignore
            field: makeField(
              "NNNNNNNNNN",
              "NNNNNNNNNN",
            ),
          })
        )
      );

      const expected: MoveTetrominoAction = {
        type: SimuActionsType.MoveTetromino,
        payload: {
          current: makeCurrent(Direction.UP, 1, 3, Tetromino.I),
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should not move left because it reaches left edge", () => {
      const actual = moveTetromino(
        Direction.LEFT,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 1, 3, Tetromino.I),
            // prettier-ignore
            field: makeField(
              "NNNNNNNNNN",
              "NNNNNNNNNN",
            ),
          })
        )
      );

      const expected: MoveTetrominoAction = {
        type: SimuActionsType.MoveTetromino,
        payload: {
          succeeded: false,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should not move left because block exists", () => {
      const actual = moveTetromino(
        Direction.LEFT,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 2, 1, Tetromino.I),
            // prettier-ignore
            field: makeField(
              "ZNNNNNNNNN",
              "NNNNNNNNNN"),
          })
        )
      );

      const expected: MoveTetrominoAction = {
        type: SimuActionsType.MoveTetromino,
        payload: {
          succeeded: false,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should move right", () => {
      const actual = moveTetromino(
        Direction.RIGHT,

        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 7, 3, Tetromino.T),
            // prettier-ignore
            field: makeField(
              "NNNNNNNNNN",
              "NNNNNNNNNN"),
          })
        )
      );

      const expected: MoveTetrominoAction = {
        type: SimuActionsType.MoveTetromino,
        payload: {
          current: makeCurrent(Direction.UP, 8, 3, Tetromino.T),
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should not move left because it reaches right edge", () => {
      const actual = moveTetromino(
        Direction.RIGHT,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 8, 3, Tetromino.T),
            // prettier-ignore
            field: makeField(
              "NNNNNNNNNN",
              "NNNNNNNNNN"),
          })
        )
      );

      const expected: MoveTetrominoAction = {
        type: SimuActionsType.MoveTetromino,
        payload: {
          succeeded: false,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should not move right because block exists", () => {
      const actual = moveTetromino(
        Direction.RIGHT,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 7, 1, Tetromino.T),
            // prettier-ignore
            field: makeField(
              "NNNNNNNNNI",
              "NNNNNNNNNN",
            ),
          })
        )
      );

      const expected: MoveTetrominoAction = {
        type: SimuActionsType.MoveTetromino,
        payload: {
          succeeded: false,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should move down", () => {
      const actual = moveTetromino(
        Direction.DOWN,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 1, 3, Tetromino.O),
            // prettier-ignore
            field: makeField(
              "NNNNNNNNNN",
              "NNNNNNNNNN",
            ),
          })
        )
      );

      const expected: MoveTetrominoAction = {
        type: SimuActionsType.MoveTetromino,
        payload: {
          current: makeCurrent(Direction.UP, 1, 2, Tetromino.O),
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should not move down because it reaches bottom edge", () => {
      const actual = moveTetromino(
        Direction.DOWN,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 3, 0, Tetromino.O),
            // prettier-ignore
            field: makeField(
              "NNNNNNNNNN",
              "NNNNNNNNNN",
            ),
          })
        )
      );

      const expected: MoveTetrominoAction = {
        type: SimuActionsType.MoveTetromino,
        payload: {
          succeeded: false,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should not move down because block exists", () => {
      const actual = moveTetromino(
        Direction.DOWN,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 3, 1, Tetromino.O),
            // prettier-ignore
            field: makeField(
              "NNNNNNNNNN",
              "NNNTNNNNNN",
            ),
          })
        )
      );

      const expected: MoveTetrominoAction = {
        type: SimuActionsType.MoveTetromino,
        payload: {
          succeeded: false,
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("retry", () => {
    it("should retry from initial state", () => {
      const config = { nextNum: 3 };
      const retryState = {
        field: makeField("IJLOSTZNNN"),
        hold: {
          canHold: false,
          type: Tetromino.T,
        },
        lastRoseUpColumn: -1,
        unsettledNexts: [
          {
            candidates: [Tetromino.I],
            take: 1,
          },
        ],
        seed: makeSeed(1),
      };

      const actual1 = retry(
        getSimuConductor(
          makeSimuState({
            config,
            retryState,
          })
        )
      );
      const actual2 = retry(
        getSimuConductor(
          makeSimuState({
            config,
            retryState,
          })
        )
      );

      expect(actual1).toEqual(actual2);
      expect(actual1.type).toBe(SimuActionsType.Retry);
      expect(actual1.payload.field).toEqual(retryState.field);
      expect(actual1.payload.nexts.settled.length).toEqual(12);
      expect(actual1.payload.current.type).toEqual(Tetromino.I);
    });
  });

  describe("superRetry", () => {
    it("should retry from initial state with another seed", async () => {
      const config = { nextNum: 3 };
      const retryState: SimuRetryState = {
        field: makeField("IJLOSTZNNN"),
        hold: {
          canHold: false,
          type: Tetromino.T,
        },
        lastRoseUpColumn: -1,
        unsettledNexts: [
          {
            candidates: [Tetromino.I, Tetromino.J, Tetromino.L],
            take: 3,
          },
        ],
        seed: makeSeed(1),
      };

      const actual1 = superRetry(
        getSimuConductor(
          makeSimuState({
            config,
            retryState,
          })
        )
      );
      await sleep(1); // to shift initial random seed
      const actual2 = superRetry(
        getSimuConductor(
          makeSimuState({
            config,
            retryState,
          })
        )
      );

      expect(actual1).not.toEqual(actual2);
      expect(actual1.type).toBe(SimuActionsType.SuperRetry);
      expect(actual1.payload.field).toEqual(actual2.payload.field);
      expect(actual1.payload.hold).toEqual(actual2.payload.hold);
      expect(actual1.payload.lastRoseUpColumn).toEqual(
        actual2.payload.lastRoseUpColumn
      );
      expect(actual1.payload.retryState.field).toEqual(
        actual2.payload.retryState.field
      );
      expect(actual1.payload.retryState.hold).toEqual(
        actual2.payload.retryState.hold
      );
      expect(actual1.payload.retryState.unsettledNexts).toEqual(
        actual2.payload.retryState.unsettledNexts
      );
    });

    it("should retry with dig mode(rose up rate 100%)", async () => {
      const config = {
        playMode: PlayMode.Dig,
        riseUpRate: { first: 100, second: 100 },
      };
      const retryState: SimuRetryState = {
        field: makeField("IJLOSTZNNN"),
        hold: {
          canHold: false,
          type: Tetromino.T,
        },
        lastRoseUpColumn: 1,
        unsettledNexts: [],
        seed: makeSeed(1),
      };

      const actual = superRetry(
        getSimuConductor(
          makeSimuState({
            config,
            field: makeField(),
            retryState,
          })
        )
      );

      // Lines(< 16) are buried garbages and all lines are same pattern.
      expect(actual.payload.lastRoseUpColumn).toBe(1);
      expect(actual.payload.field).toEqual(
        // prettier-ignore
        makeField(
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG",
          "GNGGGGGGGG"
        )
      );
    });

    it("should retry with dig mode(rose up rate 0%)", async () => {
      const config = {
        playMode: PlayMode.Dig,
        riseUpRate: { first: 0, second: 0 },
      };
      const retryState: SimuRetryState = {
        field: makeField("IJLOSTZNNN"),
        hold: {
          canHold: false,
          type: Tetromino.T,
        },
        lastRoseUpColumn: 1,
        unsettledNexts: [],
        seed: makeSeed(1),
      };

      const actual = superRetry(
        getSimuConductor(
          makeSimuState({
            config,
            field: makeField(),
            retryState,
          })
        )
      );

      // Lines(< 16) are buried garbages and each line is different pattern.
      const garbegeHeight = 16;
      const noneCols = actual.payload.field
        .slice(0, garbegeHeight)
        .map((row) => row.findIndex((cell) => cell === FieldCellValue.NONE));
      for (let i = 0; i < garbegeHeight - 1; i++) {
        expect(noneCols[i]).not.toBe(noneCols[i + 1]);
      }

      // Lines(<= 16) are not buried garbage
      expect(actual.payload.field[garbegeHeight]).toEqual(
        new Array(10).fill(FieldCellValue.NONE)
      );
    });
  });

  describe("rotateTetromino", () => {
    it("should rotate right", () => {
      const actual = rotateTetromino(
        true,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.T),
            // prettier-ignore
            field: makeField(
              "NNNNNNNNNN",
              "NNNNNNNNNN",
            ),
          })
        )
      );

      const expected: RotateTetrominoAction = {
        type: SimuActionsType.RotateTetromino,
        payload: {
          current: {
            direction: Direction.RIGHT,
            pos: { x: 4, y: 19 },
            type: Tetromino.T,
          },
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should not rotate right", () => {
      const actual = rotateTetromino(
        true,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.LEFT, 0, 1, Tetromino.I),
            // prettier-ignore
            field: makeField(
              "NGGGGGGGGG",
              "NGGGGGGGGG",
              "NGGGGGGGGG",
              "NGGGGGGGGG",
            ),
          })
        )
      );

      const expected: RotateTetrominoAction = {
        type: SimuActionsType.RotateTetromino,
        payload: {
          succeeded: false,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate left", () => {
      const actual = rotateTetromino(
        false,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.UP, 4, 19, Tetromino.T),
            // prettier-ignore
            field: makeField(
              "NNNNNNNNNN",
              "NNNNNNNNNN",
            ),
          })
        )
      );

      const expected: RotateTetrominoAction = {
        type: SimuActionsType.RotateTetromino,
        payload: {
          current: {
            direction: Direction.LEFT,
            pos: { x: 4, y: 19 },
            type: Tetromino.T,
          },
          succeeded: true,
        },
      };

      expect(actual).toEqual(expected);
    });

    it("should not rotate left", () => {
      const actual = rotateTetromino(
        false,
        getSimuConductor(
          makeSimuState({
            current: makeCurrent(Direction.LEFT, 0, 1, Tetromino.I),
            // prettier-ignore
            field: makeField(
              "NGGGGGGGGG",
              "NGGGGGGGGG",
              "NGGGGGGGGG",
              "NGGGGGGGGG",
            ),
          })
        )
      );

      const expected: RotateTetrominoAction = {
        type: SimuActionsType.RotateTetromino,
        payload: {
          succeeded: false,
        },
      };

      expect(actual).toEqual(expected);
    });
  });
});
