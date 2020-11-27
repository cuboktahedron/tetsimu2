import { retry, superRetry } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import { SimuActionsType } from "ducks/simu/types";
import { FieldCellValue, Tetromino } from "types/core";
import { PlayMode, SimuRetryState } from "types/simu";
import { sleep } from "utils/function";
import { makeField } from "../../utils/tetsimu/testUtils/makeField";
import { makeNextNote } from "../../utils/tetsimu/testUtils/makeNextNote";
import { makeSeed } from "../../utils/tetsimu/testUtils/makeSeed";
import { makeSimuState } from "../../utils/tetsimu/testUtils/makeSimuState";

describe("simuModule", () => {
  describe("retry", () => {
    it("should retry from initial state", () => {
      const config = { nextNum: 3 };
      const retryState: SimuRetryState = {
        bag: makeNextNote("IOT", 3),
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
        bag: makeNextNote("IOT", 3),
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
      expect(actual1.payload.retryState.bag).toEqual(
        actual2.payload.retryState.bag
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
        bag: makeNextNote("IOT", 3),
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
        bag: makeNextNote("IOT", 3),
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

      // Lines(>= 16) are not buried garbage
      expect(actual.payload.field[garbegeHeight]).toEqual(
        new Array(10).fill(FieldCellValue.NONE)
      );
    });
  });
});
