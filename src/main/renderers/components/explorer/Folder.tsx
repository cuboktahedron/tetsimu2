import { createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import SyncIcon from "@material-ui/icons/Sync";
import { TreeItem, TreeItemProps } from "@material-ui/lab";
import { getOrderedItems } from "ducks/explorer/selectors";
import React from "react";
import { ExplorerItemFolder, ExplorerItemType } from "stores/ExplorerState";
import {
  ExplorerEventHandler,
  ExplorerEventType,
} from "utils/tetsimu/explorer/explorerEvent";
import { fetchExplorerItemFolder } from "utils/tetsimu/explorer/fetchUtils";
import { validateSyncedData } from "utils/tetsimu/explorer/validator";
import AddSyncForm from "./AddSyncForm";
import EditFolderForm from "./EditFolderForm";
import File from "./File";

export type FolderProps = {
  eventHandler: ExplorerEventHandler;
  parentFolder: ExplorerItemFolder;
  path: string;
} & ExplorerItemFolder &
  TreeItemProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelRoot: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0.5, 0),

      "& .MuiIconButton-root": {
        padding: theme.spacing(0.5),
      },
    },
  })
);

const SyncState = {
  Ready: 0,
  Started: 1,
  Suceeded: 2,
  Failed: 3,
} as const;

type SyncState = typeof SyncState[keyof typeof SyncState];

type SyncStateWith = {
  addSync: boolean;
} & (
  | {
      state: typeof SyncState.Ready;
    }
  | {
      state: typeof SyncState.Started;
      syncUrl: string;
    }
  | {
      state: typeof SyncState.Suceeded;
      folder: ExplorerItemFolder;
    }
  | {
      state: typeof SyncState.Failed;
      reason: string;
    }
);

const Folder: React.FC<FolderProps> = (props) => {
  const [opensEditForm, setOpensEditForm] = React.useState(false);
  const [opensAddSyncForm, setOpensAddSyncForm] = React.useState(false);
  const classes = useStyles();
  const [syncState, setSyncState] = React.useState<SyncStateWith>({
    addSync: false,
    state: SyncState.Ready,
  });

  const itemsInFolder = getOrderedItems(props.items);
  const { path, eventHandler, parentFolder, ...thisFolder } = props;

  const items = itemsInFolder.map((item) => {
    if (item.type === ExplorerItemType.Folder) {
      return (
        <Folder
          {...item}
          key={item.id}
          nodeId={`${props.nodeId}/${item.id}`}
          parentFolder={thisFolder}
          path={`${props.path}/${item.name}`}
          eventHandler={props.eventHandler}
        />
      );
    } else if (item.type === ExplorerItemType.File) {
      return (
        <File
          {...item}
          key={item.id}
          nodeId={`${props.nodeId}/${item.id}`}
          parentFolder={thisFolder}
          path={`${props.path}/${item.name}`}
          eventHandler={props.eventHandler}
        />
      );
    } else {
      return "";
    }
  });

  const handleEditClick = () => {
    setOpensEditForm(true);
  };

  const handleAddFolderClick = () => {
    props.eventHandler({
      type: ExplorerEventType.FolderAdd,
      payload: {
        newFolderName: "NewFolder",
        dest: props.path,
      },
    });
  };

  const handleRemoveFolderClick = () => {
    props.eventHandler({
      type: ExplorerEventType.FolderRemove,
      payload: {
        pathToDelete: props.path,
      },
    });
  };

  const handleAddFileClick = () => {
    props.eventHandler({
      type: ExplorerEventType.FileAdd,
      payload: {
        dest: props.path,
        newFileName: "NewFile",
      },
    });
  };

  const handleAddSyncClick = () => {
    setOpensAddSyncForm(true);
  };

  const handleAddSyncClose = () => {
    setOpensAddSyncForm(false);
  };

  const handleAddSyncSync = (syncUrl: string) => {
    setOpensAddSyncForm(false);

    setSyncState({
      addSync: true,
      state: SyncState.Started,
      syncUrl,
    });
  };

  const handleEditClose = () => {
    setOpensEditForm(false);
  };

  const handleEditSave = (folder: ExplorerItemFolder) => {
    setOpensEditForm(false);

    props.eventHandler({
      type: ExplorerEventType.FolderSave,
      payload: {
        folder,
        pathToSave: props.path,
      },
    });
  };

  const handleSyncClick = () => {
    setSyncState({
      addSync: false,
      state: SyncState.Started,
      syncUrl: props.syncUrl,
    });
  };

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
        props.eventHandler({
          type: ExplorerEventType.SyncFolderAdd,
          payload: {
            dest: props.path,
            syncData: syncState.folder,
          },
        });
      } else {
        props.eventHandler({
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

      props.eventHandler({
        type: ExplorerEventType.ErrorOccured,
        payload: {
          reason: syncState.reason,
          title: "Sync failed",
        },
      });
    }
  }, [syncState]);

  return (
    <React.Fragment>
      <TreeItem
        className="ignore-hotkey"
        nodeId={props.nodeId}
        label={
          <div
            className={classes.labelRoot}
            onClick={(e) => e.preventDefault()}
          >
            <div>{props.name}</div>
            <div style={{ marginLeft: "auto" }}>
              <IconButton onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleAddFolderClick}>
                <CreateNewFolderIcon />
              </IconButton>
              <IconButton onClick={handleAddFileClick}>
                <NoteAddIcon />
              </IconButton>
              <IconButton onClick={handleAddSyncClick}>
                <PlaylistAddIcon />
              </IconButton>
              <IconButton
                onClick={handleSyncClick}
                disabled={!props.syncUrl || syncState.state !== SyncState.Ready}
              >
                <SyncIcon />
              </IconButton>
              <IconButton onClick={handleRemoveFolderClick}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        }
      >
        {items}
      </TreeItem>
      <EditFolderForm
        folder={thisFolder}
        parentFolder={parentFolder}
        open={opensEditForm}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
      <AddSyncForm
        open={opensAddSyncForm}
        onClose={handleAddSyncClose}
        onSync={handleAddSyncSync}
      />
    </React.Fragment>
  );
};

export default Folder;
