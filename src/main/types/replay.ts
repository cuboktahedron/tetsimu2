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
  passesAllToSimu: boolean;
  showsCycle: boolean;
  showsGhost: boolean;
  showsPivot: boolean;
  showsTrace: boolean,
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

export const SearchRouteAction = {
  MoveLeft: 1,
  MoveRight: 2,
  TurnLeft: 3,
  TurnRight: 4,
  SoftDrop: 5,
} as const;

export type SearchRouteAction = typeof SearchRouteAction[keyof typeof SearchRouteAction];
