import { ExplorerRootFolder } from "stores/ExplorerState";
import { Action } from "types/core";

export const ExplorerActionsType = {
  AddFile: "explorer/addFile",
  AddFolder: "explorer/addFolder",
  RemoveFile: "explorer/removeFile",
  RemoveFolder: "explorer/removeFolder",
  SaveFile: "explorer/saveFile",
  SaveFolder: "explorer/saveFolder",
} as const;

export type ExplorerActions =
  | AddFileAction
  | AddFolderAction
  | RemoveFileAction
  | RemoveFolderAction
  | SaveFileAction
  | SaveFolderAction;

export type AddFileAction = {
  type: typeof ExplorerActionsType.AddFile;
  payload: {
    rootFolder: ExplorerRootFolder;
  };
} & Action;

export type AddFolderAction = {
  type: typeof ExplorerActionsType.AddFolder;
  payload: {
    rootFolder: ExplorerRootFolder;
  };
} & Action;

export type RemoveFileAction = {
  type: typeof ExplorerActionsType.RemoveFile;
  payload: {
    rootFolder: ExplorerRootFolder;
  };
} & Action;

export type RemoveFolderAction = {
  type: typeof ExplorerActionsType.RemoveFolder;
  payload: {
    rootFolder: ExplorerRootFolder;
  };
} & Action;

export type SaveFileAction = {
  type: typeof ExplorerActionsType.SaveFile;
  payload: {
    rootFolder: ExplorerRootFolder;
  };
} & Action;

export type SaveFolderAction = {
  type: typeof ExplorerActionsType.SaveFolder;
  payload: {
    rootFolder: ExplorerRootFolder;
  };
} & Action;
