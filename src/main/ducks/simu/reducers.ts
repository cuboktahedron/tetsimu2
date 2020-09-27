import { SimuState } from "stores/SimuState";
import { SimuActions, SimuActionsType } from "./types";

const reducer = (state: SimuState, action: SimuActions): SimuState => {
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
    case SimuActionsType.HardDropTetromino: {
      const newHistories = state.histories.slice(0, state.step + 1);
      newHistories.push({
        currentType: action.payload.current.type,
        field: action.payload.field,
        hold: action.payload.hold,
        isDead: action.payload.isDead,
        nexts: action.payload.nexts,
        seed: action.payload.seed,
      });

      return {
        ...state,
        current: action.payload.current,
        field: action.payload.field,
        histories: newHistories,
        hold: action.payload.hold,
        isDead: action.payload.isDead,
        nexts: action.payload.nexts,
        step: state.step + 1,
        seed: action.payload.seed,
      };
    }
    case SimuActionsType.HoldTetromino: {
      if (!action.payload.succeeded) {
        return state;
      }

      const newHistories = state.histories.slice(0, state.step + 1);
      newHistories.push({
        currentType: action.payload.current.type,
        field: state.field,
        hold: action.payload.hold,
        isDead: action.payload.isDead,
        nexts: action.payload.nexts,
        seed: action.payload.seed,
      });

      return {
        ...state,
        current: action.payload.current,
        histories: newHistories,
        hold: action.payload.hold,
        isDead: action.payload.isDead,
        nexts: action.payload.nexts,
        seed: action.payload.seed,
        step: state.step + 1,
      };
    }
    case SimuActionsType.MoveTetromino:
      if (!action.payload.succeeded) {
        return state;
      }

      return {
        ...state,
        current: action.payload.current,
      };
    case SimuActionsType.Redo: {
      return {
        ...state,
        current: action.payload.current,
        field: action.payload.field,
        hold: action.payload.hold,
        isDead: action.payload.isDead,
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
            nexts: action.payload.nexts,
            seed: action.payload.seed,
          },
        ],
        isDead: false,
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
            nexts: action.payload.nexts,
            seed: action.payload.seed,
          },
        ],
        isDead: false,
        retryState: action.payload.retryState,
        seed: action.payload.seed,
        step: 0,
      };
    case SimuActionsType.RotateTetromino:
      if (!action.payload.succeeded) {
        return state;
      }

      return {
        ...state,
        current: action.payload.current,
      };
    case SimuActionsType.Undo: {
      return {
        ...state,
        current: action.payload.current,
        field: action.payload.field,
        hold: action.payload.hold,
        isDead: action.payload.isDead,
        nexts: action.payload.nexts,
        seed: action.payload.seed,
        step: action.payload.step,
      };
    }
  }
  return state;
};

export default reducer;
