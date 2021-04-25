import {
  ChangeDrawerStateAction,
  ChangeOpenedAction,
  ChangeSelectedMenuNameAction,
  SidePanelActionsType,
} from "./types";

export const changeDrawerState = (
  drawerWidth: number,
  open: boolean,
  selectedMenuName: string
): ChangeDrawerStateAction => {
  return {
    type: SidePanelActionsType.ChangeDrawerState,
    payload: {
      drawerWidth,
      open,
      selectedMenuName,
    },
  };
};

export const changeOpened = (open: boolean): ChangeOpenedAction => {
  return {
    type: SidePanelActionsType.ChangeOpened,
    payload: {
      open,
    },
  };
};

export const changeSelectedMenuName = (
  selectedMenuName: string
): ChangeSelectedMenuNameAction => {
  return {
    type: SidePanelActionsType.ChangeSelectedMenuName,
    payload: {
      selectedMenuName,
    },
  };
};
