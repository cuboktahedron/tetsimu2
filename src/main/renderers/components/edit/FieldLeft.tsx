import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
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
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.hold}>
        <Hold />
      </div>
    </div>
  );
};

export default FieldLeft;
