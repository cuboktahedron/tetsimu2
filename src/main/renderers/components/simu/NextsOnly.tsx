import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import Nexts from "./Nexts";
import { SimuContext } from "./Simu";

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
  const { state } = React.useContext(SimuContext);
  const styleProps = { zoom: state.zoom };
  const classes = useStyles(styleProps);

  return (
    <div className={classes.root}>
      <Nexts height={672 * state.zoom} />
    </div>
  );
};

export default NextsOnly;
