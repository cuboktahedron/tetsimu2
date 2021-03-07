import merge from "deepmerge";
import { GarbageInfo, ReplayState } from "stores/ReplayState";
import {
  ActiveTetromino,
  AttackType,
  BtbState,
  Direction,
  FieldState,
  HoldState,
  ReplayStep,
  Tetromino,
} from "types/core";
import { ReplayInfo, ReplayStateHistory } from "types/replay";

export const makeReplayState = (state: {
  attackTypes?: AttackType[];
  auto?: {
    playing: boolean;
    speed: number;
  };
  btbState?: BtbState;
  config?: {
    passesAllToSimu?: boolean;
    showsCycle?: boolean;
    showsGhost?: boolean;
    showsPivot?: boolean;
  },
  current?: ActiveTetromino;
  field?: FieldState;
  garbages?: GarbageInfo[];
  histories?: ReplayStateHistory[];
  hold?: HoldState;
  isDead?: boolean;
  nexts?: Tetromino[];
  noOfCycle?: number;
  ren?: number;
  replayInfo?: ReplayInfo;
  replaySteps?: ReplayStep[];
  step?: number;
}): ReplayState => {
  return merge(
    {
      attackTypes: [],
      auto: {
        playing: false,
        speed: 1,
      },
      btbState: BtbState.None,
      config: {
        passesAllToSimu: true,
        showsCycle: false,
        showsGhost: false,
        showsPivot: true,
      },
      current: {
        direction: Direction.Up,
        pos: { x: 0, y: 0 },
        type: Tetromino.None,
      },
      env: {
        isTouchDevice: false,
      },
      field: [],
      garbages: [],
      histories: [],
      isDead: false,
      nexts: [],
      noOfCycle: 1,
      ren: -1,
      replayInfo: {
        nextNum: 5,
      },
      replaySteps: [],
      step: 0,
      zoom: 0,
    },
    state
  );
};
