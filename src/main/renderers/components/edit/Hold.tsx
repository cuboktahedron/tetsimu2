import { createStyles, makeStyles } from "@material-ui/core";
import { changeHold } from "ducks/edit/actions";
import React from "react";
import {
  Action,
  FieldCellValue,
  HoldState,
  MouseButton,
  Tetromino,
} from "types/core";
import TetrominoBlocks from "../core/TetrominoBlocks";

type HoldProps = {
  dispatch: React.Dispatch<Action>;
  hold: HoldState;
  selectedCellValues: FieldCellValue[];
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      cursor: "crosshair",
      height: "100%",
      width: "100%",
    },

    blocks: {
      background: (props: HoldProps) => (props.hold.canHold ? "black" : "#800"),
      height: "100%",
      width: "100%",
    },
  })
);

const Hold = React.memo<HoldProps>((props) => {
  const dispatch = props.dispatch;

  const typeToSet = props.selectedCellValues[0];
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === MouseButton.Left) {
      if (
        typeToSet === FieldCellValue.None ||
        typeToSet === FieldCellValue.Garbage
      ) {
        dispatch(changeHold(props.hold, Tetromino.None));
      } else {
        dispatch(changeHold(props.hold, typeToSet));
      }
    } else if (e.button === MouseButton.Right) {
      dispatch(changeHold(props.hold, Tetromino.None));
    }
  };

  const classes = useStyles(props);
  return (
    <div
      className={classes.root}
      onMouseDown={handleMouseDown}
      onContextMenu={(e: React.MouseEvent) => {
        e.preventDefault();
      }}
    >
      <div className={classes.blocks}>
        <TetrominoBlocks type={props.hold.type}></TetrominoBlocks>
      </div>
    </div>
  );
});

export default Hold;
