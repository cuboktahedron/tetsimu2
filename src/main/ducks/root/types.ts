import { Action, TetsimuMode } from "types/core";

export const RootActionsType = {
  ChangeTetsimuMode: "root/changeTetsimuMode",
} as const;

export type RootActions = ChangeTetsimuModeAction;

export type ChangeTetsimuModeAction = {
  type: typeof RootActionsType.ChangeTetsimuMode;
  payload: {
    mode: TetsimuMode;
  };
} & Action;
