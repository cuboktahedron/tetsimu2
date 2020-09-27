import { createStyles, makeStyles } from "@material-ui/core";
import {
  blue,
  green,
  lightBlue,
  orange,
  purple,
  red,
  yellow,
} from "@material-ui/core/colors";
import React from "react";
import { Tetromino } from "types/core";

type BlockProps = {
  type: Tetromino;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: (props: BlockProps): string => {
        switch (props.type) {
          case Tetromino.NONE:
            return "transparent";
          case Tetromino.I:
            return lightBlue.A100;
          case Tetromino.J:
            return blue.A100;
          case Tetromino.L:
            return orange.A100;
          case Tetromino.O:
            return yellow.A100;
          case Tetromino.S:
            return green.A100;
          case Tetromino.T:
            return purple.A100;
          case Tetromino.Z:
            return red.A100;
          default:
            throw new Error(
              `Specified invalid field tetromino value(${props.type})`
            );
        }
      },
      height: "100%",
      width: "100%",
    },
  })
);

const Block: React.FC<BlockProps> = (props) => {
  const classes = useStyles(props);

  return <div className={classes.root}>&nbsp;</div>;
};

export default Block;
