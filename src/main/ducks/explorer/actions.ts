import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType,
  ExplorerRootFolder,
  Path
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
  AddSyncFolderAction,
  ExplorerActionsType,
  MergeFileAction,
  MergeFolderAction,
  MoveItemAction,
  RemoveFileAction,
  RemoveFolderAction,
  SaveFileAction,
  SaveFolderAction,
  SyncFolderAction
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

export const addSyncFolder = (
  dest: Path,
  syncData: ExplorerItemFolder,
  rootFolder: ExplorerRootFolder
): AddSyncFolderAction => {
  const folder = new ExplorerHelper(rootFolder).folder(dest) as FolderHelper;
  folder.addFolder(syncData);
  localStorage.setItem("explorer.rootFolder", JSON.stringify(folder.root));

  return {
    type: ExplorerActionsType.AddSyncFolder,
    payload: {
      rootFolder: folder.root,
    },
  };
};

export const mergeFile = (
  data: ExplorerItemFile,
  to: Path,
  rootFolder: ExplorerRootFolder
): MergeFileAction => {
  const folder = new ExplorerHelper(rootFolder).folder(to) as FolderHelper;
  folder.addFile(data);
  localStorage.setItem("explorer.rootFolder", JSON.stringify(folder.root));

  return {
    type: ExplorerActionsType.MergeFile,
    payload: {
      rootFolder: folder.root,
    },
  };
};

export const mergeFolder = (
  data: ExplorerItemFolder,
  to: Path,
  rootFolder: ExplorerRootFolder
): MergeFolderAction => {
  const folder = new ExplorerHelper(rootFolder).folder(to) as FolderHelper;
  folder.addFolder(data);
  localStorage.setItem("explorer.rootFolder", JSON.stringify(folder.root));

  return {
    type: ExplorerActionsType.MergeFolder,
    payload: {
      rootFolder: folder.root,
    },
  };
};

export const moveItem = (
  itemType: ExplorerItemType,
  from: Path,
  to: Path,
  rootFolder: ExplorerRootFolder
): MoveItemAction => {
  const helper = new ExplorerHelper(rootFolder);
  if (itemType === ExplorerItemType.File) {
    const fromFile = helper.file(from) as FileHelper;
    const toFolder = helper.folder(to) as FolderHelper;
    toFolder.addFile(fromFile.raw);
    fromFile.remove();
  } else if (itemType === ExplorerItemType.Folder) {
    const fromFolder = helper.folder(from) as FolderHelper;
    const toFolder = helper.folder(to) as FolderHelper;
    toFolder.addFolder(fromFolder.raw);
    fromFolder.remove();
  } else {
    throw new Error(`Invalid explorer item type(${itemType}) passed.`);
  }

  localStorage.setItem("explorer.rootFolder", JSON.stringify(helper.root));

  return {
    type: ExplorerActionsType.MoveItem,
    payload: {
      rootFolder: helper.root,
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

export const syncFolder = (
  pathToSync: Path,
  syncData: ExplorerItemFolder,
  rootFolder: ExplorerRootFolder
): SyncFolderAction => {
  const folder = new ExplorerHelper(rootFolder).folder(
    pathToSync
  ) as FolderHelper;
  folder.update(syncData);
  localStorage.setItem("explorer.rootFolder", JSON.stringify(folder.root));

  return {
    type: ExplorerActionsType.SyncFolder,
    payload: {
      rootFolder: folder.root,
    },
  };
};
