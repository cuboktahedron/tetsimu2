import { createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import GetAppIcon from "@material-ui/icons/GetApp";
import SyncIcon from "@material-ui/icons/Sync";
import { TreeItem } from "@material-ui/lab";
import React from "react";
import { ExplorerItemFile } from "stores/ExplorerState";
import {
  ExplorerEventHandler,
  ExplorerEventType
} from "utils/tetsimu/explorer/explorerEvent";

export type FileProps = {
  path: string;
  eventHandler: ExplorerEventHandler;
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
  const classes = useStyles();

  const handleRemoveFileClick = () => {
    props.eventHandler({
      type: ExplorerEventType.FileRemove,
      payload: {
        pathToDelete: props.path,
      },
    });
  };

  return (
    <TreeItem
      className="ignore-hotkey"
      nodeId={props.id}
      label={
        <div className={classes.labelRoot} onClick={(e) => e.preventDefault()}>
          {props.name}
          <div style={{ marginLeft: "auto" }}>
            <IconButton>
              <EditIcon />
            </IconButton>
            <IconButton>
              <GetAppIcon />
            </IconButton>
            <IconButton>
              <SyncIcon />
            </IconButton>
            <IconButton onClick={handleRemoveFileClick}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      }
    />
  );
};

export default File;
