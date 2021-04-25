import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { RootContext } from "../App";
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
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.edit;
  const styleProps = { zoom: state.zoom };
  const classes = useStyles(styleProps);

  return (
    <div
      className={classes.root}
      onContextMenu={(e: React.MouseEvent) => {
        e.preventDefault();
      }}
    >
      <Field
        dispatch={dispatch}
        field={state.field}
        isTouchDevice={state.env.isTouchDevice}
        selectedCellValues={state.tools.selectedCellValues}
        zoom={state.zoom}
      />
    </div>
  );
};

export default FieldWrapper;
