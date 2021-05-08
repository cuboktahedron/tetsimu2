import {
  ExplorerItem,
  ExplorerItemFolder,
  ExplorerItemType,
} from "stores/ExplorerState";
import {
  correctFolderData,
  isExplorerItemFolder,
} from "./explorerItemFunctions";

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
