import { GarbageInfo, SimuStateHistory } from "stores/SimuState";
import {
  Action,
  ActiveTetromino,
  BtbState,
  FieldState,
  HoldState,
  NextNote,
  ReplayStep,
  Tetromino,
} from "types/core";
import { SimuConfig, SimuRetryState } from "types/simu";

export const SimuActionsType = {
  ChangeConfig: "simu/changeConfig",
  ChangeZoom: "simu/changeZoom",
  Clear: "simu/clear",
  DoSimu: "simu/doSimu",
  HardDropTetromino: "simu/hardDropTetromino",
  HoldTetromino: "simu/holdTetromino",
  MoveTetromino: "simu/moveTetromino",
  Redo: "simu/redo",
  Retry: "simu/retry",
  RotateTetromino: "simu/rotateTetromino",
  SuperRetry: "simu/superRetry",
  Undo: "simu/undo",
} as const;

export type SimuActions =
  | ChangeConfigAction
  | ChangeZoomAction
  | ClearSimuAction
  | DoSimuAction
  | RedoAction
  | RetryAction
  | SuperRetryAction
  | UndoAction;

export type ChangeConfigAction = {
  type: typeof SimuActionsType.ChangeConfig;
  payload: {
    config: SimuConfig;
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
    btbState: BtbState;
    current: ActiveTetromino;
    field: FieldState;
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

export type RetryAction = {
  type: typeof SimuActionsType.Retry;
  payload: {
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
