import editReducer from "ducks/edit";
import simuReducer from "ducks/simu";
import { RootState } from "stores/RootState";
import { Action } from "types/core";
import { RootActions, RootActionsType } from "./types";

const reducers = {
  simu: simuReducer,
  edit: editReducer,
};

const reducer = (state: RootState, anyAction: Action): RootState => {
  const reducerName = anyAction.type.split("/")[0];
  if (!(reducerName in state)) {
    const action = anyAction as RootActions;

    switch (action.type) {
      case RootActionsType.ChangeTetsimuMode:
        return {
          ...state,
          mode: action.payload.mode,
        };
      default:
        return state;
    }
  }

  if (reducerName === "simu") {
    const newState = reducers[reducerName](state[reducerName], anyAction);
    if (newState !== state[reducerName]) {
      return {
        ...state,
        [reducerName]: newState,
      };
    } else {
      return state;
    }
  }

  if (reducerName === "edit") {
    const newState = reducers[reducerName](state[reducerName], anyAction);
    if (newState !== state[reducerName]) {
      return {
        ...state,
        [reducerName]: newState,
      };
    } else {
      return state;
    }
  }

  return state;
};

export default reducer;
