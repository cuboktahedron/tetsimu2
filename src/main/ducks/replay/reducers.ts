import { ReplayState } from "stores/ReplayState";
import { Action } from "types/core";
import { ReplayActions, ReplayActionsType } from "./types";

const reducer = (state: ReplayState, anyAction: Action): ReplayState => {
  const action = anyAction as ReplayActions;

  switch (action.type) {
    case ReplayActionsType.ChangeConfig:
      return {
        ...state,
        config: action.payload.config,
      };
    case ReplayActionsType.ChangeZoom:
      return {
        ...state,
        zoom: action.payload.zoom,
      };
  }
  return state;
};

export default reducer;
