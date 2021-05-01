import { ExplorerItemType, Path } from "stores/ExplorerState";

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
