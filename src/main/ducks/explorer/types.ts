import { RootFolder } from "stores/ExplorerState";
import { Action } from "types/core";

export const ExplorerActionsType = {
  AddFolder: "explorer/addFolder",
  RemoveFolder: "explorer/removeFolder",
} as const;

export type ExplorerActions = AddFolderAction | RemoveFolderAction;

export type AddFolderAction = {
  type: typeof ExplorerActionsType.AddFolder;
  payload: {
    rootFolder: RootFolder;
  };
} & Action;

export type RemoveFolderAction = {
  type: typeof ExplorerActionsType.RemoveFolder;
  payload: {
    rootFolder: RootFolder;
  };
} & Action;
