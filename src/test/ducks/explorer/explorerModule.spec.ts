import { moveItem } from "ducks/explorer/actions";
import { ExplorerActionsType, MoveItemAction } from "ducks/explorer/types";
import {
  ExplorerItemType,
  ExplorerRootFolder,
  initialExplorerState,
} from "stores/ExplorerState";
import {
  makeFile,
  makeFolder,
} from "../../utils/tetsimu/explorer/testHelper/factories";

describe("explorerModule", () => {
  const folder1 = makeFolder("1", "folder1");
  folder1.items["1-1"] = makeFolder("1-1", "folder1-1");
  folder1.items["1-2"] = makeFolder("1-2", "folder1-2");
  folder1.items["1-3"] = makeFile("1-3", "file1-3");
  const folder2 = makeFolder("2", "folder2");

  const rootFolders: ExplorerRootFolder = {
    ...initialExplorerState.rootFolder,
    items: { ...initialExplorerState.rootFolder.items },
  };

  rootFolders.items["1"] = folder1;
  rootFolders.items["2"] = folder2;

  describe("moveItem", () => {
    it("should move item ", () => {
      const actual = moveItem(
        ExplorerItemType.Folder,
        "/folder1/folder1-1",
        "/folder1/folder1-2",
        rootFolders
      );

      const folder1 = makeFolder("1", "folder1");
      folder1.items["1-2"] = makeFolder("1-2", "folder1-2");
      folder1.items["1-2"].items["1-1"] = makeFolder("1-1", "folder1-1");
      folder1.items["1-3"] = makeFile("1-3", "file1-3");
      const folder2 = makeFolder("2", "folder2");

      const expectedRootFolders: ExplorerRootFolder = {
        ...initialExplorerState.rootFolder,
        items: { ...initialExplorerState.rootFolder.items },
      };
      expectedRootFolders.items["1"] = folder1;
      expectedRootFolders.items["2"] = folder2;

      const expected: MoveItemAction = {
        type: ExplorerActionsType.MoveItem,
        payload: {
          rootFolder: expectedRootFolders,
        },
      };

      expect(actual).toEqual(expected);
    });
  });
});
