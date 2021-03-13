import { GarbageInfo, SimuStateHistory } from "stores/SimuState";
import {
  Action,
  ActiveTetromino,
  AttackType,
  BtbState,
  FieldState,
  HoldState,
  NextNote,
  ReplayStep,
  Tetromino
} from "types/core";
import { SimuConfig, SimuRetryState } from "types/simu";

export const SimuActionsType = {
  ChangeConfig: "simu/changeConfig",
  ChangeGarbageLevelAction: "simu/ChangeGarbageLevelAction",
  ChangeZoom: "simu/changeZoom",
  Clear: "simu/clear",
  DoSimu: "simu/doSimu",
  HardDropTetromino: "simu/hardDropTetromino",
  HoldTetromino: "simu/holdTetromino",
  MoveTetromino: "simu/moveTetromino",
  Redo: "simu/redo",
  ResetConfigToDefault: "simu/resetConfigToDefault",
  Retry: "simu/retry",
  RotateTetromino: "simu/rotateTetromino",
  SuperRetry: "simu/superRetry",
  Undo: "simu/undo",
} as const;

export type SimuActions =
  | ChangeConfigAction
  | ChangeGarbageLevelAction
  | ChangeZoomAction
  | ClearSimuAction
  | DoSimuAction
  | RedoAction
  | ResetConfigToDefaultAction
  | RetryAction
  | SuperRetryAction
  | UndoAction;

export type ChangeConfigAction = {
  type: typeof SimuActionsType.ChangeConfig;
  payload: {
    config: SimuConfig;
  };
} & Action;

export type ChangeGarbageLevelAction = {
  type: typeof SimuActionsType.ChangeGarbageLevelAction;
  payload: {
    a1: number;
    a2: number;
    b1: number;
    b2: number;
    level: number;
  };
} & Action;

export type ChangeZoomAction = {
  type: typeof SimuActionsType.ChangeZoom;
  payload: {
    zoom: number;
  };
} & Action;

export type ClearSimuAction = {
  type: typeof SimuActionsType.Clear;
  payload: {
    attackTypes: AttackType[];
    btbState: BtbState;
    current: ActiveTetromino;
    field: FieldState;
    garbages: GarbageInfo[];
    hold: HoldState;
    histories: SimuStateHistory[];
    isDead: boolean;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    ren: number;
    replayNexts: Tetromino[];
    replayNextStep: number;
    replayStep: number;
    replaySteps: ReplayStep[];
    retryState: SimuRetryState;
    seed: number;
    step: number;
  };
} & Action;

export type DoSimuAction = {
  type: typeof SimuActionsType.DoSimu;
  payload:
    | {
        attackTypes: AttackType[];
        btbState: BtbState;
        current: ActiveTetromino;
        field: FieldState;
        garbages: GarbageInfo[];
        histories: SimuStateHistory[];
        hold: HoldState;
        isDead: boolean;
        lastRoseUpColumn: number;
        nexts: {
          settled: Tetromino[];
          unsettled: NextNote[];
          bag: NextNote;
        };
        ren: number;
        replayNexts: Tetromino[];
        replayNextStep: number;
        replayStep: number;
        replaySteps: ReplayStep[];
        seed: number;
        step: number;
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;

export type RedoAction = {
  type: typeof SimuActionsType.Redo;
  payload: {
    attackTypes: AttackType[];
    btbState: BtbState;
    current: ActiveTetromino;
    field: FieldState;
    garbages: GarbageInfo[];
    hold: HoldState;
    isDead: boolean;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    ren: number;
    replayNextStep: number;
    replayStep: number;
    seed: number;
    step: number;
  };
} & Action;

export type ResetConfigToDefaultAction = {
  type: typeof SimuActionsType.ResetConfigToDefault;
  payload: {
    config: SimuConfig;
  };
} & Action;

export type RetryAction = {
  type: typeof SimuActionsType.Retry;
  payload: {
    attackTypes: AttackType[];
    btbState: BtbState;
    current: ActiveTetromino;
    field: FieldState;
    garbages: GarbageInfo[];
    isDead: boolean;
    histories: SimuStateHistory[];
    hold: HoldState;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    ren: number;
    replayNexts: Tetromino[];
    replayNextStep: number;
    replayStep: number;
    replaySteps: ReplayStep[];
    seed: number;
    step: number;
  };
} & Action;

export type SuperRetryAction = {
  type: typeof SimuActionsType.SuperRetry;
  payload: {
    attackTypes: AttackType[];
    btbState: BtbState;
    current: ActiveTetromino;
    field: FieldState;
    garbages: GarbageInfo[];
    isDead: boolean;
    histories: SimuStateHistory[];
    hold: HoldState;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    ren: number;
    replayNexts: Tetromino[];
    replayNextStep: number;
    replayStep: number;
    replaySteps: ReplayStep[];
    retryState: SimuRetryState;
    seed: number;
    step: number;
  };
} & Action;

export type UndoAction = {
  type: typeof SimuActionsType.Undo;
  payload: {
    attackTypes: AttackType[];
    btbState: BtbState;
    current: ActiveTetromino;
    field: FieldState;
    garbages: GarbageInfo[];
    hold: HoldState;
    isDead: boolean;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    ren: number;
    replayNextStep: number;
    replayStep: number;
    seed: number;
    step: number;
  };
} & Action;
