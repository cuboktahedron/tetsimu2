import {
  ExplorerItemFile,
  ExplorerItemFolder,
  Path
} from "stores/ExplorerState";

export const ExplorerEventType = {
  FileAdd: "fileAdd",
  FileLoad: "fileLoad",
  FileRemove: "fileRemove",
  FileSave: "fileSave",
  FolderAdd: "folderAdd",
  FolderRemove: "folderRemove",
  FolderSave: "folderSave",
  FolderSync: "folderSync",
} as const;

export type ExplorerEventType = typeof ExplorerEventType[keyof typeof ExplorerEventType];

export type FileAdd = {
  type: typeof ExplorerEventType.FileAdd;
  payload: {
    dest: Path;
    newFileName: string;
  };
};

export type FileLoad = {
  type: typeof ExplorerEventType.FileLoad;
  payload: {
    parameters: string;
  };
};

export type FileRemove = {
  type: typeof ExplorerEventType.FileRemove;
  payload: {
    pathToDelete: Path;
  };
};

export type FileSave = {
  type: typeof ExplorerEventType.FileSave;
  payload: {
    file: ExplorerItemFile;
    pathToSave: Path;
  };
};

export type FolderAdd = {
  type: typeof ExplorerEventType.FolderAdd;
  payload: {
    dest: Path;
    newFolderName: string;
  };
};

export type FolderRemove = {
  type: typeof ExplorerEventType.FolderRemove;
  payload: {
    pathToDelete: Path;
  };
};

export type FolderSave = {
  type: typeof ExplorerEventType.FolderSave;
  payload: {
    folder: ExplorerItemFolder;
    pathToSave: Path;
  };
};

export type FolderSync = {
  type: typeof ExplorerEventType.FolderSync;
  payload: {
    folder: ExplorerItemFolder;
    pathToSync: Path;
  };
};

export type ExplorerEvent =
  | FileAdd
  | FileLoad
  | FileRemove
  | FileSave
  | FolderAdd
  | FolderRemove
  | FolderSave
  | FolderSync;

export type ExplorerEventHandler = (event: ExplorerEvent) => void;
