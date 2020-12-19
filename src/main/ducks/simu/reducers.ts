import { SimuState } from "stores/SimuState";
import { Action } from "types/core";
import { SimuActions, SimuActionsType } from "./types";

const reducer = (state: SimuState, anyAction: Action): SimuState => {
  const action = anyAction as SimuActions;

  switch (action.type) {
    case SimuActionsType.ChangeConfig:
      return {
        ...state,
        config: action.payload.config,
      };
    case SimuActionsType.ChangeZoom:
      return {
        ...state,
        zoom: action.payload.zoom,
      };
    case SimuActionsType.Clear:
      return {
        ...state,
        ...action.payload,
      };
    case SimuActionsType.DoSimu: {
      if (!action.payload.succeeded) {
        return state;
      }

      const { succeeded, ...payload } = action.payload;
      return {
        ...state,
        ...payload,
      };
    }
    case SimuActionsType.Redo: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case SimuActionsType.Retry:
      return {
        ...state,
        ...action.payload,
      };
    case SimuActionsType.SuperRetry:
      return {
        ...state,
        ...action.payload,
      };

    case SimuActionsType.Undo: {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
  return state;
};

export default reducer;
