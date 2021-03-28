import {
  ExplorerItemFolder,
  ExplorerItemType,
  initialExplorerState,
  RootFolder,
} from "stores/ExplorerState";
import {
  ExplorerHelper,
  FolderHelper,
} from "utils/tetsimu/explorer/explorerHelper";

const makeFolder = (id: string, name: string): ExplorerItemFolder => {
  return {
    type: ExplorerItemType.Folder,
    details: "",
    id,
    items: {},
    name,
    syncUrl: "",
  };
};

describe("ExplorerHelper", () => {
  const folder1 = makeFolder("1", "folder1");
  folder1.items["1-1"] = makeFolder("1-1", "folder1-1");
  folder1.items["1-2"] = makeFolder("1-2", "folder1-2");
  const folder2 = makeFolder("2", "folder2");

  const rootFolders: RootFolder = {
    ...initialExplorerState.rootFolder,
    items: { ...initialExplorerState.rootFolder.items },
  };

  rootFolders.items["1"] = folder1;
  rootFolders.items["2"] = folder2;

  it("should find specific folder", () => {
    const helper = new ExplorerHelper(rootFolders);
    const rootFolder = helper.folder("/");

    expect(rootFolder?.name).toBe("root");

    const folder1 = helper.folder("/folder1");
    expect(folder1?.id).toBe("1");

    const folder12 = helper.folder("/folder1/folder1-2");
    expect(folder12?.id).toBe("1-2");
  });

  describe("folder", () => {
    describe("addFolder", () => {
      it("should add folder", () => {
        const helper = new ExplorerHelper(rootFolders);
        const rootFolder = helper.folder("/") as FolderHelper;
        rootFolder.addFolder(makeFolder("new1", "new_folder1"));

        const newFolder1 = helper.folder("/new_folder1");
        expect(newFolder1?.id).toBe("new1");

        const helperOfOriginal = new ExplorerHelper(rootFolders);
        const orgNewFolder1 = helperOfOriginal.folder("/new_folder1");
        expect(orgNewFolder1).toBeNull();
      });

      it("should rename folder if same name item exists", () => {
        const helper = new ExplorerHelper(rootFolders);
        const rootFolder = helper.folder("/") as FolderHelper;
        rootFolder.addFolder(makeFolder("new1", "folder1"));

        const newFolder = helper.folder("/folder3");
        expect(newFolder?.id).toBe("new1");
      });
    });

    describe("removeFolder", () => {
      it("should remove folder", () => {
        const helper = new ExplorerHelper(rootFolders);

        const folder12 = helper.folder("/folder1/folder1-2");
        folder12?.remove();
        expect(helper.folder("/folder1/folder1-2")).toBeNull();

        const helperOfOriginal = new ExplorerHelper(rootFolders);
        const orgFolder12 = helperOfOriginal.folder("/folder1/folder1-2");
        expect(orgFolder12).not.toBeNull();
      });
    });
  });
});
