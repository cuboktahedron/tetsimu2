import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { SimuContext } from "./Simu";
import ActiveField from "./ActiveField";
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
  const { state } = React.useContext(SimuContext);
  const styleProps = { zoom: state.zoom };
  const classes = useStyles(styleProps);

  return (
    <div className={classes.root}>
      <Field />
      <ActiveField />
    </div>
  );
};

export default FieldWrapper;
