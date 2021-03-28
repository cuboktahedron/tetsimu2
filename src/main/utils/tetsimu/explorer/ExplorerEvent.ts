import { Path } from "stores/ExplorerState";

export const ExplorerEventType = {
  FolderAdded: 1,
  FolderRemoved: 2,
} as const;

export type ExplorerEventType = typeof ExplorerEventType[keyof typeof ExplorerEventType];

export type FolderAdded = {
  type: typeof ExplorerEventType.FolderAdded;
  payload: {
    dest: Path;
    newFolderName: string;
  };
};

export type FolderRemoved = {
  type: typeof ExplorerEventType.FolderRemoved;
  payload: {
    pathToDelete: Path;
  };
};

export type ExplorerEvent = FolderAdded | FolderRemoved;

export type ExplorerEventHandler = (event: ExplorerEvent) => void;
