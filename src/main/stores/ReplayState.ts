import {
  ActiveTetromino,
  AttackType,
  BtbState,
  Direction,
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  MAX_FIELD_WIDTH,
  ReplayStep,
  SpinType,
  Tetromino,
} from "types/core";
import { ReplayConfig, ReplayInfo, ReplayStateHistory } from "types/replay";

export type ReplayState = {
  auto: {
    playing: boolean;
    speed: number;
  };
  attackTypes: AttackType[];
  btbState: BtbState;
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
  ren: number;
  replayInfo: ReplayInfo;
  replaySteps: ReplayStep[];
  step: number;
  zoom: number;
};

export const initialReplayState: ReplayState = ((): ReplayState => {
  const nexts: Tetromino[] = [];
  const steps: ReplayStep[] = [];

  const field = new Array(MAX_FIELD_HEIGHT).fill(
    new Array<Tetromino>(MAX_FIELD_WIDTH).fill(Tetromino.None)
  );

  const current = {
    direction: Direction.Up,
    pos: {
      x: 0,
      y: 0,
    },
    spinType: SpinType.None,
    type: Tetromino.None,
  };

  const hold = {
    type: Tetromino.None,
    canHold: true,
  };

  const isTouchDevice = "ontouchstart" in window;
  const config: ReplayConfig = {
    showsCycle: false,
    showsGhost: true,
    showsPivot: true,
  };
  return {
    attackTypes: [],
    auto: {
      playing: false,
      speed: 1,
    },
    btbState: BtbState.None,
    config,
    current,
    env: {
      isTouchDevice,
    },
    field,
    histories: [
      {
        attackTypes: [],
        btbState: BtbState.None,
        current,
        field,
        hold,
        isDead: false,
        nexts: nexts,
        noOfCycle: 2,
        ren: -1,
      },
    ],
    hold,
    isDead: false,
    nexts: nexts,
    noOfCycle: 1,
    ren: -1,
    replayInfo: {
      nextNum: 5,
    },
    replaySteps: steps,
    step: 0,
    zoom: 1,
  };
})();
