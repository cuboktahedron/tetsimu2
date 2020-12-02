import editReducer from "ducks/edit";
import replayReducer from "ducks/replay";
import simuReducer from "ducks/simu";
import { RootState } from "stores/RootState";
import { Action, FieldCellValue, TetsimuMode } from "types/core";
import { RootActions, RootActionsType } from "./types";

const reducers = {
  edit: editReducer,
  replay: replayReducer,
  simu: simuReducer,
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
      case RootActionsType.EditToSimuMode:
        return {
          ...state,
          mode: TetsimuMode.Simu,
          simu: {
            ...state.simu,
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
                seed: action.payload.seed,
              },
            ],
            isDead: false,
            retryState: action.payload.retryState,
            seed: action.payload.seed,
            step: 0,
          },
        };
      case RootActionsType.SimuToEditMode: {
        return {
          ...state,
          edit: {
            ...state.edit,
            field: action.payload.field,
            hold: action.payload.hold,
            nexts: action.payload.nexts,
            tools: {
              isCellValueMultiSelection: false,
              nextBaseNo: 1,
              nextsPattern: action.payload.tools.nextsPattern,
              noOfCycle: action.payload.tools.noOfCycle,
              selectedCellValues: [FieldCellValue.I],
            },
          },
          mode: TetsimuMode.Edit,
        };
      }
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

  if (reducerName === "replay") {
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
