import editReducer from "ducks/edit";
import replayReducer from "ducks/replay";
import simuReducer from "ducks/simu";
import { RootState } from "stores/RootState";
import { Action, BtbState, FieldCellValue, TetsimuMode } from "types/core";
import { PlayMode } from "types/simu";
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
      case RootActionsType.EditToSimuMode: {
        return {
          ...state,
          mode: TetsimuMode.Simu,
          simu: {
            ...state.simu,
            attackTypes: [],
            btbState: BtbState.None,
            current: action.payload.current,
            field: action.payload.field,
            garbages: action.payload.garbages,
            hold: action.payload.hold,
            nexts: action.payload.nexts,
            histories: [
              {
                attackTypes: [],
                btbState: BtbState.None,
                currentType: action.payload.current.type,
                field: action.payload.field,
                garbages: action.payload.garbages,
                hold: action.payload.hold,
                isDead: false,
                lastRoseUpColumn: action.payload.lastRoseUpColumn,
                nexts: action.payload.nexts,
                ren: -1,
                replayNextStep: action.payload.nexts.settled.length,
                replayStep: 0,
                seed: action.payload.seed,
              },
            ],
            isDead: false,
            ren: -1,
            replayNexts: action.payload.nexts.settled,
            replayNextStep: action.payload.nexts.settled.length,
            replayStep: 0,
            replaySteps: [],
            retryState: action.payload.retryState,
            seed: action.payload.seed,
            step: 0,
          },
        };
      }
      case RootActionsType.ClearError: {
        const { error, ...dialog } = { ...state.dialog };
        return {
          ...state,
          dialog: {
            ...dialog,
          },
        };
      }
      case RootActionsType.Error:
        return {
          ...state,
          dialog: {
            error: {
              title: action.payload.title,
              message: action.payload.message,
            },
          },
        };
      case RootActionsType.InitializeApp: {
        return {
          ...state,
          edit: action.payload.edit,
          mode: action.payload.mode,
          replay: action.payload.replay,
          simu: action.payload.simu,
        };
      }
      case RootActionsType.LoadConfigs: {
        return {
          ...state,
          replay: {
            ...state.replay,
            config: action.payload.replay,
          },
          simu: {
            ...state.simu,
            config: action.payload.simu,
          },
        };
      }
      case RootActionsType.ReplayToSimuMode:
        return {
          ...state,
          mode: TetsimuMode.Simu,
          simu: {
            ...state.simu,
            attackTypes: action.payload.attackTypes,
            btbState: action.payload.btbState,
            config: {
              ...state.simu.config,
              nextNum: action.payload.nexts.nextNum,
              offsetRange: action.payload.offsetRange,
              playMode: PlayMode.Normal,
            },
            current: action.payload.current,
            field: action.payload.field,
            garbages: action.payload.garbages,
            histories: [
              {
                attackTypes: action.payload.attackTypes,
                btbState: action.payload.btbState,
                currentType: action.payload.current.type,
                field: action.payload.field,
                garbages: action.payload.garbages,
                hold: action.payload.hold,
                isDead: false,
                lastRoseUpColumn: action.payload.lastRoseUpColumn,
                nexts: action.payload.nexts,
                ren: action.payload.ren,
                replayNextStep: action.payload.nexts.settled.length,
                replayStep: 0,
                seed: action.payload.seed,
              },
            ],
            hold: action.payload.hold,
            isDead: action.payload.isDead,
            nexts: action.payload.nexts,
            ren: action.payload.ren,
            replayNexts: action.payload.nexts.settled,
            replayNextStep: action.payload.nexts.settled.length,
            replayStep: 0,
            replaySteps: [],
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
      case RootActionsType.SimuToReplayMode: {
        return {
          ...state,
          mode: TetsimuMode.Replay,
          replay: {
            ...state.replay,
            attackTypes: action.payload.attackTypes,
            auto: {
              ...state.replay.auto,
              playing: action.payload.auto.playing,
            },
            btbState: action.payload.btbState,
            current: action.payload.current,
            field: action.payload.field,
            garbages: action.payload.garbages,
            histories: action.payload.histories,
            hold: action.payload.hold,
            isDead: action.payload.isDead,
            nexts: action.payload.nexts,
            noOfCycle: action.payload.noOfCycle,
            ren: action.payload.ren,
            replayInfo: action.payload.replayInfo,
            replaySteps: action.payload.replaySteps,
            step: action.payload.step,
          },
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
