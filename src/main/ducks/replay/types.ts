import {
  Action,
  ActiveTetromino,
  FieldState,
  HoldState,
  Tetromino,
} from "types/core";
import { ReplayConfig, ReplayStateHistory } from "types/replay";

export const ReplayActionsType = {
  BackwardStep: "replay/backwardStep",
  ChangeConfig: "replay/changeConfig",
  ChangeStep: "replay/changeStep",
  ChangeZoom: "replay/changeZoom",
  ForwardStep: "replay/forwardStep",
} as const;

export type ReplayActions =
  | BackwardStepAction
  | ChangeConfigAction
  | ChangeStepAction
  | ChangeZoomAction
  | ForwardStepAction;

export type BackwardStepAction = {
  type: typeof ReplayActionsType.BackwardStep;
  payload:
    | {
        current: ActiveTetromino;
        field: FieldState;
        hold: HoldState;
        isDead: boolean;
        nexts: Tetromino[];
        noOfCycle: number;
        step: number;
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;

export type ChangeConfigAction = {
  type: typeof ReplayActionsType.ChangeConfig;
  payload: {
    config: ReplayConfig;
  };
} & Action;

export type ChangeStepAction = {
  type: typeof ReplayActionsType.ChangeStep;
  payload:
    | {
        current: ActiveTetromino;
        field: FieldState;
        histories: ReplayStateHistory[];
        hold: HoldState;
        isDead: boolean;
        nexts: Tetromino[];
        noOfCycle: number;
        step: number;
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;

export type ChangeZoomAction = {
  type: typeof ReplayActionsType.ChangeZoom;
  payload: {
    zoom: number;
  };
} & Action;

export type ForwardStepAction = {
  type: typeof ReplayActionsType.ForwardStep;
  payload:
    | {
        current: ActiveTetromino;
        field: FieldState;
        histories: ReplayStateHistory[];
        hold: HoldState;
        isDead: boolean;
        nexts: Tetromino[];
        noOfCycle: number;
        step: number;
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;
