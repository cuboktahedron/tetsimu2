import {
  ActiveTetromino,
  Direction,
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  ReplayStep,
  Tetromino
} from "types/core";
import { ReplayConfig, ReplayInfo, ReplayStateHistory } from "types/replay";

export type ReplayState = {
  config: ReplayConfig;
  current: ActiveTetromino;
  env: {
    isTouchDevice: boolean;
  };
  field: FieldState;
  histories: ReplayStateHistory[];
  hold: HoldState;
  isDead: boolean;
  nexts: Tetromino[];
  noOfCycle: number;
  replayInfo: ReplayInfo;
  replaySteps: ReplayStep[];
  step: number;
  zoom: number;
};

export const initialReplayState: ReplayState = ((): ReplayState => {
  const nexts: Tetromino[] = [];
  const steps: ReplayStep[] = [];

  const field = new Array(MAX_FIELD_HEIGHT).fill(
    new Array<Tetromino>(10).fill(Tetromino.NONE)
  );

  const current = {
    direction: Direction.UP,
    pos: {
      x: 0,
      y: 0,
    },
    type: Tetromino.NONE,
  };

  const hold = {
    type: Tetromino.NONE,
    canHold: true,
  };

  const isTouchDevice = "ontouchstart" in window;
  const config: ReplayConfig = {
    showsCycle: false,
    showsGhost: true,
    showsPivot: true,
  };
  return {
    config,
    current,
    env: {
      isTouchDevice,
    },
    field,
    histories: [
      {
        current,
        field,
        hold,
        isDead: false,
        nexts: nexts,
        noOfCycle: 2,
      },
    ],
    hold,
    isDead: false,
    nexts: nexts,
    noOfCycle: 1,
    replayInfo: {
      nextNum: 5,
    },
    replaySteps: steps,
    step: 0,
    zoom: 1,
  };
})();
