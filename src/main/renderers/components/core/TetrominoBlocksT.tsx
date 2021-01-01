import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import Block from "./Block";
import { Tetromino } from "types/core";

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

const TetrominoBlocksT: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.innerRoot} style={{ alignItems: "flex-end" }}>
        <div className={classes.block}>
          <Block type={Tetromino.None}></Block>
        </div>
        <div className={classes.block}>
          <Block type={Tetromino.T}></Block>
        </div>
        <div className={classes.block}>
          <Block type={Tetromino.None}></Block>
        </div>
      </div>
      <div className={classes.innerRoot} style={{ alignItems: "flex-start" }}>
        <div className={classes.block}>
          <Block type={Tetromino.T}></Block>
        </div>
        <div className={classes.block}>
          <Block type={Tetromino.T}></Block>
        </div>
        <div className={classes.block}>
          <Block type={Tetromino.T}></Block>
        </div>
      </div>
    </div>
  );
};

export default TetrominoBlocksT;
