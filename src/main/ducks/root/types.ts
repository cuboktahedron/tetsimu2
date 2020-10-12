import {
  Action,
  ActiveTetromino,
  FieldState,
  HoldState,
  NextNote,
  Tetromino,
  TetsimuMode
} from "types/core";
import { SimuRetryState } from 'types/simu';

export const RootActionsType = {
  ChangeTetsimuMode: "root/changeTetsimuMode",
  EditToSimuMode: "root/editToSimuMode",
  SimuToEditMode: "root/simuToEditMode",
} as const;

export type RootActions =
  | ChangeTetsimuModeAction
  | EditToSimuAction
  | SimuToEditAction;

export type ChangeTetsimuModeAction = {
  type: typeof RootActionsType.ChangeTetsimuMode;
  payload: {
    mode: TetsimuMode;
  };
} & Action;

export type EditToSimuAction = {
  type: typeof RootActionsType.EditToSimuMode;
  payload: {
    field: FieldState;
    hold: HoldState;
    current: ActiveTetromino;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
    };
    retryState: SimuRetryState;
    seed: number;
  };
} & Action;

export type SimuToEditAction = {
  type: typeof RootActionsType.SimuToEditMode;
  payload: {
    field: FieldState;
    hold: HoldState;
    nexts: {
      nextNotes: NextNote[];
    };
    tools: {
      nextsPattern: string;
    };
  };
} & Action;
