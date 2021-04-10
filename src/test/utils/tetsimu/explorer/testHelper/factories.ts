import { ExplorerItemFile, ExplorerItemFolder, ExplorerItemType } from "stores/ExplorerState";

export const makeFolder = (id: string, name: string): ExplorerItemFolder => {
  return {
    type: ExplorerItemType.Folder,
    description: "",
    id,
    items: {},
    name,
    syncUrl: "",
  };
};

export const makeFile = (id: string, name: string): ExplorerItemFile => {
  return {
    type: ExplorerItemType.File,
    description: "",
    id,
    name,
    parameters: "",
  };
};
