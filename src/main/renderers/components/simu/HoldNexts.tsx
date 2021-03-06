import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { RootContext } from "../App";
import Hold from "./Hold";
import Nexts from "./Nexts";

const holdSize = (props: StyleProps): number => {
  return (96 - 4 * Math.max(props.nextNums - 4, 0)) * props.zoom;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    hold: {
      border: "solid 4px grey",
      boxSizing: "border-box",
      height: (props: StyleProps) => holdSize(props),
      margin: "0 auto",
      width: (props: StyleProps) => holdSize(props),
    },
    holdTitle: {
      background: "silver",
      boxSizing: "border-box",
      borderRadius: "8px",
      overflow: "hidden",
      margin: "4px auto",
      lineHeight: "24px",
      textAlign: "center",
      width: (props: StyleProps) => holdSize(props),
    },
    nexts: {
      height: (props: StyleProps) =>
        672 * props.zoom - holdSize(props) - 32 - 8,
    },
  })
);

type HoldNexts = {};

type StyleProps = {
  nextNums: number;
  zoom: number;
} & HoldNexts;

const HoldNexts: React.FC<HoldNexts> = () => {
  const state = React.useContext(RootContext).state.simu;
  const config = state.config;

  const styleProps = { nextNums: config.nextNum, zoom: state.zoom };
  const classes = useStyles(styleProps);

  return (
    <div className={classes.root}>
      <div className={classes.nexts}>
        <Nexts
          config={state.config}
          height={672 * styleProps.zoom - holdSize(styleProps) - 32 - 8}
          garbages={state.garbages}
          nexts={state.nexts}
          zoom={state.zoom}
        />
      </div>
      <div className={classes.holdTitle}>Hold</div>
      <div className={classes.hold}>
        <Hold hold={state.hold} />
      </div>
    </div>
  );
};

export default HoldNexts;
