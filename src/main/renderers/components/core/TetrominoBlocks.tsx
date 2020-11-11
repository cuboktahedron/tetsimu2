import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { Tetromino } from "types/core";
import TetrominoBlocksI from "./TetrominoBlocksI";
import TetrominoBlocksJ from "./TetrominoBlocksJ";
import TetrominoBlocksL from "./TetrominoBlocksL";
import TetrominoBlocksO from "./TetrominoBlocksO";
import TetrominoBlocksS from "./TetrominoBlocksS";
import TetrominoBlocksT from "./TetrominoBlocksT";
import TetrominoBlocksZ from "./TetrominoBlocksZ";

type TetrominoBlocksProps = {
  type: Tetromino;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      boxSizing: "border-box",
      padding: "10%",
      height: "100%",
      width: "100%",
    },
  })
);

const TetrominoBlocks: React.FC<TetrominoBlocksProps> = (props) => {
  const classes = useStyles(props);

  let blocks;
  switch (props.type) {
    case Tetromino.I:
      blocks = <TetrominoBlocksI />;
      break;
    case Tetromino.J:
      blocks = <TetrominoBlocksJ />;
      break;
    case Tetromino.L:
      blocks = <TetrominoBlocksL />;
      break;
    case Tetromino.O:
      blocks = <TetrominoBlocksO />;
      break;
    case Tetromino.S:
      blocks = <TetrominoBlocksS />;
      break;
    case Tetromino.T:
      blocks = <TetrominoBlocksT />;
      break;
    case Tetromino.Z:
      blocks = <TetrominoBlocksZ />;
      break;
    default:
      blocks = <div />;
      break;
  }

  return <div className={classes.root}>{blocks}</div>;
};

export default TetrominoBlocks;
