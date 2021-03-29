import { createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import GetAppIcon from "@material-ui/icons/GetApp";
import SyncIcon from "@material-ui/icons/Sync";
import { TreeItem } from "@material-ui/lab";
import React from "react";
import { ExplorerItemFile } from "stores/ExplorerState";

export type FileProps = {} & ExplorerItemFile;

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
  // const { state, dispatch } = React.useContext(ExplorerContext);

  // const handleItemClick = () => {
  //   dispatch(
  //     initializeApp(
  //       "ns=Ud515amsfR1ifOnap0RfunuReNc60Tp5eVnN.jVOfil7K3irxZ0q.irPmAA_&ss=AJABQABAACAQG8EBtBAXwQLkECVAKoA1ADEAOsBEQEAAVoBGAGEAHMAnQC5AQAA8QFaAO0AcwBhANQAlQBxAP8AvADhARMAxAFaAHMA1ABoAS4AnQDAALcBHwF5AOsAcwCqAF8A7QC5AL0A1AEhARABRAEsAaUEEnAWkAcwDtAHMAJABhAG8AUADEAJMECqALwBFQEcBA4QFnANQBdwBzAMEA5QEZATgAgQB4AR8BcQDUAHMA5ADJAR8ATACqARgA1AE.AHMAewQHwEBzPA_&m=1&v=2.01",
  //       state
  //     )
  //   );
  // };

  const classes = useStyles();

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
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      }
    />
  );
};

export default File;
