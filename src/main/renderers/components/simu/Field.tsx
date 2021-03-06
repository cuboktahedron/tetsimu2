import { createStyles, makeStyles } from "@material-ui/core";
import {
  blue,
  green,
  grey,
  lightBlue,
  orange,
  purple,
  red,
  yellow
} from "@material-ui/core/colors";
import React from "react";
import {
  FieldCellValue,
  FieldState,
  MAX_VISIBLE_FIELD_HEIGHT
} from "types/core";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: "100%",
      position: "absolute",
      userSelect: "none",
      width: "100%",
      zIndex: 10,
    },

    topRow: {
      borderBottom: "solid 3px red",
      height: (props: FieldProps) => 32 * props.zoom,
      position: "absolute",
      width: "100%",
    },

    row: {
      boxSizing: "border-box",
      borderTop: "solid 1px grey",
      borderLeft: "solid 1px grey",
      height: (props: FieldProps) => 32 * props.zoom,
    },
  })
);

const cellBackground = {
  [FieldCellValue.None]: "transparent",
  [FieldCellValue.I]: lightBlue.A100,
  [FieldCellValue.J]: blue.A100,
  [FieldCellValue.L]: orange.A100,
  [FieldCellValue.O]: yellow.A100,
  [FieldCellValue.S]: green.A100,
  [FieldCellValue.T]: purple.A100,
  [FieldCellValue.Z]: red.A100,
  [FieldCellValue.Garbage]: grey.A100,
};

type FieldProps = {
  field: FieldState;
  isDead: boolean;
  zoom: number;
};

const Field = React.memo<FieldProps>((props) => {
  const { field, isDead } = props;
  const classes = useStyles(props);

  const rows = field.slice(0, MAX_VISIBLE_FIELD_HEIGHT).map((row, rowIndex) => {
    const cols = row.map((cell, colIndex) => {
      let background: string;
      if (isDead && cell !== FieldCellValue.None) {
        background = grey.A200;
      } else {
        background = cellBackground[cell];
      }

      return (
        <div
          key={`${rowIndex}:${colIndex}`}
          className={classes.row}
          style={{ background, flex: 1 }}
        >
          <div>&nbsp;</div>
        </div>
      );
    });

    return (
      <div style={{ display: "flex" }} key={rowIndex}>
        {cols}
      </div>
    );
  });

  return (
    <div className={classes.root}>
      <div className={classes.topRow} />
      <div>{rows.reverse()}</div>
    </div>
  );
});

export default Field;
