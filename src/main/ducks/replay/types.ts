import {
  Action,
  ActiveTetromino,
  FieldState,
  HoldState,
  Tetromino
} from "types/core";
import { ReplayConfig, ReplayStateHistory } from "types/replay";

export const ReplayActionsType = {
  BackwardStepAction: "replay/backwardStep",
  ChangeConfig: "replay/changeConfig",
  ChangeZoom: "replay/changeZoom",
  ForwardStepAction: "replay/forwardStep",
} as const;

export type ReplayActions =
  | BackwardStepAction
  | ChangeConfigAction
  | ChangeZoomAction
  | ForwardStepAction;

export type BackwardStepAction = {
  type: typeof ReplayActionsType.BackwardStepAction;
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

export type ChangeZoomAction = {
  type: typeof ReplayActionsType.ChangeZoom;
  payload: {
    zoom: number;
  };
} & Action;

export type ForwardStepAction = {
  type: typeof ReplayActionsType.ForwardStepAction;
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
