import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType,
  initialExplorerState,
  RootFolder,
} from "stores/ExplorerState";
import {
  ExplorerHelper,
  FileHelper,
  FolderHelper,
} from "utils/tetsimu/explorer/explorerHelper";

const makeFolder = (id: string, name: string): ExplorerItemFolder => {
  return {
    type: ExplorerItemType.Folder,
    description: "",
    id,
    items: {},
    name,
    syncUrl: "",
  };
};

const makeFile = (id: string, name: string): ExplorerItemFile => {
  return {
    type: ExplorerItemType.File,
    description: "",
    id,
    name,
    parameters: "",
    syncUrl: "",
  };
};

describe("ExplorerHelper", () => {
  const folder1 = makeFolder("1", "folder1");
  folder1.items["1-1"] = makeFolder("1-1", "folder1-1");
  folder1.items["1-2"] = makeFolder("1-2", "folder1-2");
  folder1.items["1-3"] = makeFile("1-3", "file1-3");
  const folder2 = makeFolder("2", "folder2");

  const rootFolders: RootFolder = {
    ...initialExplorerState.rootFolder,
    items: { ...initialExplorerState.rootFolder.items },
  };

  rootFolders.items["1"] = folder1;
  rootFolders.items["2"] = folder2;

  it("should find specific folder", () => {
    const helper = new ExplorerHelper(rootFolders);
    const rootFolder = helper.folder("/") as FolderHelper;

    expect(rootFolder.name).toBe("root");

    const folder1 = helper.folder("/folder1") as FolderHelper;
    expect(folder1.id).toBe("1");

    const folder12 = helper.folder("/folder1/folder1-2") as FolderHelper;
    expect(folder12.id).toBe("1-2");
  });

  describe("folder", () => {
    describe("addFolder", () => {
      it("should add folder", () => {
        const helper = new ExplorerHelper(rootFolders);
        const rootFolder = helper.folder("/") as FolderHelper;
        rootFolder.addFolder(makeFolder("new1", "new_folder1"));

        const newFolder1 = helper.folder("/new_folder1") as FolderHelper;
        expect(newFolder1.id).toBe("new1");

        const helperOfOriginal = new ExplorerHelper(rootFolders);
        const orgNewFolder1 = helperOfOriginal.folder("/new_folder1");
        expect(orgNewFolder1).toBeNull();
      });

      it("should rename folder if same name item exists", () => {
        const helper = new ExplorerHelper(rootFolders);
        const rootFolder = helper.folder("/") as FolderHelper;
        rootFolder.addFolder(makeFolder("new1", "folder1"));

        const newFolder = helper.folder("/folder3") as FolderHelper;
        expect(newFolder?.id).toBe("new1");
      });
    });

    describe("removeFolder", () => {
      it("should remove folder", () => {
        const helper = new ExplorerHelper(rootFolders);

        const folder12 = helper.folder("/folder1/folder1-2") as FolderHelper;
        folder12.remove();
        expect(helper.folder("/folder1/folder1-2")).toBeNull();

        const helperOfOriginal = new ExplorerHelper(rootFolders);
        const orgFolder12 = helperOfOriginal.folder("/folder1/folder1-2");
        expect(orgFolder12).not.toBeNull();
      });
    });

    describe("addFfile", () => {
      it("should add file", () => {
        const helper = new ExplorerHelper(rootFolders);
        const folder12 = helper.folder("/folder1/folder1-2") as FolderHelper;
        folder12.addFile(makeFile("new1", "new_file1"));

        const newFile1 = helper.file(
          "/folder1/folder1-2/new_file1"
        ) as FileHelper;
        expect(newFile1.id).toBe("new1");

        const helperOfOriginal = new ExplorerHelper(rootFolders);
        const orgNewFile1 = helperOfOriginal.file(
          "/folder1/folder1-2/new_file1"
        );
        expect(orgNewFile1).toBeNull();
      });

      it("should rename file if same name item exists", () => {
        const helper = new ExplorerHelper(rootFolders);
        const folder12 = helper.folder("/folder1") as FolderHelper;
        folder12.addFile(makeFile("new1", "file1-3"));

        const newFile = helper.file("/folder1/file1-4") as FileHelper;
        expect(newFile.id).toBe("new1");
      });
    });

    describe("removeFile", () => {
      it("should remove file", () => {
        const helper = new ExplorerHelper(rootFolders);

        const file13 = helper.file("/folder1/file1-3") as FileHelper;
        file13.remove();
        expect(helper.folder("/folder1/file1-3")).toBeNull();

        const helperOfOriginal = new ExplorerHelper(rootFolders);
        const orgFile13 = helperOfOriginal.file("/folder1/file1-3");
        expect(orgFile13).not.toBeNull();
      });
    });

    describe("updateFile", () => {
      it("should update file", () => {
        const helper = new ExplorerHelper(rootFolders);

        const file13 = helper.file("/folder1/file1-3") as FileHelper;
        file13.update({
          id: file13.id,
          description: "new description",
          name: "new name",
          parameters: "new parameters",
          syncUrl: "new sync url",
          type: ExplorerItemType.File,
        });
        const newFile13 = helper.file("/folder1/new name") as FileHelper;
        expect(newFile13.description).toBe("new description");
        expect(newFile13.name).toBe("new name");
        expect(newFile13.parameters).toBe("new parameters");
        expect(newFile13.syncUrl).toBe("new sync url");

        const helperOfOriginal = new ExplorerHelper(rootFolders);
        const orgFile13 = helperOfOriginal.file(
          "/folder1/new name"
        ) as FileHelper;
        expect(orgFile13).toBeNull();
      });
    });
  });
});
