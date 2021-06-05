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
      errorMessage: `Same item(${data.id}) already exists.`,
    };
  }

  return validateFolderData(data);
};

export const validateLoadedFolderData = (
  parentFolder: ExplorerItemFolder,
  data: ExplorerItemFolder
): ExplorerItemValidatorReulst => {
  const entries = Object.entries(parentFolder.items);
  if (
    entries.some(([key]) => {
      return key === data.id;
    })
  ) {
    return {
      isValid: false,
      errorMessage: `Same item(${data.id}) already exists in folder(${parentFolder.id}).`,
    };
  }

  const duplicatedNameItem = entries
    .map(([, item]) => item)
    .find((item) => item.name === data.name);
  if (duplicatedNameItem) {
    return {
      isValid: false,
      errorMessage: `Duplicated item name(${duplicatedNameItem.name}) exists in folder(${parentFolder.id}).`,
    };
  }

  return validateFolderData(data);
};

export const validateLoadedFileData = (
  parentFolder: ExplorerItemFolder,
  data: ExplorerItemFile
): ExplorerItemValidatorReulst => {
  const entries = Object.entries(parentFolder.items);
  if (
    entries.some(([key]) => {
      return key === data.id;
    })
  ) {
    return {
      isValid: false,
      errorMessage: `Same item(${data.id}) already exists in folder(${parentFolder.id}).`,
    };
  }

  const duplicatedNameItem = entries
    .map(([, item]) => item)
    .find((item) => item.name === data.name);
  if (duplicatedNameItem) {
    return {
      isValid: false,
      errorMessage: `Duplicated item name exists in folder(${parentFolder.id}).`,
    };
  }

  return validateFileData(data);
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

  const duplicatedName = (() => {
    const entryNames = entries.map(([_, item]) => item.name).sort();
    let prevEntryName = null;
    for (let entryName of entryNames) {
      if (entryName === prevEntryName) {
        return entryName;
      }

      prevEntryName = entryName;
    }

    return null;
  })();

  if (!!duplicatedName) {
    return {
      isValid: false,
      errorMessage: `Duplicated item name(${duplicatedName}) exists in folder(${data.id}).`,
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
