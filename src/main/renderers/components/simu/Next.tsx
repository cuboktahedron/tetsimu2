import { createStyles, makeStyles } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import clsx from "clsx";
import React from "react";
import { Tetromino } from "types/core";
import TetrominoBlocks from "../core/TetrominoBlocks";

type NextProps = {
  attack: number;
  inOffsetRange: boolean;
  type: Tetromino;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "black",
      height: "100%",
      width: "100%",
    },

    attack: {
      borderRadius: "50%",
      fontWeight: "bold",
      height: 24,
      lineHeight: "24px",
      position: "absolute",
      right: 0,
      textAlign: "center",
      top: 0,
      width: 24,
    },

    inOffsetRange: {
      background: red[700],
      color: "white",
    },

    outOffsetRange: {
      background: "white",
      color: "black",
    },
  })
);

const Next: React.FC<NextProps> = (props) => {
  const classes = useStyles();

  const attack =
    props.attack > 0 ? (
      <div
        className={clsx(classes.attack, {
          [classes.inOffsetRange]: props.inOffsetRange,
          [classes.outOffsetRange]: !props.inOffsetRange,
        })}
      >
        {props.attack}
      </div>
    ) : (
      ""
    );
  return (
    <div className={classes.root}>
      {attack}
      <TetrominoBlocks type={props.type}></TetrominoBlocks>
    </div>
  );
};

export default Next;
