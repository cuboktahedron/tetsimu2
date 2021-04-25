import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { RootContext } from "../App";
import Nexts from "./Nexts";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: (props: StyleProps) => 672 * props.zoom,
    },
  })
);

type NextsOnlyProps = {};
type StyleProps = { zoom: number } & NextsOnlyProps;

const NextsOnly: React.FC<NextsOnlyProps> = () => {
  const state = React.useContext(RootContext).state.simu;
  const styleProps = { zoom: state.zoom };
  const classes = useStyles(styleProps);

  return (
    <div className={classes.root}>
      <Nexts
        config={state.config}
        garbages={state.garbages}
        height={672 * state.zoom}
        nexts={state.nexts}
        zoom={state.zoom}
      />
    </div>
  );
};

export default NextsOnly;
