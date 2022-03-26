import {
  IconButton,
  makeStyles,
  SvgIcon,
  SvgIconProps,
  Theme
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import PublishIcon from "@material-ui/icons/Publish";
import TreeView from "@material-ui/lab/TreeView";
import clsx from "clsx";
import { getOrderedItems } from "ducks/explorer/selectors";
import React from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useExplorerEventHandler } from "renderers/hooks/explorer/useExplorerEventHandler";
import { useSync } from "renderers/hooks/explorer/useSync";
import { useValueRef } from "renderers/hooks/useValueRef";
import { ExplorerItemFolder, ExplorerItemType } from "stores/ExplorerState";
import {
  DragItemData,
  DragItemTypes,
  ExplorerIds,
  SyncState
} from "types/explorer";
import { ExplorerEventType } from "utils/tetsimu/explorer/explorerEvent";
import {
  correctFileData,
  correctFolderData,
  isExplorerItemFile,
  isExplorerItemFolder
} from "utils/tetsimu/explorer/explorerItemFunctions";
import {
  validateLoadedFileData,
  validateLoadedFolderData
} from "utils/tetsimu/explorer/validator";
import { RootContext } from "../App";
import AddSyncForm from "./AddSyncForm";
import Folder, { FolderUniqueProps } from "./Folder";

const MinusSquare: React.FC = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
};

const PlusSquare: React.FC = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "none",
    height: "calc(100% - 64px)",
    overflowY: "auto",
    paddingBottom: 64,

    "& .MuiIconButton-root": {
      padding: theme.spacing(0.5),
    },
  },

  dropzone: {
    boxSizing: "border-box",
    height: "100%",

    "&.active": {
      border: `dashed 4px ${blue[700]}`,
    },
  },

  opens: {
    display: "block",
  },
}));

export type ExplorerProps = {
  opens: boolean;
};

