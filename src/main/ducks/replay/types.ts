import {
  Action,
  ActiveTetromino,
  FieldState,
  HoldState,
  Tetromino,
} from "types/core";
import { ReplayConfig } from "types/replay";

export const ReplayActionsType = {
  ChangeConfig: "replay/changeConfig",
  ChangeZoom: "replay/changeZoom",
  ForwardStepAction: "replay/forwardStep",
  BackwardStepAction: "replay/backwardStep",
} as const;

export type ReplayActions =
  | ChangeConfigAction
  | ChangeZoomAction
  | ForwardStepAction;

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
