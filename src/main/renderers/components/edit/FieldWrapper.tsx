import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { EditContext } from "./Edit";
import Field from "./Field";

type StyleProps = {
  zoom: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "black",
      borderRight: "solid 1px grey",
      borderBottom: "solid 1px grey",
      boxSizing: "border-box",
      height: (props: StyleProps) => 672 * props.zoom,
      position: "relative",
      width: (props: StyleProps) => 320 * props.zoom,
    },
  })
);

const FieldWrapper: React.FC = () => {
  const { state } = React.useContext(EditContext);
  const styleProps = { zoom: state.zoom };
  const classes = useStyles(styleProps);

  return (
    <div
      className={classes.root}
      onContextMenu={(e: React.MouseEvent) => {
        e.preventDefault();
      }}
    >
      <Field />
    </div>
  );
};

export default FieldWrapper;
