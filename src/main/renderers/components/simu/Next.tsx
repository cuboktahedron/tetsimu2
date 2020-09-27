import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { Tetromino } from "types/core";
import TetrominoBlocks from "../core/TetrominoBlocks";

type NextProps = {
  type: Tetromino;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "black",
      divShadow: "0 0 0 1px grey",
      height: "100%",
      width: "100%",
    },
  })
);

const Next: React.FC<NextProps> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TetrominoBlocks type={props.type}></TetrominoBlocks>
    </div>
  );
};

export default Next;
