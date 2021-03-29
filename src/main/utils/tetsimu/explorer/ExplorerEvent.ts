import { Path } from "stores/ExplorerState";

export const ExplorerEventType = {
  FolderAdd: 1,
  FolderRemoved: 2,
  FileAdd: 3,
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
  type: typeof ExplorerEventType.FolderRemoved;
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

export type ExplorerEvent = FolderAdd | FolderRemove | FileAdd;

export type ExplorerEventHandler = (event: ExplorerEvent) => void;
