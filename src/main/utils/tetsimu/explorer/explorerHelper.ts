import {
  ExplorerItemFolder,
  ExplorerItemType,
  Path,
  RootFolder,
} from "stores/ExplorerState";

export class ExplorerHelper {
  private rootFolder: RootFolder;

  constructor(_rootFolder: RootFolder) {
    this.rootFolder = { ..._rootFolder, items: { ..._rootFolder.items } };
  }

  folder(path: Path): FolderHelper | null {
    if (!path.startsWith("/")) {
      return null;
    }

    const dirs = [...path.split("/")].filter((dir) => dir !== "");
    let currentFolder = this.rootFolder;
    let parentFolder: ExplorerItemFolder | null = null;

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      const folder = Object.values(currentFolder.items).find((item) => {
        if (item.type === ExplorerItemType.Folder) {
          if (item.name === dir) {
            return true;
          }
        }
        return false;
      }) as ExplorerItemFolder;
      if (!folder) {
        return null;
      }

      const orgFolder = currentFolder.items[folder.id] as ExplorerItemFolder;
      currentFolder.items[folder.id] = {
        ...orgFolder,
        items: { ...orgFolder.items },
      };
      parentFolder = currentFolder;
      currentFolder = currentFolder.items[folder.id] as ExplorerItemFolder;
    }

    if (currentFolder === null) {
      return null;
    }

    return new FolderHelper(currentFolder, parentFolder, this.rootFolder);
  }
}

export class FolderHelper {
  constructor(
    private folder: ExplorerItemFolder,
    private parentFolder: ExplorerItemFolder | null,
    private rootFolder: RootFolder
  ) {}

  get id(): string {
    return this.folder.id;
  }

  get name(): string {
    return this.folder.name;
  }

  get root(): RootFolder {
    return this.rootFolder;
  }

  addFolder(newFolder: ExplorerItemFolder) {
    let suffixCount = 1;

    const newFolderName = (() => {
      const match = newFolder.name.match(/(.*)(\d+)$/);
      let nameBody = newFolder.name;

      if (match !== null) {
        if (match[1]) {
          nameBody = match[1];
        }

        if (match[2]) {
          suffixCount = +match[2];
        }
      }

      let newFolderName = nameBody + suffixCount;
      while (true) {
        const item = Object.values(this.folder.items).find(
          (item) => item.name === newFolderName
        );
        if (item === undefined) {
          break;
        } else {
          suffixCount++;
          newFolderName = nameBody + suffixCount;
        }
      }

      return newFolderName;
    })();

    this.folder.items[newFolder.id] = { ...newFolder, name: newFolderName };
  }

  remove() {
    if (this.parentFolder === null) {
      throw Error("Root folder can't be deleted.");
    }

    delete this.parentFolder.items[this.folder.id];
  }
}
