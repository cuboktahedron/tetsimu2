import { ReplayState } from "stores/ReplayState";
import { Action } from "types/core";
import { ReplayActions, ReplayActionsType } from "./types";

const reducer = (state: ReplayState, anyAction: Action): ReplayState => {
  const action = anyAction as ReplayActions;

  switch (action.type) {
    case ReplayActionsType.BackwardStep:
      if (!action.payload.succeeded) {
        return state;
      } else {
        const { succeeded, ...payload } = action.payload;
        return {
          ...state,
          ...payload,
        };
      }
    case ReplayActionsType.ChangeConfig:
      return {
        ...state,
        config: action.payload.config,
      };
    case ReplayActionsType.ChangeStep:
      if (!action.payload.succeeded) {
        return state;
      } else {
        const { succeeded, ...payload } = action.payload;
        return {
          ...state,
          ...payload,
        };
      }
    case ReplayActionsType.ChangeZoom:
      return {
        ...state,
        zoom: action.payload.zoom,
      };
    case ReplayActionsType.ForwardStep:
      if (!action.payload.succeeded) {
        return state;
      } else {
        const { succeeded, ...payload } = action.payload;
        return {
          ...state,
          ...payload,
        };
      }
  }
  return state;
};

export default reducer;
