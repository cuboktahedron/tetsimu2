import merge from "deepmerge";
import {
  ActiveTetromino,
  AttackType,
  BtbState,
  Direction,
  FieldState,
  HoldState,
  SpinType,
  Tetromino,
} from "types/core";
import { ReplayStateHistory } from "types/replay";
export const makeReplayHistory = (replayHistory: {
  attackTypes?: AttackType[];
  btbState?: BtbState;
  current?: ActiveTetromino;
  field?: FieldState;
  hold?: HoldState;
  isDead?: boolean;
  nexts?: Tetromino[];
  noOfCycle?: number;
  ren?: number;
}): ReplayStateHistory => {
  return merge(
    {
      attackTypes: [],
      btbState: BtbState.None,
      current: {
        direction: Direction.Up,
        pos: { x: 0, y: 0 },
        spinType: SpinType.None,
        type: Tetromino.None,
      },
      field: [],
      hold: {
        canHold: false,
        type: Tetromino.None,
      },
      isDead: false,
      nexts: [],
      ren: -1,
    },
    replayHistory
  );
};
