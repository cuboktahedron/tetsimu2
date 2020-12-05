import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { Tetromino } from "types/core";
import TetrominoBlocks from "../core/TetrominoBlocks";

type NextProps = {
  type: Tetromino;
  attackedLine?: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "black",
      height: "100%",
      width: "100%",
    },

    attackedLine: {
      background: "white",
      border: "solid 1px white",
      borderRadius: "50%",
      fontWeight: "bold",
      height: 20,
      lineHeight: "20px",
      position: "absolute",
      right: 2,
      textAlign: "center",
      top: 2,
      width: 20,
    },
  })
);

const Next: React.FC<NextProps> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.attackedLine ? (
        <div className={classes.attackedLine}>{props.attackedLine}</div>
      ) : (
        ""
      )}
      <TetrominoBlocks type={props.type}></TetrominoBlocks>
    </div>
  );
};

export default Next;
