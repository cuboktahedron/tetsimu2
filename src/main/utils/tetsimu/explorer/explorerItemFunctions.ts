import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType,
} from "stores/ExplorerState";

export const isExplorerItemFolder = (
  orgData: unknown
): orgData is ExplorerItemFolder => {
  if (!isObject(orgData)) {
    return false;
  }

  const data = orgData as ExplorerItemFolder;

  if (data.type !== ExplorerItemType.Folder) {
    return false;
  }

  if (typeof data.description !== "string") {
    return false;
  }

  if (typeof data.id !== "string") {
    return false;
  }

  if (typeof data.name !== "string") {
    return false;
  }

  if (typeof data.syncUrl !== "string") {
    return false;
  }

  if (!isObject(data.items)) {
    return false;
  }

  return Object.values(data.items).every(
    (item) => isExplorerItemFolder(item) || isExplorerItemFile(item)
  );
};

export const isExplorerItemFile = (
  orgData: unknown
): orgData is ExplorerItemFile => {
  if (!isObject(orgData)) {
    return false;
  }

  const data = orgData as ExplorerItemFile;

  if (data.type !== ExplorerItemType.File) {
    return false;
  }

  if (typeof data.description !== "string") {
    return false;
  }

  if (typeof data.id !== "string") {
    return false;
  }

  if (typeof data.name !== "string") {
    return false;
  }

  if (typeof data.parameters !== "string") {
    return false;
  }

  return true;
};

export const correctFolderData = (data: ExplorerItemFolder) => {
  data.id = data.id.trim();
  data.name = data.name.trim();

  const entries = Object.entries(data.items);
  for (let i = 0; i < entries.length; i++) {
    const [key, item] = entries[i];
    delete data.items[key];
    data.items[key.trim()] = item;

    if (item.type === ExplorerItemType.File) {
      correctFileData(item);
    } else {
      correctFolderData(item);
    }
  }
};

export const correctFileData = (data: ExplorerItemFile) => {
  data.id = data.id.trim();
  data.name = data.name.trim();
};

const isObject = (data: unknown): data is object => {
  return (
    data !== null && (typeof data === "object" || typeof data === "function")
  );
};
