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
  ChangeAutoPlaying: "replay/changeAutoPlaying",
  ChangeConfig: "replay/changeConfig",
  ChangeReplaySpeed: "replay/changeReplaySpeed",
  ChangeStep: "replay/changeStep",
  ChangeZoom: "replay/changeZoom",
  ForwardStep: "replay/forwardStep",
  ForwardStepAuto: "replay/forwardStepAuto",
} as const;

export type ReplayActions =
  | BackwardStepAction
  | ChangeAutoPlayingAction
  | ChangeConfigAction
  | ChangeReplaySpeedAction
  | ChangeStepAction
  | ChangeZoomAction
  | ForwardStepAction
  | ForwardStepAutoAction;

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

export type ChangeAutoPlayingAction = {
  type: typeof ReplayActionsType.ChangeAutoPlaying;
  payload: {
    playing: boolean;
  };
} & Action;

export type ChangeConfigAction = {
  type: typeof ReplayActionsType.ChangeConfig;
  payload: {
    config: ReplayConfig;
  };
} & Action;

export type ChangeReplaySpeedAction = {
  type: typeof ReplayActionsType.ChangeReplaySpeed;
  payload: {
    speed: number;
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

export type ForwardStepAutoAction = {
  type: typeof ReplayActionsType.ForwardStepAuto;
  payload:
    | {
        current: ActiveTetromino;
        field: FieldState;
        histories: ReplayStateHistory[];
        hold: HoldState;
        isDead: boolean;
        nexts: Tetromino[];
        noOfCycle: number;
        playing: boolean;
        step: number;
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;
