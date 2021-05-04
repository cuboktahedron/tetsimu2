import {
  ExplorerItem,
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType
} from "stores/ExplorerState";

export type FetchExplorerItemFolderResult =
  | {
      succeeded: true;
      data: ExplorerItemFolder;
    }
  | {
      succeeded: false;
      reason: string;
    };

export const fetchExplorerItemFolder = async (
  syncUrl: string
): Promise<FetchExplorerItemFolderResult> => {
  const result = await fetch(syncUrl, {
    cache: "no-cache",
  }).catch((err: Error) => {
    return {
      succeeded: false,
      reason: err.message,
    };
  });

  if ("ok" in result) {
    const response = result;
    if (response.ok) {
      const data = await response.json().catch((err: Error) => {
        return err.message;
      });

      if (typeof data === "string") {
        return {
          succeeded: false,
          reason: `Synced data is not json format. (${data})`,
        };
      } else if (isExplorerItemFolder(data)) {
        correctFolderData(data);
        data.syncUrl = syncUrl;

        const items = await Promise.all(
          Object.values(data.items).map(async (item) => {
            if (item.type === ExplorerItemType.Folder && item.syncUrl) {
              const nested = await fetchExplorerItemFolder(item.syncUrl);
              if (nested.succeeded) {
                return nested.data;
              } else {
                // TODO: error handling
                throw new Error(nested.reason);
              }
            } else {
              return item;
            }
          })
        );

        data.items = (() => {
          const itemObjs: { [key: string]: ExplorerItem } = {};
          items.forEach((item) => {
            itemObjs[item.id] = item;
          });
          return itemObjs;
        })();

        return {
          succeeded: true,
          data,
        };
      } else {
        return {
          succeeded: false,
          reason: `Synced data is broken.`,
        };
      }
    } else {
      return {
        succeeded: false,
        reason: response.statusText,
      };
    }
  } else {
    return {
      succeeded: false,
      reason: result.reason,
    };
  }
};

const isObject = (data: unknown): data is object => {
  return (
    data !== null && (typeof data === "object" || typeof data === "function")
  );
};

const isExplorerItemFolder = (
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

const isExplorerItemFile = (orgData: unknown): orgData is ExplorerItemFile => {
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

const correctFolderData = (data: ExplorerItemFolder) => {
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

const correctFileData = (data: ExplorerItemFile) => {
  data.id = data.id.trim();
  data.name = data.name.trim();
};
