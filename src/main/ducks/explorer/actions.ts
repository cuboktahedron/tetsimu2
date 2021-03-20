import {
  ExplorerItemFolder,
  ExplorerItemType,
  Path,
  RootFolder
} from "stores/ExplorerState";
import { ExplorerHelper, FolderHelper } from "utils/tetsimu/explorer/explorerHelper";
import { v4 as uuidv4 } from "uuid";
import { AddFolderAction, ExplorerActionsType } from "./types";

export const addFolder = (
  newFolderName: string,
  destDir: Path,
  rootFolder: RootFolder
): AddFolderAction => {
  const newId = uuidv4();

  // TODO: null check
  const folder = new ExplorerHelper(rootFolder).folder(destDir) as FolderHelper;

  const newFolder: ExplorerItemFolder = {
    type: ExplorerItemType.Folder,
    details: "",
    id: newId,
    items: {},
    name: newFolderName,
    syncUrl: "",
  };

  folder.addFolder(newFolder);

  return {
    type: ExplorerActionsType.AddFolder,
    payload: {
      rootFolder: folder.root,
    },
  };
};
