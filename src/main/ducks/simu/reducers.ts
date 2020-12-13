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
        current: action.payload.current,
        field: action.payload.field,
        hold: action.payload.hold,
        nexts: action.payload.nexts,
        histories: [
          {
            currentType: action.payload.current.type,
            field: action.payload.field,
            hold: action.payload.hold,
            isDead: false,
            lastRoseUpColumn: action.payload.lastRoseUpColumn,
            nexts: action.payload.nexts,
            replayStep: 0,
            seed: action.payload.seed,
          },
        ],
        isDead: false,
        replayStep: 0,
        replaySteps: [],
        retryState: action.payload.retryState,
        seed: action.payload.seed,
        step: 0,
      };

    case SimuActionsType.DoSimu: {
      if (!action.payload.succeeded) {
        return state;
      }

      return {
        ...state,
        current: action.payload.current,
        field: action.payload.field,
        histories: action.payload.histories,
        hold: action.payload.hold,
        isDead: action.payload.isDead,
        lastRoseUpColumn: action.payload.lastRoseUpColumn,
        nexts: action.payload.nexts,
        seed: action.payload.seed,
        replayStep: action.payload.replayStep,
        replaySteps: action.payload.replaySteps,
        step: action.payload.step,
      };
    }
    case SimuActionsType.Redo: {
      return {
        ...state,
        current: action.payload.current,
        field: action.payload.field,
        hold: action.payload.hold,
        isDead: action.payload.isDead,
        lastRoseUpColumn: action.payload.lastRoseUpColumn,
        nexts: action.payload.nexts,
        seed: action.payload.seed,
        step: action.payload.step,
      };
    }
    case SimuActionsType.Retry:
      return {
        ...state,
        current: action.payload.current,
        field: action.payload.field,
        hold: action.payload.hold,
        nexts: action.payload.nexts,
        histories: [
          {
            currentType: action.payload.current.type,
            field: action.payload.field,
            hold: action.payload.hold,
            isDead: false,
            lastRoseUpColumn: action.payload.lastRoseUpColumn,
            nexts: action.payload.nexts,
            replayStep: 0,
            seed: action.payload.seed,
          },
        ],
        isDead: false,
        replayStep: 0,
        replaySteps: [],
        seed: action.payload.seed,
        step: 0,
      };
    case SimuActionsType.SuperRetry:
      return {
        ...state,
        current: action.payload.current,
        field: action.payload.field,
        hold: action.payload.hold,
        nexts: action.payload.nexts,
        histories: [
          {
            currentType: action.payload.current.type,
            field: action.payload.field,
            hold: action.payload.hold,
            isDead: false,
            lastRoseUpColumn: action.payload.lastRoseUpColumn,
            nexts: action.payload.nexts,
            replayStep: 0,
            seed: action.payload.seed,
          },
        ],
        isDead: false,
        replayStep: 0,
        replaySteps: [],
        retryState: action.payload.retryState,
        seed: action.payload.seed,
        step: 0,
      };
    case SimuActionsType.Undo: {
      return {
        ...state,
        current: action.payload.current,
        field: action.payload.field,
        hold: action.payload.hold,
        isDead: action.payload.isDead,
        lastRoseUpColumn: action.payload.lastRoseUpColumn,
        nexts: action.payload.nexts,
        seed: action.payload.seed,
        step: action.payload.step,
      };
    }
  }
  return state;
};

export default reducer;
