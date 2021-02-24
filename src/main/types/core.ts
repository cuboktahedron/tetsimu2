import { OperationKey } from "utils/tetsimu/operationKey";

export type Action = {
  type: string;
};

export const MAX_NEXTS_NUM = 12;
export const MAX_FIELD_HEIGHT = 30;
export const MAX_FIELD_WIDTH = 10;
export const MAX_VISIBLE_FIELD_HEIGHT = 21;

export const TetsimuMode = {
  Simu: 0,
  Replay: 1,
  Edit: 2,
  None: 99,
} as const;

export type TetsimuMode = typeof TetsimuMode[keyof typeof TetsimuMode];

export const Tetromino = {
  None: 0,
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
  None: Tetromino.None,
  I: Tetromino.I,
  J: Tetromino.J,
  L: Tetromino.L,
  O: Tetromino.O,
  S: Tetromino.S,
  T: Tetromino.T,
  Z: Tetromino.Z,
  Garbage: 8,
} as const;

export type FieldCellValue = typeof FieldCellValue[keyof typeof FieldCellValue];

export type Vector2 = {
  x: number;
  y: number;
};

export const Direction = {
  Up: 0,
  Left: 1,
  Down: 2,
  Right: 3,
} as const;

export type Direction = typeof Direction[keyof typeof Direction];

export type FieldState = FieldCellValue[][];

export const SpinType = {
  None: 0,
  Mini: 1,
  Spin: 2,
};

export type SpinType = typeof SpinType[keyof typeof SpinType];

export type ActiveTetromino = {
  direction: Direction;
  pos: Vector2;
  spinType: SpinType;
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

export type CycleBag = {
  candidates: Tetromino[];
  take?: number;
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
  HardDrop097: 4,
} as const;

export type ReplayStepType = typeof ReplayStepType[keyof typeof ReplayStepType];

export type ReplayStepDrop = {
  type: typeof ReplayStepType.Drop;
  dir: Direction;
  pos: Vector2;
  spinType: SpinType;
};

export type ReplayStepHold = {
  type: typeof ReplayStepType.Hold;
};

export type ReplayStepHardDrop = {
  type: typeof ReplayStepType.HardDrop;
  attacked?: {
    cols: number[];
    line: number;
  };
};

export type ReplayStepHardDrop097 = {
  type: typeof ReplayStepType.HardDrop097;
  dir: Direction;
  posX: number;
};

export type ReplayStep =
  | ReplayStepDrop
  | ReplayStepHold
  | ReplayStepHardDrop
  | ReplayStepHardDrop097;

export type Storategy = "pytt2";

export const AttackType = {
  Single: 1,
  Double: 2,
  Triple: 3,
  Tetris: 4,
  Tsm: 5,
  Tsdm: 6,
  Tss: 7,
  Tsd: 8,
  Tst: 9,
  BtbTetris: 10,
  BtbTsm: 11,
  BtbTsdm: 12,
  BtbTss: 13,
  BtbTsd: 14,
  BtbTst: 15,
  PerfectClear: 16,
} as const;

export type AttackType = typeof AttackType[keyof typeof AttackType];

export const BtbState = {
  None: 0,
  Btb: 1,
} as const;

export type BtbState = typeof BtbState[keyof typeof BtbState];

export type PlayStats = {
  [AttackType.Single]: number;
  [AttackType.Double]: number;
  [AttackType.Triple]: number;
  [AttackType.Tetris]: number;
  [AttackType.Tsm]: number;
  [AttackType.Tsdm]: number;
  [AttackType.Tss]: number;
  [AttackType.Tsd]: number;
  [AttackType.Tst]: number;
  [AttackType.BtbTetris]: number;
  [AttackType.BtbTsm]: number;
  [AttackType.BtbTsdm]: number;
  [AttackType.BtbTss]: number;
  [AttackType.BtbTsd]: number;
  [AttackType.BtbTst]: number;
  [AttackType.PerfectClear]: number;
  attacks: number[];
  drops: number;
  lines: number;
  maxRen: number;
  totalBtb: number;
  totalHold: number;
};
