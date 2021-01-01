import { createStyles, makeStyles } from "@material-ui/core";
import { changeHold } from "ducks/edit/actions";
import React from "react";
import { FieldCellValue, MouseButton, Tetromino } from "types/core";
import TetrominoBlocks from "../core/TetrominoBlocks";
import { EditContext } from "./Edit";

type HoldProps = {};

type StyleProps = {
  type: Tetromino;
  canHold: boolean;
} & HoldProps;

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      cursor: "crosshair",
      height: "100%",
      width: "100%",
    },

    blocks: {
      background: (props: StyleProps) => (props.canHold ? "black" : "#800"),
      height: "100%",
      width: "100%",
    },
  })
);

const Hold: React.FC<HoldProps> = () => {
  const { state, dispatch } = React.useContext(EditContext);
  const hold = state.hold;

  const typeToSet = state.tools.selectedCellValues[0];
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === MouseButton.Left) {
      if (
        typeToSet === FieldCellValue.None ||
        typeToSet === FieldCellValue.Garbage
      ) {
        dispatch(changeHold(state.hold, Tetromino.None));
      } else {
        dispatch(changeHold(state.hold, typeToSet));
      }
    } else if (e.button === MouseButton.Right) {
      dispatch(changeHold(state.hold, Tetromino.None));
    }
  };

  const classes = useStyles(hold);
  return (
    <div
      className={classes.root}
      onMouseDown={handleMouseDown}
      onContextMenu={(e: React.MouseEvent) => {
        e.preventDefault();
      }}
    >
      <div className={classes.blocks}>
        <TetrominoBlocks type={hold.type}></TetrominoBlocks>
      </div>
    </div>
  );
};

export default Hold;
