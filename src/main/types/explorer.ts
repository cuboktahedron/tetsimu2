import { ExplorerItemFolder, ExplorerItemType, Path } from "stores/ExplorerState";

export const ExplorerIds = {
  Root: "__root__",
  TempFolder: "__tempFolder__",
} as const;

export const DragItemTypes = {
  File: "file",
  Folder: "folder",
};

export type DragItemData = {
  id: string;
  name: string;
  nodeId: string;
  path: Path;
  type: ExplorerItemType;
};

export const SyncState = {
  Ready: 0,
  Started: 1,
  Suceeded: 2,
  Failed: 3,
} as const;

export type SyncState = typeof SyncState[keyof typeof SyncState];

export type SyncStateWith = {
  addSync: boolean;
} & (
  | {
      state: typeof SyncState.Ready;
    }
  | {
      state: typeof SyncState.Started;
      syncUrl: string;
    }
  | {
      state: typeof SyncState.Suceeded;
      folder: ExplorerItemFolder;
    }
  | {
      state: typeof SyncState.Failed;
      reason: string;
    }
);
