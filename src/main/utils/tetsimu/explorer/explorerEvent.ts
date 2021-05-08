import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType,
  Path
} from "stores/ExplorerState";

export const ExplorerEventType = {
  ErrorOccured: "errorOccured",
  FileAdd: "fileAdd",
  FileLoad: "fileLoad",
  FileMerge: "fileMerge",
  FileRemove: "fileRemove",
  FileSave: "fileSave",
  FolderAdd: "folderAdd",
  FolderMerge: "folderMerge",
  FolderRemove: "folderRemove",
  FolderSave: "folderSave",
  FolderSync: "folderSync",
  ItemMove: "itemMove",
  SyncFolderAdd: "syncFolderAdd",
} as const;

export type ExplorerEventType = typeof ExplorerEventType[keyof typeof ExplorerEventType];

export type ErrorOccured = {
  type: typeof ExplorerEventType.ErrorOccured;
  payload: {
    reason: string;
    title: string;
  };
};

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

export type FileMerge = {
  type: typeof ExplorerEventType.FileMerge;
  payload: {
    data: ExplorerItemFile;
    to: Path;
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

export type FolderMerge = {
  type: typeof ExplorerEventType.FolderMerge;
  payload: {
    data: ExplorerItemFolder;
    to: Path;
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
    pathToSync: Path;
    syncData: ExplorerItemFolder;
  };
};

export type ItemMove = {
  type: typeof ExplorerEventType.ItemMove;
  payload: {
    from: Path;
    itemType: ExplorerItemType;
    to: Path;
  };
};

export type SyncFolderAdd = {
  type: typeof ExplorerEventType.SyncFolderAdd;
  payload: {
    dest: Path;
    syncData: ExplorerItemFolder;
  };
};

export type ExplorerEvent =
  | ErrorOccured
  | FileAdd
  | FileLoad
  | FileMerge
  | FileRemove
  | FileSave
  | FolderAdd
  | FolderMerge
  | FolderRemove
  | FolderSave
  | FolderSync
  | ItemMove
  | SyncFolderAdd;

export type ExplorerEventHandler = (event: ExplorerEvent) => void;
