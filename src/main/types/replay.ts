import { ReplayStepType } from "stores/ReplayState";
import { FieldState, HoldState, NextNote, Tetromino } from "./core";

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

export type ReplayStep =
  | {
      type: typeof ReplayStepType.Next;
      tetromino: Tetromino;
    }
  | {
      type: typeof ReplayStepType.Hold;
    }
  | {
      type: typeof ReplayStepType.Attacked;
      cols: number[];
    };

export type ReplayStateHistory = {
  currentType: Tetromino;
  field: FieldState;
  hold: HoldState;
  isDead: boolean;
  noOfCycle: number;
};

export type ReplayInfo = {
  nextNum: number;
};
