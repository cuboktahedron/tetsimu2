import { Action } from "types/core";

export const SidePanelActionsType = {
  ChangeDrawerState: "sidePanel/changeDrawerState",
  ChangeOpened: "sidePanel/changeOpened",
  ChangeSelectedMenuName: "sidePanel/changeSelectedMenuName",
} as const;

export type SidePanelActions =
  | ChangeDrawerStateAction
  | ChangeOpenedAction
  | ChangeSelectedMenuNameAction;

export type ChangeDrawerStateAction = {
  type: typeof SidePanelActionsType.ChangeDrawerState;
  payload: {
    drawerWidth: number;
    open: boolean;
    selectedMenuName: string;
  };
} & Action;

export type ChangeOpenedAction = {
  type: typeof SidePanelActionsType.ChangeOpened;
  payload: {
    open: boolean;
  };
} & Action;

export type ChangeSelectedMenuNameAction = {
  type: typeof SidePanelActionsType.ChangeSelectedMenuName;
  payload: {
    selectedMenuName: string;
  };
} & Action;
