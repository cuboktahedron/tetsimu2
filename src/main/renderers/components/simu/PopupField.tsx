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
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import {
  FieldCellValue,
  FieldState,
  MAX_VISIBLE_FIELD_HEIGHT
} from "types/core";

type StyleProps = {
  zoom: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "white",
      height: (props: StyleProps) => 504 * props.zoom,
      left: (props: StyleProps) => `calc(50% - (240px * ${props.zoom} / 2))`,
      outline: "none",
      padding: 10,
      position: "fixed",
      top: (props: StyleProps) => `calc(50% - (504px * ${props.zoom} / 2))`,
      userSelect: "none",
      width: (props: StyleProps) => 240 * props.zoom,
    },

    close: {
      alignItems: "center",
      background: "white",
      border: "solid 2px black",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      height: (props: StyleProps) => 32 * props.zoom,
      justifyContent: "center",
      position: "absolute",
      right: -16,
      width: (props: StyleProps) => 32 * props.zoom,
      top: -16,
    },

    field: {
      background: "black",
    },

    row: {
      boxSizing: "border-box",
      borderTop: "solid 1px grey",
      borderLeft: "solid 1px grey",
      height: (props: PopupFieldProps) => 24 * props.zoom,
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

type PopupFieldProps = {
  onClose: () => void;
  field: FieldState;
  zoom: number;
};

const PopupField: React.FC<PopupFieldProps> = (props) => {
  const { field } = props;
  const classes = useStyles(props);

  const fieldRef = React.createRef<HTMLDivElement>();
  React.useEffect(() => {
    fieldRef.current?.focus();
  }, [field]);

  const rows = React.useMemo(() => {
    const rows = field
      .slice(0, MAX_VISIBLE_FIELD_HEIGHT)
      .map((row, rowIndex) => {
        const cols = row.map((cell, colIndex) => {
          let background = cellBackground[cell];

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

    rows.reverse();
    return rows;
  }, [field]);

  const handleCloseClick = () => {
    props.onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      props.onClose();
      e.preventDefault();
    }
  };

  return (
    <div
      ref={fieldRef}
      className={classes.root}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={classes.close} onClick={handleCloseClick}>
        <CloseIcon />
      </div>
      <div className={classes.field}>
        <div>{rows}</div>
      </div>
    </div>
  );
};

export default PopupField;
