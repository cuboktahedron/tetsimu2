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
    case ReplayActionsType.ForwardStepAction:
      if (!action.payload.succeeded) {
        return state;
      } else {
        return {
          ...state,
          current: action.payload.current,
          field: action.payload.field,
          histories: action.payload.histories,
          hold: action.payload.hold,
          isDead: action.payload.isDead,
          nexts: action.payload.nexts,
          noOfCycle: action.payload.noOfCycle,
          step: action.payload.step,
        };
      }
  }
  return state;
};

export default reducer;
