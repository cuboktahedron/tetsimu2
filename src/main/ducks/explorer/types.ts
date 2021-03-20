import { RootFolder } from "stores/ExplorerState";
import { Action } from "types/core";

export const ExplorerActionsType = {
  AddFolder: "explorer/addFolder",
} as const;

export type ExplorerActions = AddFolderAction;

export type AddFolderAction = {
  type: typeof ExplorerActionsType.AddFolder;
  payload: {
    rootFolder: RootFolder;
  };
} & Action;
