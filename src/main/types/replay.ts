import { GarbageInfo } from "stores/ReplayState";
import {
  ActiveTetromino,
  AttackType,
  BtbState,
  FieldState,
  HoldState,
  NextNote,
  Tetromino
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
  attackTypes: AttackType[];
  btbState: BtbState;
  current: ActiveTetromino;
  field: FieldState;
  garbages: GarbageInfo[];
  hold: HoldState;
  isDead: boolean;
  nexts: Tetromino[];
  noOfCycle: number;
  ren: number;
};

export type ReplayInfo = {
  nextNum: number;
  offsetRange: number;
};
