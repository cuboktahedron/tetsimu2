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
import clsx from "clsx";
import React from "react";
import { Tetromino } from "types/core";

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

    blockRoot: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center",
      width: "100%",
    },

    innerBlockRoot: {
      display: "flex",
      height: "100%",
      justifyContent: "center",
      width: "100%",

      "&.type-i": {
        height: "50%",
      },
    },

    block: {
      background: (props: TetrominoBlocksProps): string => {
        switch (props.type) {
          case Tetromino.None:
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

      height: "66%",
      width: "33%",

      "&.type-i": {
        height: "100%",
        width: "25%",
      },
    },

    none: {
      background: "transparent",
      height: "66%",
      width: "33%",
    },
  })
);

const TetrominoBlocks: React.FC<TetrominoBlocksProps> = (props) => {
  const classes = useStyles(props);

  const blocks = (() => {
    switch (props.type) {
      case Tetromino.I: {
        return (
          <div className={classes.blockRoot}>
            <div className={clsx(classes.innerBlockRoot, "type-i")}>
              <div className={clsx(classes.block, "type-i")}></div>
              <div className={clsx(classes.block, "type-i")}></div>
              <div className={clsx(classes.block, "type-i")}></div>
              <div className={clsx(classes.block, "type-i")}></div>
            </div>
          </div>
        );
      }
      case Tetromino.J: {
        return (
          <div className={classes.blockRoot}>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-end" }}
            >
              <div className={classes.block}></div>
              <div className={classes.none}></div>
              <div className={classes.none}></div>
            </div>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-start" }}
            >
              <div className={classes.block}></div>
              <div className={classes.block}></div>
              <div className={classes.block}></div>
            </div>
          </div>
        );
      }
      case Tetromino.L: {
        return (
          <div className={classes.blockRoot}>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-end" }}
            >
              <div className={classes.none}></div>
              <div className={classes.none}></div>
              <div className={classes.block}></div>
            </div>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-start" }}
            >
              <div className={classes.block}></div>
              <div className={classes.block}></div>
              <div className={classes.block}></div>
            </div>
          </div>
        );
      }
      case Tetromino.O: {
        return (
          <div className={classes.blockRoot}>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-end" }}
            >
              <div className={classes.block}></div>
              <div className={classes.block}></div>
            </div>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-start" }}
            >
              <div className={classes.block}></div>
              <div className={classes.block}></div>
            </div>
          </div>
        );
      }
      case Tetromino.S: {
        return (
          <div className={classes.blockRoot}>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-end" }}
            >
              <div className={classes.none}></div>
              <div className={classes.block}></div>
              <div className={classes.block}></div>
            </div>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-start" }}
            >
              <div className={classes.block}></div>
              <div className={classes.block}></div>
              <div className={classes.none}></div>
            </div>
          </div>
        );
      }
      case Tetromino.T: {
        return (
          <div className={classes.blockRoot}>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-end" }}
            >
              <div className={classes.none}></div>
              <div className={classes.block}></div>
              <div className={classes.none}></div>
            </div>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-start" }}
            >
              <div className={classes.block}></div>
              <div className={classes.block}></div>
              <div className={classes.block}></div>
            </div>
          </div>
        );
      }
      case Tetromino.Z: {
        return (
          <div className={classes.blockRoot}>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-end" }}
            >
              <div className={classes.block}></div>
              <div className={classes.block}></div>
              <div className={classes.none}></div>
            </div>
            <div
              className={classes.innerBlockRoot}
              style={{ alignItems: "flex-start" }}
            >
              <div className={classes.none}></div>
              <div className={classes.block}></div>
              <div className={classes.block}></div>
            </div>
          </div>
        );
      }
      default:
        return <div />;
    }
  })();

  return <div className={classes.root}>{blocks}</div>;
};

export default TetrominoBlocks;
