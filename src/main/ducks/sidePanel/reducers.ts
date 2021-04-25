import { SidePanelState } from "stores/SidePanelState";
import { Action } from "types/core";
import { SidePanelActions, SidePanelActionsType } from "./types";

const reducer = (state: SidePanelState, anyAction: Action): SidePanelState => {
  const action = anyAction as SidePanelActions;

  switch (action.type) {
    case SidePanelActionsType.ChangeDrawerState:
      return {
        ...state,
        drawerWidth: action.payload.drawerWidth,
        opens: action.payload.open,
        selectedMenuNames: action.payload.selectedMenuName,
      };
    case SidePanelActionsType.ChangeOpened:
      return {
        ...state,
        opens: action.payload.open,
      };
    case SidePanelActionsType.ChangeSelectedMenuName:
      return {
        ...state,
        selectedMenuNames: action.payload.selectedMenuName,
      };
    default:
      return state;
  }
  return state;
};

export default reducer;
