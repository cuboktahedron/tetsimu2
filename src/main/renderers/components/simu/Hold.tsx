import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { HoldState } from "types/core";
import TetrominoBlocks from "../core/TetrominoBlocks";

type HoldProps = {
  hold: HoldState;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
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
  const hold = props.hold;

  const classes = useStyles(props);
  return (
    <div className={classes.root}>
      <div className={classes.blocks}>
        <TetrominoBlocks type={hold.type}></TetrominoBlocks>
      </div>
    </div>
  );
});

export default Hold;
