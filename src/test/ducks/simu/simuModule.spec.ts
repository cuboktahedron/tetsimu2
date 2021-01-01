import { retry, superRetry } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import { SimuActionsType } from "ducks/simu/types";
import { FieldCellValue, MAX_FIELD_WIDTH, Tetromino } from "types/core";
import { PlayMode, SimuRetryState } from "types/simu";
import { sleep } from "utils/function";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import { makeField } from "../../utils/tetsimu/testUtils/makeField";
import { makeHold } from "../../utils/tetsimu/testUtils/makeHold";
import { makeNextNote } from "../../utils/tetsimu/testUtils/makeNextNote";
import { makeReplayHoldStep } from "../../utils/tetsimu/testUtils/makeReplayStep";
import { makeSeed } from "../../utils/tetsimu/testUtils/makeSeed";
import { makeSimuState } from "../../utils/tetsimu/testUtils/makeSimuState";

describe("simuModule", () => {
  describe("retry", () => {
    it("should retry from initial state", () => {
      const config = { nextNum: 3 };
      const retryState: SimuRetryState = {
        bag: makeNextNote("IOT", 3),
        field: makeField("IJLOSTZNNN"),
        hold: makeHold(Tetromino.T, false),
        lastRoseUpColumn: 3,
        unsettledNexts: new NextNotesInterpreter().interpret("I"),
        seed: makeSeed(1),
      };

      const actual1 = retry(
        getSimuConductor(
          makeSimuState({
            config,
            isDead: true,
            retryState,
            replayNexts: [Tetromino.I],
            replayNextStep: 10,
            replayStep: 1,
            replaySteps: [makeReplayHoldStep()],
            step: 3,
          })
        )
      );
      const actual2 = retry(
        getSimuConductor(
          makeSimuState({
            config,
            retryState,
            replayNexts: [Tetromino.I],
            replayNextStep: 10,
            replayStep: 1,
            replaySteps: [makeReplayHoldStep()],
            step: 3,
          })
        )
      );

      expect(actual1).toEqual(actual2);
      expect(actual1.type).toBe(SimuActionsType.Retry);
      expect(actual1.payload.current.type).toEqual(Tetromino.I);
      expect(actual1.payload.field).toEqual(retryState.field);
      expect(actual1.payload.hold).toEqual(retryState.hold);
      expect(actual1.payload.isDead).toBeFalsy();
      expect(actual1.payload.lastRoseUpColumn).toEqual(
        retryState.lastRoseUpColumn
      );
      expect(actual1.payload.nexts.settled.length).toEqual(12);
      expect(actual1.payload.replayNextStep).toEqual(12);
      expect(actual1.payload.replayNexts.length).toEqual(12);
      expect(actual1.payload.replayStep).toEqual(0);
      expect(actual1.payload.replaySteps.length).toEqual(0);
      expect(actual1.payload.step).toEqual(0);
    });
  });

  describe("superRetry", () => {
    it("should retry from initial state with another seed", async () => {
      const config = { nextNum: 3 };
      const retryState: SimuRetryState = {
        bag: makeNextNote("IOT", 3),
        field: makeField("IJLOSTZNNN"),
        hold: makeHold(Tetromino.T, false),
        lastRoseUpColumn: 3,
        unsettledNexts: new NextNotesInterpreter().interpret("[IJL]p3"),
        seed: makeSeed(1),
      };

      const actual1 = superRetry(
        getSimuConductor(
          makeSimuState({
            config,
            retryState,
            replayNexts: [Tetromino.I],
            replayNextStep: 10,
            replayStep: 1,
            replaySteps: [makeReplayHoldStep()],
            step: 3,
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
      expect(actual1.payload.current.type).toEqual(Tetromino.I);
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

      expect(actual1.payload.field).toEqual(retryState.field);
      expect(actual1.payload.hold).toEqual(retryState.hold);
      expect(actual1.payload.isDead).toBeFalsy();
      expect(actual1.payload.lastRoseUpColumn).toEqual(
        retryState.lastRoseUpColumn
      );
      expect(actual1.payload.nexts.settled.length).toEqual(12);
      expect(actual1.payload.replayNextStep).toEqual(12);
      expect(actual1.payload.replayNexts.length).toEqual(12);
      expect(actual1.payload.replayStep).toEqual(0);
      expect(actual1.payload.replaySteps.length).toEqual(0);
      expect(actual1.payload.step).toEqual(0);
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
        new Array(MAX_FIELD_WIDTH).fill(FieldCellValue.NONE)
      );
    });
  });
});
