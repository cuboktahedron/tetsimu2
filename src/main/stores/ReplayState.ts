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
  Next: 1,
  Hold: 2,
  Attacked: 3,
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
  noOfCycle: number;
  replayInfo: ReplayInfo;
  replaySteps: ReplayStep[];
  step: number;
  zoom: number;
};

export const initialReplayState: ReplayState = ((): ReplayState => {
  // TOOD: temporary
  const steps: ReplayStep[] = [
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.I,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.J,
    },
    {
      type: ReplayStepType.Hold,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.L,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.S,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.T,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.Z,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.O,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.J,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.L,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.O,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.J,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.L,
    },
    {
      type: ReplayStepType.Next,
      tetromino: Tetromino.O,
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
    type: steps[0].type,
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
        currentType: current.type,
        field,
        hold,
        isDead: false,
        noOfCycle: 1,
      },
    ],
    hold,
    isDead: false,
    noOfCycle: 1,
    replayInfo: {
      nextNum: 12,
    },
    replaySteps: steps,
    step: 1,
    zoom: 1,
  };
})();
