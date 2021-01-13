import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { ReplayContext } from "./Replay";
import { TetrominoShape } from "constants/tetromino";
import { Tetromino, Vector2, FieldCellValue, MAX_VISIBLE_FIELD_HEIGHT } from "types/core";
import {
  blue,
  orange,
  lightBlue,
  yellow,
  green,
  grey,
  purple,
  red,
} from "@material-ui/core/colors";
import { getUrgentAttack } from "ducks/replay/selectors";

const blockBackground = {
  [Tetromino.None]: "transparent",
  [Tetromino.I]: lightBlue.A100,
  [Tetromino.J]: blue.A100,
  [Tetromino.L]: orange.A100,
  [Tetromino.O]: yellow.A100,
  [Tetromino.S]: green.A100,
  [Tetromino.T]: purple.A100,
  [Tetromino.Z]: red.A100,
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: "100%",
      position: "absolute",
      userSelect: "none",
      width: "100%",
    },

    block: {
      height: (props: StyleProps) => 32 * props.zoom,
      position: "absolute",
      width: (props: StyleProps) => 32 * props.zoom,
      zIndex: 5,
    },

    ghost: {
      height: (props: StyleProps) => 32 * props.zoom,
      opacity: 0.4,
      position: "absolute",
      width: (props: StyleProps) => 32 * props.zoom,
      zIndex: 3,
    },

    pivot: {
      background: "black",
      borderRadius: "100%",
      boxSizing: "border-box",
      height: "20%",
      margin: "40%",
      width: "20%",
    },

    attackNotice: {
      background: "white",
      border: "solid 1px black",
      borderRadius: "50%",
      boxSizing: "border-box",
      fontWeight: "bold",
      height: 24,
      lineHeight: "24px",
      position: "absolute",
      top: 4,
      right: 4,
      textAlign: "center",
      width: 24,
      zIndex: 12,
    },
  })
);

type ActiveFieldProps = {};
type StyleProps = {
  zoom: number;
} & ActiveFieldProps;

const ActiveField: React.FC<ActiveFieldProps> = () => {
  const { state } = React.useContext(ReplayContext);
  const current = state.current;
  const isDead = state.isDead;
  const styleProps = { zoom: state.zoom };
  const classes = useStyles(styleProps);
  const maxRow = MAX_VISIBLE_FIELD_HEIGHT - 1;

  if (current.type === Tetromino.None) {
    return <div></div>;
  }

  const blocks = [...TetrominoShape[current.type][current.direction]];
  const currentBlocks = blocks.map((block: Vector2) => {
    const row = block.y + current.pos.y;
    const col = block.x + current.pos.x;
    const key = `${row}:${col}`;
    if (row > maxRow) {
      return <div key={key} />;
    }

    const top = 32 * state.zoom * (maxRow - row);
    const left = 32 * state.zoom * col;
    const isPivot =
      state.config.showsPivot &&
      block.x === blocks[0].x &&
      block.y === blocks[0].y;

    let background: string;
    if (isDead) {
      background = grey.A200;
    } else {
      background = blockBackground[current.type];
    }

    return (
      <div
        key={key}
        className={classes.block}
        style={{ background, left, top }}
      >
        {isPivot ? <div className={classes.pivot}></div> : " "}
      </div>
    );
  });

  // search ground row index for ghost
  let ghostRow = current.pos.y;
  for (; ghostRow >= 1; ghostRow--) {
    if (
      blocks.some((block: Vector2) => {
        const blockRow = block.y + ghostRow - 1;
        const blockCol = block.x + current.pos.x;
        return (
          blockRow < 0 ||
          state.field[blockRow][blockCol] !== FieldCellValue.None
        );
      })
    ) {
      break;
    }
  }

  const ghostBlocks = blocks.map((block: Vector2) => {
    const row = block.y + ghostRow;
    const col = block.x + current.pos.x;
    const key = `${row}:${col}`;
    if (row > maxRow) {
      return <div key={key} />;
    }

    const top = 32 * state.zoom * (maxRow - row);
    const left = 32 * state.zoom * col;

    return (
      <div
        key={key}
        className={classes.ghost}
        style={{ background: blockBackground[current.type], left, top }}
      />
    );
  });

  const attacks = getUrgentAttack(state);
  const attackNotice = (() => {
    if (!attacks) {
      return "";
    }

    return <div className={classes.attackNotice}>{attacks}</div>;
  })();

  return (
    <div className={classes.root}>
      <div>{attackNotice}</div>
      <div>{currentBlocks}</div>
      <div>{state.config.showsGhost ? ghostBlocks : ""}</div>
    </div>
  );
};

export default ActiveField;
