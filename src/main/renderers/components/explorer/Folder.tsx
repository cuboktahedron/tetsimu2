import { createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
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

const Folder: React.FC<FolderProps> = (props) => {
  const [opensEditForm, setOpensEditForm] = React.useState(false);
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

  return (
    <div>
      <TreeItem
        className="ignore-hotkey"
        nodeId={props.id}
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
