import { Path } from "stores/ExplorerState";

export const ExplorerEventType = {
  FolderAdded: 1,
} as const;

export type ExplorerEventType = typeof ExplorerEventType[keyof typeof ExplorerEventType];

export type FolderAdded = {
  type: typeof ExplorerEventType.FolderAdded;
  payload: {
    dest: Path;
    newFolderName: string;
  };
};

export type ExplorerEvent = FolderAdded;

export type ExplorerEventHandler = (event: ExplorerEvent) => void;
