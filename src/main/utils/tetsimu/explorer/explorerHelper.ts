import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType,
  FolderItems,
  Path,
  RootFolder
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

  file(path: Path): FileHelper | null {
    const lastIndefOfSlash = path.lastIndexOf("/");
    const parentFolder = this.folder(path.substring(0, lastIndefOfSlash));
    if (parentFolder === null) {
      return null;
    }

    const fileName = path.substring(lastIndefOfSlash + 1);
    const foundFile = Object.values(parentFolder.items).find((item) => {
      if (item.type === ExplorerItemType.File) {
        if (item.name === fileName) {
          return true;
        }
      }
      return false;
    }) as ExplorerItemFile;

    if (!foundFile) {
      return null;
    }

    const orgFile = parentFolder.items[foundFile.id] as ExplorerItemFile;
    const file = { ...orgFile };
    parentFolder.items[file.id] = file;

    return new FileHelper(file, parentFolder.raw, this.rootFolder);
  }
}

export class FolderHelper {
  constructor(
    private folder: ExplorerItemFolder,
    private parentFolder: ExplorerItemFolder | null,
    private rootFolder: RootFolder
  ) {}

  get raw(): ExplorerItemFolder {
    return this.folder;
  }

  get id(): string {
    return this.folder.id;
  }

  get name(): string {
    return this.folder.name;
  }

  get root(): RootFolder {
    return this.rootFolder;
  }

  get items(): FolderItems {
    return this.folder.items;
  }

  addFolder(newFolder: ExplorerItemFolder) {
    const newFolderName = this.makeNewFileName(newFolder.name);
    this.folder.items[newFolder.id] = { ...newFolder, name: newFolderName };
  }

  addFile(newFile: ExplorerItemFile) {
    const newFileName = this.makeNewFileName(newFile.name);
    this.folder.items[newFile.id] = { ...newFile, name: newFileName };
  }

  remove() {
    if (this.parentFolder === null) {
      throw Error("Root folder can't be deleted.");
    }

    delete this.parentFolder.items[this.folder.id];
  }

  private makeNewFileName(orgName: string): string {
    const match = orgName.match(/(.*)(\d+)$/);
    let nameBody = orgName;
    let suffixCount = 1;

    if (match !== null) {
      if (match[1]) {
        nameBody = match[1];
      }

      if (match[2]) {
        suffixCount = +match[2];
      }
    }

    let newName = nameBody + suffixCount;
    while (true) {
      const item = Object.values(this.folder.items).find(
        (item) => item.name === newName
      );
      if (item === undefined) {
        break;
      } else {
        suffixCount++;
        newName = nameBody + suffixCount;
      }
    }

    return newName;
  }
}

export class FileHelper {
  constructor(
    private file: ExplorerItemFile,
    // @ts-ignore
    private parentFolder: ExplorerItemFolder | null,
    private rootFolder: RootFolder
  ) {}

  get id(): string {
    return this.file.id;
  }

  get name(): string {
    return this.file.name;
  }

  get root(): RootFolder {
    return this.rootFolder;
  }
}
