import { createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import SyncIcon from "@material-ui/icons/Sync";
import { TreeItem } from "@material-ui/lab";
import { getOrderedItems } from "ducks/explorer/selectors";
import React from "react";
import { ExplorerItemFolder, ExplorerItemType } from "stores/ExplorerState";
import {
  ExplorerEventHandler,
  ExplorerEventType
} from "utils/tetsimu/explorer/explorerEvent";
import EditFolderForm from "./EditFolderForm";
import File from "./File";

export type FolderProps = {
  eventHandler: ExplorerEventHandler;
  parentFolder: ExplorerItemFolder;
  path: string;
} & ExplorerItemFolder;

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

type SyncStateWith =
  | {
      state: typeof SyncState.Ready;
    }
  | {
      state: typeof SyncState.Started;
    }
  | {
      state: typeof SyncState.Suceeded;
      folder: ExplorerItemFolder;
    }
  | {
      state: typeof SyncState.Failed;
      reason: string;
    };

const Folder: React.FC<FolderProps> = (props) => {
  const [opensEditForm, setOpensEditForm] = React.useState(false);
  const classes = useStyles();
  const [syncState, setSyncState] = React.useState<SyncStateWith>({
    state: SyncState.Ready,
  });

  const itemsInFolder = getOrderedItems(props.items);
  const { path, eventHandler, parentFolder, ...thisFolder } = props;

  const items = itemsInFolder.map((item) => {
    if (item.type === ExplorerItemType.Folder) {
      return (
        <Folder
          key={item.id}
          {...item}
          parentFolder={thisFolder}
          path={`${props.path}/${item.name}`}
          eventHandler={props.eventHandler}
        />
      );
    } else if (item.type === ExplorerItemType.File) {
      return (
        <File
          key={item.id}
          {...item}
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

  const handleEditClose = () => {
    setOpensEditForm(false);
  };

  const handleEditSave = (folder: ExplorerItemFolder) => {
    props.eventHandler({
      type: ExplorerEventType.FolderSave,
      payload: {
        folder,
        pathToSave: props.path,
      },
    });
    setOpensEditForm(false);
  };

  const handleSyncClick = () => {
    setSyncState({ state: SyncState.Started });
  };

  React.useEffect(() => {
    let unmounted = false;

    if (syncState.state === SyncState.Ready) {
      return;
    }

    if (syncState.state === SyncState.Started) {
      (async () => {
        const response = await fetch(props.syncUrl);
        if (unmounted) {
          return;
        }

        if (response.ok) {
          const data = await response.json();
          // TODO: validate
          setSyncState({ state: SyncState.Suceeded, folder: data });
        } else {
          setSyncState({
            state: SyncState.Failed,
            reason: response.statusText,
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
      console.log(syncState);
      props.eventHandler({
        type: ExplorerEventType.FolderSync,
        payload: {
          folder: syncState.folder,
          pathToSync: props.path,
        },
      });
      setSyncState({ state: SyncState.Ready });
    }

    if (syncState.state === SyncState.Failed) {
      console.log(syncState);
      setSyncState({ state: SyncState.Ready });
    }
  }, [syncState]);

  const nodeId = `${props.path}/${props.id}`;
  return (
    <div>
      <TreeItem
        className="ignore-hotkey"
        nodeId={nodeId}
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
    </div>
  );
};

export default Folder;
