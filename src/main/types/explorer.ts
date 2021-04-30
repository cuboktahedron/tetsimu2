import { ExplorerItemType, Path } from "stores/ExplorerState";

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
