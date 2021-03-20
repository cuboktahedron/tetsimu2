import { ExplorerItem, FolderItems } from "stores/ExplorerState";

export const getOrderedItems = (items: FolderItems): ExplorerItem[] => {
  // TODO: order variation
  const orderedItems = Object.values(items)
    .map((item: ExplorerItem) => {
      return item;
    })
    .sort((item1, item2) => {
      if (item1.type !== item2.type) {
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
