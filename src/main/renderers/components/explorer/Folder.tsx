import { createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
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

const Folder: React.FC<FolderProps> = (props) => {
  const classes = useStyles();

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

  return (
    <TreeItem
      className="ignore-hotkey"
      nodeId={props.id}
      label={
        <div className={classes.labelRoot} onClick={(e) => e.preventDefault()}>
          <div>{props.name}</div>
          <div style={{ marginLeft: "auto" }}>
            <IconButton onClick={handleAddFolderClick}>
              <CreateNewFolderIcon />
            </IconButton>
            <IconButton>
              <GetAppIcon />
            </IconButton>
            <IconButton>
              <SyncIcon />
            </IconButton>
            <IconButton onClick={handleAddFileClick}>
              <NoteAddIcon />
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
  );
};

export default Folder;
