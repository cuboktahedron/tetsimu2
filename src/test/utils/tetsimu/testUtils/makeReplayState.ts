import merge from "deepmerge";
import { ReplayState } from "stores/ReplayState";
import {
  ActiveTetromino,
  Direction,
  FieldState,
  HoldState,
  Tetromino,
} from "types/core";
import { ReplayInfo, ReplayStateHistory, ReplayStep } from "types/replay";

export const makeReplayState = (state: {
  current?: ActiveTetromino;
  field?: FieldState;
  histories?: ReplayStateHistory[];
  hold?: HoldState;
  isDead?: boolean;
  nexts: Tetromino[];
  noOfCycle?: number;
  replayInfo?: ReplayInfo;
  replaySteps?: ReplayStep[];
  step?: number;
}): ReplayState => {
  return merge(
    {
      config: {
        showsCycle: false,
        showsGhost: false,
        showsPivot: true,
      },
      current: {
        direction: Direction.UP,
        pos: { x: 0, y: 0 },
        type: Tetromino.NONE,
      },
      env: {
        isTouchDevice: false,
      },
      field: [],
      histories: [],
      isDead: false,
      nexts: [],
      noOfCycle: 1,
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
