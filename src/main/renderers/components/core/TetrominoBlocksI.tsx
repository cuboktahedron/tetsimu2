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
      height: "50%",
      width: "100%",
    },

    block: {
      height: "100%",
      width: "25%",
    },
  })
);

const TetrominoBlocksI: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.innerRoot}>
        <div className={classes.block}>
          <Block type={Tetromino.I}></Block>
        </div>
        <div className={classes.block}>
          <Block type={Tetromino.I}></Block>
        </div>
        <div className={classes.block}>
          <Block type={Tetromino.I}></Block>
        </div>
        <div className={classes.block}>
          <Block type={Tetromino.I}></Block>
        </div>
      </div>
    </div>
  );
};

export default TetrominoBlocksI;
