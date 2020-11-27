import { SimuStateHistory } from "stores/SimuState";
import {
  Action,
  ActiveTetromino,
  FieldState,
  HoldState,
  NextNote,
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
    field: FieldState;
    hold: HoldState;
    current: ActiveTetromino;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    retryState: SimuRetryState;
    seed: number;
  };
} & Action;

export type DoSimuAction = {
  type: typeof SimuActionsType.DoSimu;
  payload:
    | {
        current: ActiveTetromino;
        field: FieldState;
        histories: SimuStateHistory[];
        hold: HoldState;
        isDead: boolean;
        lastRoseUpColumn: number;
        nexts: {
          settled: Tetromino[];
          unsettled: NextNote[];
          bag: NextNote;
        };
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
    current: ActiveTetromino;
    field: FieldState;
    hold: HoldState;
    isDead: boolean;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    seed: number;
    step: number;
  };
} & Action;

export type RetryAction = {
  type: typeof SimuActionsType.Retry;
  payload: {
    field: FieldState;
    hold: HoldState;
    current: ActiveTetromino;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    seed: number;
  };
} & Action;

export type SuperRetryAction = {
  type: typeof SimuActionsType.SuperRetry;
  payload: {
    field: FieldState;
    hold: HoldState;
    current: ActiveTetromino;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    retryState: SimuRetryState;
    seed: number;
  };
} & Action;

export type UndoAction = {
  type: typeof SimuActionsType.Undo;
  payload: {
    current: ActiveTetromino;
    field: FieldState;
    hold: HoldState;
    isDead: boolean;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    seed: number;
    step: number;
  };
} & Action;
