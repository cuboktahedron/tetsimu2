import {
  createStyles,
  IconButton,
  makeStyles,
  Menu,
  Theme
} from "@material-ui/core";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import SyncIcon from "@material-ui/icons/Sync";
import { TreeItem, TreeItemProps } from "@material-ui/lab";
import { getOrderedItems } from "ducks/explorer/selectors";
import React from "react";
import { ExplorerItemFolder, ExplorerItemType } from "stores/ExplorerState";
import {
  ExplorerEvent,
  ExplorerEventType
} from "utils/tetsimu/explorer/explorerEvent";
import { fetchExplorerItemFolder } from "utils/tetsimu/explorer/fetchUtils";
import { validateSyncedData } from "utils/tetsimu/explorer/validator";
import AddSyncForm from "./AddSyncForm";
import EditFolderForm from "./EditFolderForm";
import File from "./File";

export type FolderProps = {
  eventHandler: React.MutableRefObject<(event: ExplorerEvent) => void>;
  parentFolder: ExplorerItemFolder;
  path: string;
} & ExplorerItemFolder &
  TreeItemProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    folder: {
      "&.MuiTreeItem-root.Mui-selected": {
        "& > .MuiTreeItem-content": {
          "& $menuIcon": {
            visibility: "visible",
          },
        },
      },

      "&.MuiTreeItem-root:focus": {
        "& > .MuiTreeItem-content": {
          "& $menuIcon": {
            visibility: "visible",
          },
        },
      },

      "&.MuiTreeItem-root": {
        "& > .MuiTreeItem-content:hover": {
          "& $menuIcon": {
            visibility: "visible",
          },
        },
      },
    },

    labelRoot: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0.5, 0),

      "& .MuiIconButton-root": {
        padding: theme.spacing(0.5),
      },
    },

    menuIcon: {
      visibility: "hidden",
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
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  const [syncState, setSyncState] = React.useState<SyncStateWith>({
    addSync: false,
    state: SyncState.Ready,
  });

  const {
    path,
    eventHandler: eventHandler,
    parentFolder,
    ...thisFolder
  } = props;

  const items = React.useMemo(() => {
    const itemsInFolder = getOrderedItems(props.items);
    return itemsInFolder.map((item) => {
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
  }, [props.items]);

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Delete") {
      removeFolder();
      e.preventDefault();
    } else if (e.key === "F2") {
      openEditForm();
      e.preventDefault();
    }

    if (e.shiftKey) {
      if (e.key === "F") {
        addFolder();
        e.preventDefault();
      } else if (e.key === "N") {
        addFile();
        e.preventDefault();
      }
    }
  };

  const handleEditClick = () => {
    openEditForm();
  };

  const openEditForm = () => {
    setOpensEditForm(true);
  };

  const handleAddFolderClick = React.useCallback(() => {
    addFolder();
  }, []);

  const addFolder = React.useCallback(() => {
    props.eventHandler.current({
      type: ExplorerEventType.FolderAdd,
      payload: {
        newFolderName: "NewFolder",
        dest: props.path,
      },
    });
  }, []);

  const handleRemoveFolderClick = React.useCallback(() => {
    removeFolder();
  }, []);

  const removeFolder = React.useCallback(() => {
    props.eventHandler.current({
      type: ExplorerEventType.FolderRemove,
      payload: {
        pathToDelete: props.path,
      },
    });
  }, []);

  const handleAddFileClick = React.useCallback(() => {
    addFile();
  }, []);

  const addFile = React.useCallback(() => {
    props.eventHandler.current({
      type: ExplorerEventType.FileAdd,
      payload: {
        dest: props.path,
        newFileName: "NewFile",
      },
    });
  }, []);

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

    props.eventHandler.current({
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
          title: "Sync failed",
        },
      });
    }
  }, [syncState]);

  const handleOpenMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <TreeItem
        className={`${classes.folder} ignore-hotkey`}
        nodeId={props.nodeId}
        label={
          <div
            className={classes.labelRoot}
            onClick={(e) => e.preventDefault()}
          >
            <div>{props.name}</div>
            <div style={{ marginLeft: "auto" }}>
              <IconButton
                className={classes.menuIcon}
                onClick={handleOpenMenuClick}
              >
                <MoreHorizIcon />
              </IconButton>
            </div>
          </div>
        }
        onKeyDown={handleItemKeyDown}
      >
        {items}
      </TreeItem>
      <FolderMenu
        anchorEl={menuAnchorEl}
        syncState={syncState.state}
        syncUrl={props.syncUrl}
        onAddFileClick={handleAddFileClick}
        onEditClick={handleEditClick}
        onAddFolderClick={handleAddFolderClick}
        onAddSyncClick={handleAddSyncClick}
        onRemoveFolderClick={handleRemoveFolderClick}
        onSyncClick={handleSyncClick}
        onClose={() => setMenuAnchorEl(null)}
      />

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

type FolderMenuProps = {
  anchorEl: Element | null;
  syncState: SyncState;
  syncUrl: string;
  onAddFileClick: () => void;
  onAddFolderClick: () => void;
  onAddSyncClick: () => void;
  onEditClick: () => void;
  onRemoveFolderClick: () => void;
  onSyncClick: () => void;
  onClose: () => void;
};

const FolderMenu = React.memo<FolderMenuProps>((props) => {
  const handleMenuClick = (handler: () => void) => {
    return () => {
      handler();
      props.onClose();
    };
  };

  return (
    <Menu
      anchorEl={props.anchorEl}
      open={Boolean(props.anchorEl)}
      onClose={props.onClose}
    >
      <div>
        <IconButton onClick={handleMenuClick(props.onEditClick)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleMenuClick(props.onAddFolderClick)}>
          <CreateNewFolderIcon />
        </IconButton>
        <IconButton onClick={handleMenuClick(props.onAddFileClick)}>
          <NoteAddIcon />
        </IconButton>
      </div>
      <div>
        <IconButton onClick={handleMenuClick(props.onAddSyncClick)}>
          <PlaylistAddIcon />
        </IconButton>
        <IconButton
          onClick={handleMenuClick(props.onSyncClick)}
          disabled={!props.syncUrl || props.syncState !== SyncState.Ready}
        >
          <SyncIcon />
        </IconButton>
        <IconButton onClick={handleMenuClick(props.onRemoveFolderClick)}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Menu>
  );
});

export default Folder;
