import { ExplorerItem, FolderItems } from "stores/ExplorerState";
import { ExplorerIds } from "types/explorer";

export const getOrderedItems = (items: FolderItems): ExplorerItem[] => {
  const orderedItems = Object.values(items)
    .map((item: ExplorerItem) => {
      return item;
    })
    .sort((item1, item2) => {
      if (item1.id === ExplorerIds.TempFolder) {
        return 1;
      } else if (item2.id === ExplorerIds.TempFolder) {
        return -1
      } else if (item1.type !== item2.type) {
        return item1.type - item2.type;
      } else if (item1.name < item2.name) {
        return -1;
      } else if (item1.name > item2.name) {
        return 1;
      } else {
        return item1.id < item2.id ? -1 : 1;
      }
    });

  return orderedItems;
};
