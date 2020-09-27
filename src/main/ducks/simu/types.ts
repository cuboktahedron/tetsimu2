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
  | HardDropTetrominoAction
  | HoldTetrominoAction
  | MoveTetrominoAction
  | RedoAction
  | RetryAction
  | RotateTetrominoAction
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

export type HardDropTetrominoAction = {
  type: typeof SimuActionsType.HardDropTetromino;
  payload: {
    current: ActiveTetromino;
    field: FieldState;
    hold: HoldState;
    isDead: boolean;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
    };
    seed: number;
  };
} & Action;

export type HoldTetrominoAction = {
  type: typeof SimuActionsType.HoldTetromino;
  payload:
    | {
        current: ActiveTetromino;
        hold: HoldState;
        isDead: boolean;
        nexts: {
          settled: Tetromino[];
          unsettled: NextNote[];
        };
        seed: number;
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;

export type MoveTetrominoAction = {
  type: typeof SimuActionsType.MoveTetromino;
  payload:
    | {
        current: ActiveTetromino;
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
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
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
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
    };
    seed: number;
  };
} & Action;

export type RotateTetrominoAction = {
  type: typeof SimuActionsType.RotateTetromino;
  payload:
    | {
        current: ActiveTetromino;
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;

export type SuperRetryAction = {
  type: typeof SimuActionsType.SuperRetry;
  payload: {
    field: FieldState;
    hold: HoldState;
    current: ActiveTetromino;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
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
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
    };
    seed: number;
    step: number;
  };
} & Action;
