import {
  addFile,
  addFolder,
  removeFile,
  removeFolder,
  saveFile,
  saveFolder,
} from "ducks/explorer/actions";
import { error, initializeApp } from "ducks/root/actions";
import React from "react";
import { RootContext } from "renderers/components/App";
import {
  ExplorerEvent,
  ExplorerEventType,
} from "utils/tetsimu/explorer/explorerEvent";
import { UnsupportedUrlError } from "utils/tetsimu/unsupportedUrlError";

export const useExplorerEventHandler = () => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.explorer;

  return (event: ExplorerEvent) => {
    switch (event.type) {
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
    }
  };
};
