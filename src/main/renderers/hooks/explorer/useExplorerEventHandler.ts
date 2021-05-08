import {
  addFile,
  addFolder,
  addSyncFolder,
  mergeFile,
  mergeFolder,
  moveItem,
  removeFile,
  removeFolder,
  saveFile,
  saveFolder,
  syncFolder
} from "ducks/explorer/actions";
import { error, initializeApp } from "ducks/root/actions";
import { RootState } from "stores/RootState";
import {
  ExplorerEvent,
  ExplorerEventType
} from "utils/tetsimu/explorer/explorerEvent";
import { UnsupportedUrlError } from "utils/tetsimu/unsupportedUrlError";

export const useExplorerEventHandler = (
  rootState: RootState,
  dispatch: any
) => {
  const state = rootState.explorer;

  return (event: ExplorerEvent) => {
    switch (event.type) {
      case ExplorerEventType.ErrorOccured: {
        dispatch(error(event.payload.title, event.payload.reason));
        break;
      }
      case ExplorerEventType.FileAdd: {
        dispatch(
          addFile(
            event.payload.newFileName,
            event.payload.dest,
            state.rootFolder
          )
        );
        break;
      }
      case ExplorerEventType.FileLoad: {
        try {
          dispatch(initializeApp(event.payload.parameters, rootState));
        } catch (e) {
          if (e instanceof UnsupportedUrlError) {
            dispatch(error("Load file failed", e.message));
          } else {
            dispatch(
              error(
                "Load file failed",
                "This is maybe invalid url parameters passed."
              )
            );
          }
        }
        break;
      }
      case ExplorerEventType.FileMerge: {
        dispatch(
          mergeFile(event.payload.data, event.payload.to, state.rootFolder)
        );
        break;
      }
      case ExplorerEventType.FileRemove: {
        dispatch(removeFile(event.payload.pathToDelete, state.rootFolder));
        break;
      }
      case ExplorerEventType.FileSave: {
        dispatch(
          saveFile(
            event.payload.pathToSave,
            event.payload.file,
            state.rootFolder
          )
        );
        break;
      }
      case ExplorerEventType.FolderAdd: {
        dispatch(
          addFolder(
            event.payload.newFolderName,
            event.payload.dest,
            state.rootFolder
          )
        );
        break;
      }
      case ExplorerEventType.FolderMerge: {
        dispatch(
          mergeFolder(event.payload.data, event.payload.to, state.rootFolder)
        );
        break;
      }
      case ExplorerEventType.FolderRemove: {
        dispatch(removeFolder(event.payload.pathToDelete, state.rootFolder));
        break;
      }
      case ExplorerEventType.FolderSave: {
        dispatch(
          saveFolder(
            event.payload.pathToSave,
            event.payload.folder,
            state.rootFolder
          )
        );
        break;
      }
      case ExplorerEventType.FolderSync: {
        dispatch(
          syncFolder(
            event.payload.pathToSync,
            event.payload.syncData,
            state.rootFolder
          )
        );
        break;
      }
      case ExplorerEventType.ItemMove: {
        dispatch(
          moveItem(
            event.payload.itemType,
            event.payload.from,
            event.payload.to,
            state.rootFolder
          )
        );
        break;
      }
      case ExplorerEventType.SyncFolderAdd: {
        dispatch(
          addSyncFolder(
            event.payload.dest,
            event.payload.syncData,
            state.rootFolder
          )
        );
        break;
      }
    }
  };
};
