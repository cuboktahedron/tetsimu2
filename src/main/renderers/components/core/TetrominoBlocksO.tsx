import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { Tetromino } from "types/core";
import Block from "./Block";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center",
      width: "100%",
    },

    innerRoot: {
      display: "flex",
      height: "100%",
      justifyContent: "center",
      width: "100%",
    },

    block: {
      height: "66%",
      width: "33%",
    },
  })
);

const TetrominoBlocksO: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.innerRoot} style={{ alignItems: "flex-end" }}>
        <div className={classes.block}>
          <Block type={Tetromino.O}></Block>
        </div>
        <div className={classes.block}>
          <Block type={Tetromino.O}></Block>
        </div>
      </div>
      <div className={classes.innerRoot} style={{ alignItems: "flex-start" }}>
        <div className={classes.block}>
          <Block type={Tetromino.O}></Block>
        </div>
        <div className={classes.block}>
          <Block type={Tetromino.O}></Block>
        </div>
      </div>
    </div>
  );
};

export default TetrominoBlocksO;
