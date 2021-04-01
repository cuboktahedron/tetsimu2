import { ExplorerItemFile, Path } from "stores/ExplorerState";

export const ExplorerEventType = {
  FolderAdd: 1,
  FolderRemove: 2,
  FileAdd: 3,
  FileRemove: 4,
  FileSave: 5,
} as const;

export type ExplorerEventType = typeof ExplorerEventType[keyof typeof ExplorerEventType];

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

export type FileAdd = {
  type: typeof ExplorerEventType.FileAdd;
  payload: {
    dest: Path;
    newFileName: string;
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

export type ExplorerEvent =
  | FolderAdd
  | FolderRemove
  | FileAdd
  | FileRemove
  | FileSave;

export type ExplorerEventHandler = (event: ExplorerEvent) => void;
