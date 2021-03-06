import { retry, superRetry } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import { SimuActionsType } from "ducks/simu/types";
import {
  AttackType,
  BtbState,
  FieldCellValue,
  MAX_FIELD_WIDTH,
  Tetromino,
} from "types/core";
import { PlayMode, SimuRetryState } from "types/simu";
import { sleep } from "utils/function";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import { makeField } from "../../utils/tetsimu/testUtils/makeField";
import { makeGarbage } from "../../utils/tetsimu/testUtils/makeGarbage";
import { makeHold } from "../../utils/tetsimu/testUtils/makeHold";
import { makeNextNote } from "../../utils/tetsimu/testUtils/makeNextNote";
import { makeReplayHoldStep } from "../../utils/tetsimu/testUtils/makeReplayStep";
import { makeSeed } from "../../utils/tetsimu/testUtils/makeSeed";
import { makeSimuState } from "../../utils/tetsimu/testUtils/makeSimuState";

describe("simuModule", () => {
  describe("retry", () => {
    it("should retry from initial state", () => {
      const config = {
        nextNum: 3,
        garbage: {
          a1: 10,
          a2: 100,
          b1: 10,
          b2: 100,
          generates: true,
          level: 100,
        },
      };
      const retryState: SimuRetryState = {
        attackTypes: [AttackType.BtbTetris],
        bag: makeNextNote("IOT", 3),
        btbState: BtbState.Btb,
        field: makeField("IJLOSTZNNN"),
        garbages: [makeGarbage(0, 2), makeGarbage(8, 5)],
        hold: makeHold(Tetromino.T, false),
        lastRoseUpColumn: 3,
        ren: 2,
        seed: makeSeed(1),
        unsettledNexts: new NextNotesInterpreter().interpret("I"),
      };

      const actual1 = retry(
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
      expect(actual1.payload.attackTypes).toEqual([AttackType.BtbTetris]);
      expect(actual1.payload.btbState).toEqual(BtbState.Btb);
      expect(actual1.payload.current.type).toEqual(Tetromino.I);
      expect(actual1.payload.field).toEqual(retryState.field);
      expect(actual1.payload.garbages).toEqual(
        retryState.garbages.concat([
          makeGarbage(1, 1),
          makeGarbage(1, 1),
          makeGarbage(1, 1),
          makeGarbage(1, 1),
          makeGarbage(1, 1),
        ])
      );
      expect(actual1.payload.hold).toEqual(retryState.hold);
      expect(actual1.payload.isDead).toBeFalsy();
      expect(actual1.payload.lastRoseUpColumn).toEqual(
        retryState.lastRoseUpColumn
      );
      expect(actual1.payload.nexts.settled.length).toEqual(12);
      expect(actual1.payload.replayNextStep).toEqual(12);
      expect(actual1.payload.replayNexts.length).toEqual(12);
      expect(actual1.payload.ren).toEqual(2);
      expect(actual1.payload.replayStep).toEqual(0);
      expect(actual1.payload.replaySteps.length).toEqual(0);
      expect(actual1.payload.step).toEqual(0);
    });
  });

  describe("superRetry", () => {
    it("should retry from initial state with another seed", async () => {
      const config = {
        nextNum: 3,
        garbage: {
          a1: 150,
          a2: 5,
          b1: 10,
          b2: 100,
          generates: true,
          level: 100,
        },
      };
      const retryState: SimuRetryState = {
        attackTypes: [AttackType.BtbTsd],
        bag: makeNextNote("IOT", 3),
        btbState: BtbState.Btb,
        field: makeField("IJLOSTZNNN"),
        garbages: [makeGarbage(0, 1), makeGarbage(1, 1)],
        hold: makeHold(Tetromino.T, false),
        lastRoseUpColumn: 3,
        ren: 5,
        seed: makeSeed(1),
        unsettledNexts: new NextNotesInterpreter().interpret("[IJL]p3"),
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
      expect(actual1.payload.attackTypes).toEqual([AttackType.BtbTsd]);
      expect(actual1.payload.btbState).toEqual(BtbState.Btb);
      expect(actual1.payload.garbages.slice(0, 2)).toEqual(
        actual2.payload.garbages.slice(0, 2)
      );
      expect(actual1.payload.garbages).not.toEqual(actual2.payload.garbages);
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
      expect(actual1.payload.ren).toEqual(5);
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
        attackTypes: [],
        bag: makeNextNote("IOT", 3),
        btbState: BtbState.None,
        field: makeField("IJLOSTZNNN"),
        garbages: [],
        hold: {
          canHold: false,
          type: Tetromino.T,
        },
        lastRoseUpColumn: 1,
        ren: -1,
        seed: makeSeed(1),
        unsettledNexts: [],
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
        attackTypes: [],
        bag: makeNextNote("IOT", 3),
        btbState: BtbState.None,
        field: makeField("IJLOSTZNNN"),
        garbages: [],
        hold: {
          canHold: false,
          type: Tetromino.T,
        },
        lastRoseUpColumn: 1,
        ren: -1,
        seed: makeSeed(1),
        unsettledNexts: [],
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
        .map((row) => row.findIndex((cell) => cell === FieldCellValue.None));
      for (let i = 0; i < garbegeHeight - 1; i++) {
        expect(noneCols[i]).not.toBe(noneCols[i + 1]);
      }

      // Lines(>= 16) are not buried garbage
      expect(actual.payload.field[garbegeHeight]).toEqual(
        new Array(MAX_FIELD_WIDTH).fill(FieldCellValue.None)
      );
    });
  });
});
