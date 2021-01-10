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
          auto: {
            ...state.auto,
            playing: false,
          },
        };
      }
    case ReplayActionsType.ChangeAutoPlaying:
      return {
        ...state,
        auto: {
          ...state.auto,
          playing: action.payload.playing,
        },
      };
    case ReplayActionsType.ChangeConfig:
      return {
        ...state,
        config: action.payload.config,
      };
    case ReplayActionsType.ChangeReplaySpeed:
      return {
        ...state,
        auto: {
          ...state.auto,
          speed: action.payload.speed,
        },
      };
    case ReplayActionsType.ChangeStep:
      if (!action.payload.succeeded) {
        return state;
      } else {
        const { succeeded, ...payload } = action.payload;
        return {
          ...state,
          ...payload,
          auto: {
            ...state.auto,
            playing: false,
          },
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
          auto: {
            ...state.auto,
            playing: false,
          },
        };
      }
    case ReplayActionsType.ForwardStepAuto:
      if (!action.payload.succeeded) {
        return {
          ...state,
          auto: {
            ...state.auto,
            playing: false,
          },
        };
      } else {
        const { succeeded, ...payload } = action.payload;
        return {
          ...state,
          ...payload,
          auto: {
            ...state.auto,
            playing: payload.playing,
          },
        };
      }
  }
  return state;
};

export default reducer;
