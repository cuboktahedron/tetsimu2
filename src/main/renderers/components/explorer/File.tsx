import { createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { TreeItem, TreeItemProps } from "@material-ui/lab";
import React from "react";
import { ExplorerItemFile, ExplorerItemFolder } from "stores/ExplorerState";
import {
  ExplorerEvent,
  ExplorerEventType
} from "utils/tetsimu/explorer/explorerEvent";
import EditFileForm from "./EditFileForm";

export type FileProps = {
  eventHandler: React.MutableRefObject<(event: ExplorerEvent) => void>;
  parentFolder: ExplorerItemFolder;
  path: string;
} & ExplorerItemFile &
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

const File: React.FC<FileProps> = (props) => {
  const [opensEditForm, setOpensEditForm] = React.useState(false);
  const classes = useStyles();

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setOpensEditForm(true);
  };

  const handleRemoveFileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    props.eventHandler.current({
      type: ExplorerEventType.FileRemove,
      payload: {
        pathToDelete: props.path,
      },
    });

    return false;
  };

  const handleEditClose = () => {
    setOpensEditForm(false);
  };

  const handleEditSave = (file: ExplorerItemFile) => {
    props.eventHandler.current({
      type: ExplorerEventType.FileSave,
      payload: {
        file,
        pathToSave: props.path,
      },
    });
    setOpensEditForm(false);
  };

  const handleItemClick = () => {
    if (props.parameters) {
      props.eventHandler.current({
        type: ExplorerEventType.FileLoad,
        payload: {
          parameters: props.parameters,
        },
      });
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Enter" && props.parameters) {
      props.eventHandler.current({
        type: ExplorerEventType.FileLoad,
        payload: {
          parameters: props.parameters,
        },
      });
    }
  };

  const { path, eventHandler: eventHandler, parentFolder, ...file } = props;
  return (
    <React.Fragment>
      <TreeItem
        className="ignore-hotkey"
        nodeId={props.nodeId}
        label={
          <div className={classes.labelRoot} onClick={handleItemClick}>
            {props.name}
            <div style={{ marginLeft: "auto" }}>
              <IconButton onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleRemoveFileClick}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        }
        onKeyDown={handleItemKeyDown}
      />
      <EditFileForm
        file={file}
        parentFolder={parentFolder}
        open={opensEditForm}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </React.Fragment>
  );
};

export default File;
