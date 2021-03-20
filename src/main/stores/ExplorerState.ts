export type ExplorerState = {
  rootFolder: RootFolder;
};

export const ExplorerItemType = {
  Folder: 1,
  File: 2,
} as const;

export type ExplorerItemType = typeof ExplorerItemType[keyof typeof ExplorerItemType];

export type ExploreItemFile = {
  type: typeof ExplorerItemType.File;
  details: string;
  id: string;
  name: string;
  parameters: string;
  syncUrl: string;
};

export type RootFolder = ExplorerItemFolder;
export type FolderItems = { [key: string]: ExplorerItem };
export type Path = string;

export type ExplorerItemFolder = {
  type: typeof ExplorerItemType.Folder;
  details: string;
  id: string;
  items: FolderItems;
  name: string;
  syncUrl: string;
};

export type ExplorerItem = ExploreItemFile | ExplorerItemFolder;

export const initialExplorerState: ExplorerState = ((): ExplorerState => {
  return {
    rootFolder: {
      details: "",
      id: "__root__",
      items: {},
      name: "root",
      syncUrl: "",
      type: ExplorerItemType.Folder,
    },
  };
})();