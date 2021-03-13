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
    case SimuActionsType.ChangeGarbageLevelAction:
      return {
        ...state,
        config: {
          ...state.config,
          garbage: {
            ...state.config.garbage,
            a1: action.payload.a1,
            a2: action.payload.a2,
            b1: action.payload.b1,
            b2: action.payload.b2,
            level: action.payload.level,
          },
        },
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
    case SimuActionsType.ResetConfigToDefault:
      return {
        ...state,
        config: action.payload.config,
      };
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
