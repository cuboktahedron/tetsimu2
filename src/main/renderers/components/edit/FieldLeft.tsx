import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { RootContext } from "../App";
import Hold from "./Hold";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: "100%",
      width: 160,
    },

    hold: {
      border: "solid 4px grey",
      boxSizing: "border-box",
      height: 96,
      margin: "0 0 0 auto",
      width: 96,
    },
  })
);

const FieldLeft: React.FC = () => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.edit;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.hold}>
        <Hold
          dispatch={dispatch}
          hold={state.hold}
          selectedCellValues={state.tools.selectedCellValues}
        />
      </div>
    </div>
  );
};

export default FieldLeft;
