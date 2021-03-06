import { GarbageInfo } from "stores/ReplayState";
import {
  Action,
  ActiveTetromino,
  AttackType,
  BtbState,
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
  ForwardAuto: "replay/forwardAuto",
  ForwardStep: "replay/forwardStep",
  ForwardStepAuto: "replay/forwardStepAuto",
  ResetConfigToDefault: "replay/resetConfigToDefault",
  SaveConfig: "replay/saveConfig",
} as const;

export type ReplayActions =
  | BackwardStepAction
  | ChangeAutoPlayingAction
  | ChangeConfigAction
  | ChangeReplaySpeedAction
  | ChangeStepAction
  | ChangeZoomAction
  | ForwardAutoAction
  | ForwardStepAction
  | ForwardStepAutoAction
  | ResetConfigToDefaultAction
  | SaveConfigAction;

export type BackwardStepAction = {
  type: typeof ReplayActionsType.BackwardStep;
  payload:
    | {
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
        attackTypes: AttackType[];
        btbState: BtbState;
        current: ActiveTetromino;
        field: FieldState;
        garbages: GarbageInfo[];
        histories: ReplayStateHistory[];
        hold: HoldState;
        isDead: boolean;
        nexts: Tetromino[];
        noOfCycle: number;
        ren: number;
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

export type ForwardAutoAction = {
  type: typeof ReplayActionsType.ForwardAuto;
  payload:
    | {
        current: ActiveTetromino;
        progressStep: false;
        succeeded: true;
      }
    | (ForwardStepAutoAction["payload"] & { progressStep: true })
    | {
        succeeded: false;
      };
} & Action;

export type ForwardStepAction = {
  type: typeof ReplayActionsType.ForwardStep;
  payload:
    | {
        attackTypes: AttackType[];
        btbState: BtbState;
        current: ActiveTetromino;
        field: FieldState;
        garbages: GarbageInfo[];
        histories: ReplayStateHistory[];
        hold: HoldState;
        isDead: boolean;
        nexts: Tetromino[];
        noOfCycle: number;
        ren: number;
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
        attackTypes: AttackType[];
        btbState: BtbState;
        current: ActiveTetromino;
        field: FieldState;
        garbages: GarbageInfo[];
        histories: ReplayStateHistory[];
        hold: HoldState;
        isDead: boolean;
        nexts: Tetromino[];
        noOfCycle: number;
        playing: boolean;
        ren: number;
        step: number;
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;

export type ResetConfigToDefaultAction = {
  type: typeof ReplayActionsType.ResetConfigToDefault;
  payload: {
    config: ReplayConfig;
  };
} & Action;

export type SaveConfigAction = {
  type: typeof ReplayActionsType.SaveConfig;
  payload: {};
} & Action;