const Explorer: React.FC<ExplorerProps> = (props) => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const [opensAddSyncForm, setOpensAddSyncForm] = React.useState(false);
  const { t } = useTranslation();

  const state = rootState.explorer;
  const classes = useStyles();
  const eventHandler = useValueRef(
    useExplorerEventHandler(rootState, dispatch)
  );

  const dummyParentFolder = {};
  const [, setSyncState] = useSync({
    ...state.rootFolder,
    eventHandler: eventHandler,
    parentFolder: dummyParentFolder as FolderUniqueProps,
    path: "/",
  });

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: [DragItemTypes.Folder, DragItemTypes.File],
      canDrop: (item: DragItemData, monitor) => canDropItem(item, monitor),
      drop: (item: DragItemData, monitor) => {
        if (monitor.didDrop()) {
          return;
        }

        eventHandler.current({
          type: ExplorerEventType.ItemMove,
          payload: {
            from: item.path,
            itemType: item.type,
            to: "/",
          },
        });
      },

      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [state.rootFolder.items]
  );

  const canDropItem = (
    dragItem: DragItemData,
    monitor: DropTargetMonitor<unknown, unknown>
  ): boolean => {
    if (!monitor.isOver({ shallow: true })) {
      return false;
    }

    if (dragItem.type !== ExplorerItemType.Folder) {
      return false;
    }

    if (
      Object.values(state.rootFolder.items).some(
        (item) => item.id === dragItem.id || item.name === dragItem.name
      )
    ) {
      return false;
    }

    return true;
  };

  const { acceptedFiles, isDragActive, getRootProps, getInputProps, inputRef } =
    useDropzone({
      maxFiles: 1,
      noClick: true,
      noKeyboard: true,
    });

  const [loadFile, setLoadFile] = React.useState<File | null>(null);
  React.useEffect(() => {
    if (acceptedFiles.length > 0) {
      setLoadFile(acceptedFiles[0]);
    } else {
      setLoadFile(null);
    }
  }, [acceptedFiles]);

  React.useEffect(() => {
    if (loadFile === null) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      const textData = fileReader.result as string;
      try {
        const droppedData = JSON.parse(textData);
        const tempFolder = state.rootFolder.items[
          ExplorerIds.TempFolder
        ] as ExplorerItemFolder;

        if (isExplorerItemFolder(droppedData)) {
          correctFolderData(droppedData);
          const validateResult = validateLoadedFolderData(
            tempFolder,
            droppedData
          );

          if (validateResult.isValid) {
            eventHandler.current({
              type: ExplorerEventType.FolderMerge,
              payload: {
                data: droppedData,
                to: `/${tempFolder.name}`,
              },
            });
          } else {
            eventHandler.current({
              type: ExplorerEventType.ErrorOccured,
              payload: {
                reason: validateResult.errorMessage,
                title: "Load error",
              },
            });
          }
        } else if (isExplorerItemFile(droppedData)) {
          correctFileData(droppedData);
          const validateResult = validateLoadedFileData(
            tempFolder,
            droppedData
          );

          if (validateResult.isValid) {
            eventHandler.current({
              type: ExplorerEventType.FileMerge,
              payload: {
                data: droppedData,
                to: `/${tempFolder.name}`,
              },
            });
          } else {
            eventHandler.current({
              type: ExplorerEventType.ErrorOccured,
              payload: {
                reason: validateResult.errorMessage,
                title: t("Explorer.LoadError"),
              },
            });
          }
        } else {
          eventHandler.current({
            type: ExplorerEventType.ErrorOccured,
            payload: {
              reason: t("Explorer.Message.InvalidFileFormat"),
              title: t("Explorer.LoadError"),
            },
          });
        }
      } catch (error) {
        eventHandler.current({
          type: ExplorerEventType.ErrorOccured,
          payload: {
            reason: (error as Error)?.message,
            title: t("Explorer.LoadError"),
          },
        });
      }
    });
    fileReader.readAsText(loadFile);
  }, [loadFile]);

  const handleNewFolderClick = () => {
    eventHandler.current({
      type: ExplorerEventType.FolderAdd,
      payload: {
        newFolderName: t("Explorer.NewFolder"),
        dest: "/",
      },
    });
  };

  const handleAddSyncClick = () => {
    setOpensAddSyncForm(true);
  };

  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
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

  const rootFolders = React.useMemo(() => {
    const rootItems = getOrderedItems(state.rootFolder.items);
    return rootItems.map((root) => {
      if (root.type === ExplorerItemType.Folder) {
        return (
          <Folder
            {...root}
            initialSyncUrl={
              root.id === ExplorerIds.TempFolder ? state.initialSyncUrl : ""
            }
            key={root.id}
            nodeId={`/${root.id}`}
            parentFolder={state.rootFolder}
            path={`/${root.name}`}
            eventHandler={eventHandler}
          />
        );
      } else {
        return "";
      }
    });
  }, [state.rootFolder.items]);

  const treeView = React.useMemo(() => {
    return (
      <TreeView
        className="ignore-hotkey"
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
      >
        {rootFolders}
      </TreeView>
    );
  }, [rootFolders]);

  return (
    <div
      ref={drop}
      className={clsx(classes.root, {
        [classes.opens]: props.opens,
      })}
    >
      <div
        {...getRootProps({
          className: clsx(classes.dropzone, {
            active: isDragActive,
          }),
        })}
      >
        <input {...getInputProps()} />
        <div>
          <IconButton onClick={handleNewFolderClick}>
            <CreateNewFolderIcon />
          </IconButton>
          <IconButton onClick={handleAddSyncClick}>
            <PlaylistAddIcon />
          </IconButton>
          <IconButton onClick={handleUploadClick}>
            <PublishIcon />
          </IconButton>
        </div>
        <div style={isOver && canDrop ? { background: `${blue[700]}40` } : {}}>
          {treeView}
        </div>
        <AddSyncForm
          open={opensAddSyncForm}
          onClose={handleAddSyncClose}
          onSync={handleAddSyncSync}
        />
      </div>
    </div>
  );
};

export default Explorer;
