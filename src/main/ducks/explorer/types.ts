import { RootFolder } from "stores/ExplorerState";
import { Action } from "types/core";

export const ExplorerActionsType = {
  AddFile: "explorer/addFile",
  AddFolder: "explorer/addFolder",
  RemoveFile: "explorer/removeFile",
  RemoveFolder: "explorer/removeFolder",
  SaveFile: "explorer/saveFile",
} as const;

export type ExplorerActions =
  | AddFileAction
  | AddFolderAction
  | RemoveFileAction
  | RemoveFolderAction
  | SaveFileAction;

export type AddFileAction = {
  type: typeof ExplorerActionsType.AddFile;
  payload: {
    rootFolder: RootFolder;
  };
} & Action;

export type AddFolderAction = {
  type: typeof ExplorerActionsType.AddFolder;
  payload: {
    rootFolder: RootFolder;
  };
} & Action;

export type RemoveFileAction = {
  type: typeof ExplorerActionsType.RemoveFile;
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

export type SaveFileAction = {
  type: typeof ExplorerActionsType.SaveFile;
  payload: {
    rootFolder: RootFolder;
  };
} & Action;
