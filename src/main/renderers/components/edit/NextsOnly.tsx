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

type StyleProps = { zoom: number };

const NextsOnly: React.FC = () => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.edit;
  const styleProps = { zoom: state.zoom };
  const classes = useStyles(styleProps);

  return (
    <div className={classes.root}>
      <Nexts
        dispatch={dispatch}
        height={672 * state.zoom}
        nexts={state.nexts}
        tools={state.tools}
        zoom={state.zoom}
      />
    </div>
  );
};

export default NextsOnly;
