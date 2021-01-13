import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { Tetromino } from "types/core";
import TetrominoBlocks from "../core/TetrominoBlocks";

type NextProps = {
  type: Tetromino;
  attack: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "black",
      height: "100%",
      width: "100%",
    },

    attack: {
      background: "white",
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
  })
);

const Next: React.FC<NextProps> = (props) => {
  const classes = useStyles();

  const attack =
    props.attack > 0 ? (
      <div className={classes.attack}>{props.attack}</div>
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
