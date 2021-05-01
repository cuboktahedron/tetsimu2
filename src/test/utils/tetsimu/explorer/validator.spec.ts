import { ExplorerIds } from "types/explorer";
import {
  validateFileData,
  validateFolderData,
  validateSyncedData,
} from "utils/tetsimu/explorer/validator";
import { makeFile, makeFolder } from "./testHelper/factories";

describe("validate", () => {
  // + __root__: root
  //   + 1:folder1
  //     + 1-1: folder1-1
  //     + 1-2: folder1-2
  //     1-3: file1-3
  //   + 2: folder2
  const root = makeFolder(ExplorerIds.Root, "roor");
  const folder1 = makeFolder("1", "folder1");
  folder1.items["1-1"] = makeFolder("1-1", "folder1-1");
  folder1.items["1-2"] = makeFolder("1-2", "folder1-2");
  folder1.items["1-3"] = makeFile("1-3", "file1-3");
  const folder2 = makeFolder("2", "folder2");
  root.items[folder1.id] = folder1;
  root.items[folder2.id] = folder2;

  describe("SyncedData", () => {
    it("Should return invalid due to duplicate item exists", () => {
      const result = validateSyncedData(
        null,
        folder1,
        makeFolder("1-1", "syncFolder")
      );

      expect(result).toEqual({
        isValid: false,
        errorMessage: `Same item(1-1) already exist.`,
      });
    });
  });

  describe("validateFolderData", () => {
    it("Should return invalid due to id is not mutch with item's id", () => {
      const folder = makeFolder("sync1", "syncFolder");
      folder.items["sync1-1"] = makeFolder("sync1-1", "syncFolder1-1");
      folder.items["sync1-2"] = makeFolder("syncx-x", "syncFolder1-2");

      const result = validateFolderData(folder);

      expect(result).toEqual({
        isValid: false,
        errorMessage: `Key(sync1-2) of folder(sync1) is not mutch with item's id(syncx-x).`,
      });
    });

    it("Should return invalid due to duplicate item names exist", () => {
      const folder = makeFolder("sync1", "syncFolder");
      folder.items["sync1-1"] = makeFolder("sync1-1", "syncFolder1-1");
      folder.items["sync1-2"] = makeFolder("sync1-2", "syncFolder1-1");

      const result = validateFolderData(folder);

      expect(result).toEqual({
        isValid: false,
        errorMessage: `Duplicate item names exist in folder(sync1).`,
      });
    });

    it("Should return invalid due to id is empty", () => {
      const folder = makeFolder("sync1", "syncFolder");
      folder.items["sync1-1"] = makeFolder("sync1-1", "syncFolder1-1");
      folder.items[""] = makeFolder("", "syncFolder1-2");

      const result = validateFolderData(folder);

      expect(result).toEqual({
        isValid: false,
        errorMessage: `Id of item in folder(sync1) is required.`,
      });
    });

    it("Should return invalid due to name is empty", () => {
      const folder = makeFolder("sync1", "syncFolder");
      folder.items["sync1-1"] = makeFolder("sync1-1", "syncFolder1-1");
      folder.items["sync1-2"] = makeFolder("sync1-2", "");

      const result = validateFolderData(folder);

      expect(result).toEqual({
        isValid: false,
        errorMessage: `Name of item(sync1-2) in folder(sync1) is required.`,
      });
    });

    it("Should return valid", () => {
      const folder = makeFolder("sync1", "syncFolder");
      folder.items["sync1-1"] = makeFolder("sync1-1", "syncFolder1-1");
      folder.items["sync1-1"].items["sync1-1-1"] = makeFile("sync1-1-1", "syncFile1-1-1");
      folder.items["sync1-2"] = makeFolder("sync1-2", "syncFolder1-2");
      folder.items["sync1-3"] = makeFile("sync1-3", "syncFile1-3");

      const result = validateFolderData(folder);

      expect(result).toEqual({
        isValid: true,
      });
    });
  });

  describe("validateFileData", () => {
    it("Should return invalid due to id is empty", () => {
      const file = makeFile("", "syncFile");

      const result = validateFileData(file);

      expect(result).toEqual({
        isValid: false,
        errorMessage: `Id of item is required.`,
      });
    });

    it("Should return invalid due to name is empty", () => {
      const file = makeFile("file1", "");

      const result = validateFileData(file);

      expect(result).toEqual({
        isValid: false,
        errorMessage: `Name of item(file1) is required.`,
      });
    });

    it("Should return valid", () => {
      const file = makeFile("file", "syncFile");

      const result = validateFileData(file);

      expect(result).toEqual({
        isValid: true,
      });
    });
  });
});
