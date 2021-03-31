import {
  addFile,
  addFolder,
  removeFile,
  removeFolder
} from "ducks/explorer/actions";
import React from "react";
import { RootContext } from "renderers/components/App";
import {
  ExplorerEvent,
  ExplorerEventType
} from "utils/tetsimu/explorer/explorerEvent";

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
      case ExplorerEventType.FileRemove: {
        dispatch(removeFile(event.payload.pathToDelete, state.rootFolder));
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
    }
  };
};
