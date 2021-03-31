import { ExplorerState } from "stores/ExplorerState";
import { Action } from "types/core";
import { ExplorerActions, ExplorerActionsType } from "./types";

const reducer = (state: ExplorerState, anyAction: Action): ExplorerState => {
  const action = anyAction as ExplorerActions;

  switch (action.type) {
    case ExplorerActionsType.AddFile:
      return {
        ...state,
        rootFolder: action.payload.rootFolder,
      };
    case ExplorerActionsType.AddFolder:
      return {
        ...state,
        rootFolder: action.payload.rootFolder,
      };
    case ExplorerActionsType.RemoveFile:
      return {
        ...state,
        rootFolder: action.payload.rootFolder,
      };
    case ExplorerActionsType.RemoveFolder:
      return {
        ...state,
        rootFolder: action.payload.rootFolder,
      };
    default:
      return state;
  }
  return state;
};

export default reducer;
