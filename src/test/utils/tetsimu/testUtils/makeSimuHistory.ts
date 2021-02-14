import merge from "deepmerge";
import { GarbageInfo, SimuStateHistory } from "stores/SimuState";
import {
  AttackType,
  BtbState,
  FieldState,
  HoldState,
  NextNote,
  Tetromino,
} from "types/core";
import { makeNextNote } from "./makeNextNote";

export const makeSimuHistory = (simuHistory: {
  attackTypes?: AttackType[];
  btbState?: BtbState;
  currentType?: Tetromino;
  field?: FieldState;
  garbages?: GarbageInfo[];
  hold?: HoldState;
  isDead?: boolean;
  lastRoseUpColumn?: number;
  nexts?: {
    settled: Tetromino[];
    unsettled: NextNote[];
    bag: NextNote;
  };
  ren?: number;
  replayNextStep?: number;
  replayStep?: number;
  seed?: number;
}): SimuStateHistory => {
  return merge(
    {
      attackTypes: [],
      btbState: BtbState.None,
      currentType: Tetromino.None,
      field: [],
      garbages: [],
      hold: {
        canHold: false,
        type: Tetromino.None,
      },
      isDead: false,
      lastRoseUpColumn: -1,
      nexts: {
        bag: makeNextNote("", 0),
        settled: [],
        unsettled: [],
      },
      ren: -1,
      replayNextStep: 0,
      replayStep: 0,
      seed: 0,
    },
    simuHistory
  );
};
