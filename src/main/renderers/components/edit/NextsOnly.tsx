import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { EditContext } from "./Edit";
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
  const { state } = React.useContext(EditContext);
  const styleProps = { zoom: state.zoom };
  const classes = useStyles(styleProps);

  return (
    <div className={classes.root}>
      <Nexts height={672 * state.zoom} />
    </div>
  );
};

export default NextsOnly;
