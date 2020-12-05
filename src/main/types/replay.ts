import { ReplayStepType } from "stores/ReplayState";
import {
  ActiveTetromino,
  Direction,
  FieldState,
  HoldState,
  NextNote,
  Tetromino,
  Vector2,
} from "./core";

export type ReplayConfig = {
  showsCycle: boolean;
  showsGhost: boolean;
  showsPivot: boolean;
};

export type ReplayRetryState = {
  field: FieldState;
  hold: HoldState;
  unsettledNexts: NextNote[];
};

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

export type ReplayStateHistory = {
  current: ActiveTetromino;
  field: FieldState;
  hold: HoldState;
  isDead: boolean;
  nexts: Tetromino[];
  noOfCycle: number;
};

export type ReplayInfo = {
  nextNum: number;
};
