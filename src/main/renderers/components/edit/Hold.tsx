import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { Tetromino } from "types/core";
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
  const { state } = React.useContext(EditContext);
  const hold = state.hold;

  const classes = useStyles(hold);
  return (
    <div className={classes.root}>
      <div className={classes.blocks}>
        <TetrominoBlocks type={hold.type}></TetrominoBlocks>
      </div>
    </div>
  );
};

export default Hold;
