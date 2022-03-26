import { t } from "i18next";
import React from "react";
import { FolderUniqueProps } from "renderers/components/explorer/Folder";
import { SyncState, SyncStateWith } from "types/explorer";
import { ExplorerEventType } from "utils/tetsimu/explorer/explorerEvent";
import { fetchExplorerItemFolder } from "utils/tetsimu/explorer/fetchUtils";
import { validateSyncedData } from "utils/tetsimu/explorer/validator";

export const useSync = (
  props: FolderUniqueProps
): [SyncStateWith, React.Dispatch<React.SetStateAction<SyncStateWith>>] => {
  const [syncState, setSyncState] = React.useState<SyncStateWith>({
    addSync: false,
    state: SyncState.Ready,
  });

  React.useEffect(() => {
    let unmounted = false;

    if (syncState.state === SyncState.Ready) {
      return;
    }

    const changeSyncState = (newSyncStateWith: SyncStateWith) => {
      if (unmounted) {
        return;
      }

      setSyncState(newSyncStateWith);
    };

    if (syncState.state === SyncState.Started) {
      (async () => {
        const fetchResult = await fetchExplorerItemFolder(syncState.syncUrl);
        if (fetchResult.succeeded) {
          const validateResult = validateSyncedData(
            syncState.addSync ? null : props,
            syncState.addSync ? props : props.parentFolder,
            fetchResult.data
          );
          if (validateResult.isValid) {
            changeSyncState({
              addSync: syncState.addSync,
              state: SyncState.Suceeded,
              folder: fetchResult.data,
            });
          } else {
            changeSyncState({
              addSync: syncState.addSync,
              state: SyncState.Failed,
              reason: validateResult.errorMessage,
            });
          }
        } else {
          changeSyncState({
            addSync: syncState.addSync,
            state: SyncState.Failed,
            reason: fetchResult.reason,
          });
        }
      })();
    }

    return () => {
      unmounted = true;
    };
  }, [syncState]);

  React.useEffect(() => {
    if (syncState.state === SyncState.Suceeded) {
      if (syncState.addSync) {
        props.eventHandler.current({
          type: ExplorerEventType.SyncFolderAdd,
          payload: {
            dest: props.path,
            syncData: syncState.folder,
          },
        });
      } else {
        props.eventHandler.current({
          type: ExplorerEventType.FolderSync,
          payload: {
            pathToSync: props.path,
            syncData: syncState.folder,
          },
        });
      }

      setSyncState({
        addSync: false,
        state: SyncState.Ready,
      });
    }

    if (syncState.state === SyncState.Failed) {
      setSyncState({
        addSync: false,
        state: SyncState.Ready,
      });

      props.eventHandler.current({
        type: ExplorerEventType.ErrorOccured,
        payload: {
          reason: syncState.reason,
          title: t("Explorer.SyncFailed"),
        },
      });
    }
  }, [syncState]);

  return [syncState, setSyncState];
};
