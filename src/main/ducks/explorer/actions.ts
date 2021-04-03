import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType,
  Path,
  ExplorerRootFolder,
} from "stores/ExplorerState";
import {
  ExplorerHelper,
  FileHelper,
  FolderHelper,
} from "utils/tetsimu/explorer/explorerHelper";
import { v4 as uuidv4 } from "uuid";
import {
  AddFileAction,
  AddFolderAction,
  ExplorerActionsType,
  RemoveFileAction,
  RemoveFolderAction,
  SaveFileAction,
  SaveFolderAction,
} from "./types";

export const addFile = (
  newFileName: string,
  destDir: Path,
  rootFolder: ExplorerRootFolder
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
  localStorage.setItem("explorer.rootFolder", JSON.stringify(folder.root));

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
  rootFolder: ExplorerRootFolder
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
  localStorage.setItem("explorer.rootFolder", JSON.stringify(folder.root));

  return {
    type: ExplorerActionsType.AddFolder,
    payload: {
      rootFolder: folder.root,
    },
  };
};

export const removeFile = (
  pathToDelete: Path,
  rootFolder: ExplorerRootFolder
): RemoveFileAction => {
  const file = new ExplorerHelper(rootFolder).file(pathToDelete) as FileHelper;
  file.remove();
  localStorage.setItem("explorer.rootFolder", JSON.stringify(file.root));

  return {
    type: ExplorerActionsType.RemoveFile,
    payload: {
      rootFolder: file.root,
    },
  };
};

export const removeFolder = (
  pathToDelete: Path,
  rootFolder: ExplorerRootFolder
): RemoveFolderAction => {
  const folder = new ExplorerHelper(rootFolder).folder(
    pathToDelete
  ) as FolderHelper;

  folder.remove();
  localStorage.setItem("explorer.rootFolder", JSON.stringify(folder.root));

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
  rootFolder: ExplorerRootFolder
): SaveFileAction => {
  const file = new ExplorerHelper(rootFolder).file(pathToSave) as FileHelper;
  file.update(saveData);
  localStorage.setItem("explorer.rootFolder", JSON.stringify(file.root));

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
  rootFolder: ExplorerRootFolder
): SaveFolderAction => {
  const folder = new ExplorerHelper(rootFolder).folder(
    pathToSave
  ) as FolderHelper;
  folder.update(saveData);
  localStorage.setItem("explorer.rootFolder", JSON.stringify(folder.root));

  return {
    type: ExplorerActionsType.SaveFolder,
    payload: {
      rootFolder: folder.root,
    },
  };
};
