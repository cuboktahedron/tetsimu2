import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType,
  Path,
  RootFolder
} from "stores/ExplorerState";
import {
  ExplorerHelper,
  FileHelper,
  FolderHelper
} from "utils/tetsimu/explorer/explorerHelper";
import { v4 as uuidv4 } from "uuid";
import {
  AddFileAction,
  AddFolderAction,
  ExplorerActionsType,
  RemoveFileAction,
  RemoveFolderAction,
  SaveFileAction,
  SaveFolderAction
} from "./types";

export const addFile = (
  newFileName: string,
  destDir: Path,
  rootFolder: RootFolder
): AddFileAction => {
  const newId = uuidv4();

  const folder = new ExplorerHelper(rootFolder).folder(destDir) as FolderHelper;

  const newFile: ExplorerItemFile = {
    type: ExplorerItemType.File,
    description: "",
    id: newId,
    name: newFileName,
    parameters: "",
    syncUrl: "",
  };

  folder.addFile(newFile);

  return {
    type: ExplorerActionsType.AddFile,
    payload: {
      rootFolder: folder.root,
    },
  };
};

export const addFolder = (
  newFolderName: string,
  destDir: Path,
  rootFolder: RootFolder
): AddFolderAction => {
  const newId = uuidv4();

  const folder = new ExplorerHelper(rootFolder).folder(destDir) as FolderHelper;

  const newFolder: ExplorerItemFolder = {
    type: ExplorerItemType.Folder,
    description: "",
    id: newId,
    items: {},
    name: newFolderName,
    syncUrl: "",
  };

  folder.addFolder(newFolder);

  return {
    type: ExplorerActionsType.AddFolder,
    payload: {
      rootFolder: folder.root,
    },
  };
};

export const removeFile = (
  pathToDelete: Path,
  rootFolder: RootFolder
): RemoveFileAction => {
  const file = new ExplorerHelper(rootFolder).file(pathToDelete) as FileHelper;
  file.remove();

  return {
    type: ExplorerActionsType.RemoveFile,
    payload: {
      rootFolder: file.root,
    },
  };
};

export const removeFolder = (
  pathToDelete: Path,
  rootFolder: RootFolder
): RemoveFolderAction => {
  const folder = new ExplorerHelper(rootFolder).folder(
    pathToDelete
  ) as FolderHelper;

  folder.remove();

  return {
    type: ExplorerActionsType.RemoveFolder,
    payload: {
      rootFolder: folder.root,
    },
  };
};

export const saveFile = (
  pathToSave: Path,
  saveData: ExplorerItemFile,
  rootFolder: RootFolder
): SaveFileAction => {
  const file = new ExplorerHelper(rootFolder).file(pathToSave) as FileHelper;
  file.update(saveData);

  return {
    type: ExplorerActionsType.SaveFile,
    payload: {
      rootFolder: file.root,
    },
  };
};

export const saveFolder = (
  pathToSave: Path,
  saveData: ExplorerItemFolder,
  rootFolder: RootFolder
): SaveFolderAction => {
  const folder = new ExplorerHelper(rootFolder).folder(
    pathToSave
  ) as FolderHelper;
  folder.update(saveData);

  return {
    type: ExplorerActionsType.SaveFolder,
    payload: {
      rootFolder: folder.root,
    },
  };
};
