import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType,
  Path,
  RootFolder
} from "stores/ExplorerState";
import {
  ExplorerHelper,
  FolderHelper
} from "utils/tetsimu/explorer/explorerHelper";
import { v4 as uuidv4 } from "uuid";
import {
  AddFileAction,
  AddFolderAction,
  ExplorerActionsType,
  RemoveFolderAction
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
    details: "",
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
    details: "",
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
