import { ExplorerIds } from "types/explorer";

export type ExplorerState = {
  initialSyncUrl: string;
  rootFolder: ExplorerRootFolder;
};

export const ExplorerItemType = {
  Folder: 1,
  File: 2,
} as const;

export type ExplorerItemType = typeof ExplorerItemType[keyof typeof ExplorerItemType];

export type ExplorerItemFile = {
  type: typeof ExplorerItemType.File;
  description: string;
  id: string;
  name: string;
  parameters: string;
};

export type ExplorerRootFolder = ExplorerItemFolder;
export type FolderItems = { [key: string]: ExplorerItem };
export type Path = string;

export type ExplorerItemFolder = {
  type: typeof ExplorerItemType.Folder;
  description: string;
  id: string;
  items: FolderItems;
  name: string;
  syncUrl: string;
};

export type ExplorerItem = ExplorerItemFile | ExplorerItemFolder;

export const initialExplorerState: ExplorerState = ((): ExplorerState => {
  return {
    initialSyncUrl: "",
    rootFolder: {
      description: "",
      id: ExplorerIds.Root,
      items: {},
      name: "root",
      syncUrl: "",
      type: ExplorerItemType.Folder,
    },
  };
})();
