import {
  ActiveTetromino,
  FieldState,
  HoldState,
  NextNote,
  Tetromino,
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
