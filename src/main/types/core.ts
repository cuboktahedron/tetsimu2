import { OperationKey } from "utils/tetsimu/operationKey";

export type Action = {
  type: string;
};

export const MAX_NEXTS_NUM = 12;
export const MAX_FIELD_HEIGHT = 30;
export const MAX_VISIBLE_FIELD_HEIGHT = 21;

export const TetsimuMode = {
  Simu: 1,
  Edit: 2,
  Replay: 3,
} as const;

export type TetsimuMode = typeof TetsimuMode[keyof typeof TetsimuMode];

export const Tetromino = {
  NONE: 0,
  I: 1,
  J: 2,
  L: 3,
  O: 4,
  S: 5,
  T: 6,
  Z: 7,
} as const;

export type Tetromino = typeof Tetromino[keyof typeof Tetromino];

export const FieldCellValue = {
  NONE: Tetromino.NONE,
  I: Tetromino.I,
  J: Tetromino.J,
  L: Tetromino.L,
  O: Tetromino.O,
  S: Tetromino.S,
  T: Tetromino.T,
  Z: Tetromino.Z,
  GARBAGE: 9,
} as const;

export type FieldCellValue = typeof FieldCellValue[keyof typeof FieldCellValue];

export type Vector2 = {
  x: number;
  y: number;
};

export const Direction = {
  UP: 1,
  LEFT: 2,
  DOWN: 4,
  RIGHT: 8,
} as const;

export type Direction = typeof Direction[keyof typeof Direction];

export type FieldState = FieldCellValue[][];

export type ActiveTetromino = {
  direction: Direction;
  pos: Vector2;
  type: Tetromino;
};

export type HoldState = {
  type: Tetromino;
  canHold: boolean;
};

export type NextNote = {
  candidates: Tetromino[];
  take: number;
};

export type ControllerKeys = {
  ArrowUp: OperationKey;
  ArrowLeft: OperationKey;
  ArrowRight: OperationKey;
  ArrowDown: OperationKey;
  z: OperationKey;
  x: OperationKey;
  c: OperationKey;
  b: OperationKey;
};

export type InputKey = keyof ControllerKeys;

export const TapControllerType = {
  None: 0,
  TypeA: 1,
  TypeB: 2,
} as const;

export type TapControllerType = typeof TapControllerType[keyof typeof TapControllerType];

export const MouseButton = {
  Left: 0,
  Middle: 1,
  Right: 2,
} as const;

export const ReplayStepType = {
  Drop: 1,
  Hold: 2,
  HardDrop: 3,
} as const;

export type ReplayStepType = typeof ReplayStepType[keyof typeof ReplayStepType];

export type ReplayStepDrop = {
  type: typeof ReplayStepType.Drop;
  dir: Direction;
  pos: Vector2;
};

export type ReplayStepHold = {
  type: typeof ReplayStepType.Hold;
};

export type ReplayStepHardDrop = {
  type: typeof ReplayStepType.HardDrop;
  attacked?: {
    cols: number[];
  };
};

export type ReplayStep = ReplayStepDrop | ReplayStepHold | ReplayStepHardDrop;
