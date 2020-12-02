import { createStyles, List, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { ReplayContext } from "./Replay";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "white",
      color: "white",
      height: (props: StyleProps) => 672 * props.zoom,
      width: (props: StyleProps) => 64 * props.zoom,
    },

    listItem: {
      padding: 0,
    },

    iconButton: {
      color: theme.palette.primary.dark,
      padding: 0,

      "&:disabled": {},
    },

    icon: {
      height: (props: StyleProps) => 64 * props.zoom,
      width: (props: StyleProps) => 64 * props.zoom,
    },
  })
);

type StyleProps = {
  zoom: number;
};

const Operation: React.FC = () => {
  const { state } = React.useContext(ReplayContext);
  const styleProps = { zoom: state.zoom };

  const classes = useStyles(styleProps);

  return <List className={classes.root} disablePadding={true}></List>;
};

export default Operation;
