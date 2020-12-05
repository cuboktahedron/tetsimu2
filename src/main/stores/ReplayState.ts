import {
  ActiveTetromino,
  Direction,
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  Tetromino,
} from "types/core";
import {
  ReplayConfig,
  ReplayInfo,
  ReplayStateHistory,
  ReplayStep,
} from "types/replay";

export const ReplayStepType = {
  Drop: 1,
  Hold: 2,
  HardDrop: 3,
} as const;

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
  // TOOD: temporary
  const nexts = [
    Tetromino.J,
    Tetromino.L,
    Tetromino.O,
    Tetromino.S,
    Tetromino.T,
    Tetromino.Z,
    Tetromino.I,
    Tetromino.J,
    Tetromino.L,
    Tetromino.O,
    Tetromino.S,
    Tetromino.T,
    Tetromino.Z,
  ];
  const steps: ReplayStep[] = [
    {
      type: ReplayStepType.Drop,
      pos: {
        x: 1,
        y: 0,
      },
      dir: Direction.UP,
    },
    {
      type: ReplayStepType.HardDrop,
    },
    {
      type: ReplayStepType.Drop,
      pos: {
        x: 7,
        y: 2,
      },
      dir: Direction.RIGHT,
    },
    {
      type: ReplayStepType.HardDrop,
    },
    {
      type: ReplayStepType.Hold,
    },
    {
      type: ReplayStepType.Drop,
      pos: { x: 1, y: 2 },
      dir: Direction.DOWN,
    },
    {
      type: ReplayStepType.HardDrop,
    },
    {
      type: ReplayStepType.Drop,
      pos: { x: 8, y: 2 },
      dir: Direction.LEFT,
    },
    {
      type: ReplayStepType.HardDrop,
      attacked: {
        cols: [1, 2, 3],
      },

    },
    {
      type: ReplayStepType.Drop,
      pos: { x: 2, y: 2 },
      dir: Direction.UP,
    },
    {
      type: ReplayStepType.HardDrop,
    },
    {
      type: ReplayStepType.Hold,
    },
  ];

  const field = new Array(MAX_FIELD_HEIGHT).fill(
    new Array<Tetromino>(10).fill(Tetromino.NONE)
  );

  const current = {
    direction: Direction.UP,
    pos: {
      x: 4,
      y: 19,
    },
    type: Tetromino.I,
  };

  const hold = {
    type: Tetromino.NONE,
    canHold: true,
  };

  const isTouchDevice = "ontouchstart" in window;
  const config: ReplayConfig = {
    showsCycle: true,
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
        noOfCycle: 1,
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
