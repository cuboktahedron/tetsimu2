import { createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { TreeItem } from "@material-ui/lab";
import React from "react";
import { ExplorerItemFile, ExplorerItemFolder } from "stores/ExplorerState";
import {
  ExplorerEventHandler,
  ExplorerEventType
} from "utils/tetsimu/explorer/explorerEvent";
import EditFileForm from "./EditFileForm";

export type FileProps = {
  eventHandler: ExplorerEventHandler;
  parentFolder: ExplorerItemFolder;
  path: string;
} & ExplorerItemFile;

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

    props.eventHandler({
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
    props.eventHandler({
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
      props.eventHandler({
        type: ExplorerEventType.FileLoad,
        payload: {
          parameters: props.parameters,
        },
      });
    }
  };

  const { path, eventHandler, parentFolder, ...file } = props;
  return (
    <div>
      <TreeItem
        className="ignore-hotkey"
        nodeId={props.id}
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
      />
      <EditFileForm
        file={file}
        parentFolder={parentFolder}
        open={opensEditForm}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default File;
