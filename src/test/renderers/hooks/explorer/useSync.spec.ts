import { act, renderHook } from "@testing-library/react-hooks";
import fetchMock from "fetch-mock";
import { FolderUniqueProps } from "renderers/components/explorer/Folder";
import { useSync } from "renderers/hooks/explorer/useSync";
import { useValueRef } from "renderers/hooks/useValueRef";
import { ExplorerItemType, initialExplorerState } from "stores/ExplorerState";
import { SyncState } from "types/explorer";
import {
  ExplorerEvent,
  ExplorerEventType
} from "utils/tetsimu/explorer/explorerEvent";

describe("useSync", () => {
  it("should fire SyncFolderAdd", async () => {
    fetchMock.get("http://localhost/test1.json", {
      status: 200,
      body: {
        description: "folder1 description",
        name: "folder1",
        syncUrl: "",
        id: "1",
        items: {},
        type: 1,
      },
    });

    let calledEvent: ExplorerEvent | null = null;
    const { result, waitFor, rerender } = renderHook(() => {
      const eventHandler = useValueRef((event: ExplorerEvent) => {
        calledEvent = event;
      });

      const dummyParentFolder = {};

      return {
        eventHandler,
        sync: useSync({
          ...initialExplorerState.rootFolder,
          eventHandler,
          parentFolder: dummyParentFolder as FolderUniqueProps,
          path: "/",
        }),
      };
    });

    await act(async () => {
      const [, setSyncState] = result.current.sync;

      rerender();
      setSyncState({
        addSync: true,
        state: SyncState.Started,
        syncUrl: "http://localhost/test1.json",
      });

      rerender();
      await waitFor(() => result.current.sync[0].state === SyncState.Suceeded);
      rerender();
      await waitFor(() => result.current.sync[0].state === SyncState.Ready);
    });

    const [syncState] = result.current.sync;

    expect(syncState).toEqual({
      addSync: false,
      state: SyncState.Ready,
    });

    expect(calledEvent).toEqual({
      type: ExplorerEventType.SyncFolderAdd,
      payload: {
        dest: "/",
        syncData: {
          description: "folder1 description",
          name: "folder1",
          syncUrl: "http://localhost/test1.json",
          id: "1",
          items: {},
          type: 1,
        },
      },
    });

    fetchMock.restore();
  });

  it("should fire FolderSync", async () => {
    fetchMock.get("http://localhost/test1.json", {
      status: 200,
      body: {
        description: "folder1 description",
        name: "folder1",
        syncUrl: "",
        id: "1",
        items: {},
        type: 1,
      },
    });

    let calledEvent: ExplorerEvent | null = null;
    const { result, waitFor, rerender } = renderHook(() => {
      const eventHandler = useValueRef((event: ExplorerEvent) => {
        calledEvent = event;
      });

      const parentFolder = {
        ...initialExplorerState.rootFolder,
      };

      return {
        eventHandler,
        sync: useSync({
          description: "",
          eventHandler,
          id: "id-1",
          initialSyncUrl: "",
          items: {},
          name: "syncFolder",
          parentFolder: parentFolder,
          path: "/syncFolder",
          syncUrl: "http://localhost/test1.json",
          type: ExplorerItemType.Folder,
        }),
      };
    });

    await act(async () => {
      const [, setSyncState] = result.current.sync;

      rerender();
      setSyncState({
        addSync: false,
        state: SyncState.Started,
        syncUrl: "http://localhost/test1.json",
      });

      rerender();
      await waitFor(() => result.current.sync[0].state === SyncState.Suceeded);
      rerender();
      await waitFor(() => result.current.sync[0].state === SyncState.Ready);
    });

    expect(calledEvent).toEqual({
      type: ExplorerEventType.FolderSync,
      payload: {
        pathToSync: "/syncFolder",
        syncData: {
          description: "folder1 description",
          name: "folder1",
          syncUrl: "http://localhost/test1.json",
          id: "1",
          items: {},
          type: 1,
        },
      },
    });

    fetchMock.restore();
  });

  it("should fire ErrorOccured", async () => {
    fetchMock.get("http://localhost/test1.json", {
      throws: new Error("invalid call"),
    });

    let calledEvent: ExplorerEvent | null = null;
    const { result, waitFor, rerender } = renderHook(() => {
      const eventHandler = useValueRef((event: ExplorerEvent) => {
        calledEvent = event;
      });

      const parentFolder = {
        ...initialExplorerState.rootFolder,
      };

      return {
        eventHandler,
        sync: useSync({
          description: "",
          eventHandler,
          id: "id-1",
          initialSyncUrl: "",
          items: {},
          name: "syncFolder",
          parentFolder: parentFolder,
          path: "/syncFolder",
          syncUrl: "http://localhost/test1.json",
          type: ExplorerItemType.Folder,
        }),
      };
    });

    await act(async () => {
      const [, setSyncState] = result.current.sync;

      rerender();
      setSyncState({
        addSync: false,
        state: SyncState.Started,
        syncUrl: "http://localhost/test1.json",
      });

      rerender();
      await waitFor(() => result.current.sync[0].state === SyncState.Failed);
    });

    expect(calledEvent).toEqual({
      type: ExplorerEventType.ErrorOccured,
      payload: {
        reason: "invalid call",
        title: "Sync failed",
      },
    });

    fetchMock.restore();
  });
});
