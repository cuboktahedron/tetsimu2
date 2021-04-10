import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType,
} from "stores/ExplorerState";

export type ExplorerItemValidatorReulst =
  | { isValid: true }
  | { isValid: false; errorMessage: string };

export const validateSyncedData = (
  syncFolder: ExplorerItemFolder | null,
  parentFolder: ExplorerItemFolder,
  data: ExplorerItemFolder
): ExplorerItemValidatorReulst => {
  const entries = Object.entries(parentFolder.items);
  if (
    entries.some(([key, _]) => {
      if (syncFolder !== null && syncFolder.id === key) {
        return false;
      } else {
        return key === data.id;
      }
    })
  ) {
    return {
      isValid: false,
      errorMessage: `Same item(${data.id}) already exist.`,
    };
  }

  return validateFolderData(data);
};

export const validateFolderData = (
  data: ExplorerItemFolder
): ExplorerItemValidatorReulst => {
  const entries = Object.entries(data.items);
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    if (key !== value.id) {
      return {
        isValid: false,
        errorMessage: `Key(${key}) of folder(${data.id}) is not mutch with item's id(${value.id}).`,
      };
    }
  }

  const nameSet = new Set(entries.map(([_, value]) => value.name));
  if (nameSet.size !== entries.length) {
    return {
      isValid: false,
      errorMessage: `Duplicate item names exist in folder(${data.id}).`,
    };
  }

  const items = entries.map(([_, value]) => value);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.id === "") {
      return {
        isValid: false,
        errorMessage: `Id of item in folder(${data.id}) is required.`,
      };
    }

    if (item.name === "") {
      return {
        isValid: false,
        errorMessage: `Name of item(${item.id}) in folder(${data.id}) is required.`,
      };
    }

    if (item.type === ExplorerItemType.File) {
      const result = validateFileData(item);
      if (!result.isValid) {
        return result;
      }
    } else {
      const result = validateFolderData(item);
      if (!result.isValid) {
        return result;
      }
    }
  }

  return { isValid: true };
};

export const validateFileData = (
  item: ExplorerItemFile
): ExplorerItemValidatorReulst => {
  if (item.id === "") {
    return {
      isValid: false,
      errorMessage: `Id of item is required.`,
    };
  }

  if (item.name === "") {
    return {
      isValid: false,
      errorMessage: `Name of item(${item.id}) is required.`,
    };
  }

  return { isValid: true };
};
