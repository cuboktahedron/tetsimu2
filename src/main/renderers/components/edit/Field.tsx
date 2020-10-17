import { createStyles, makeStyles } from "@material-ui/core";
import {
  blue,
  green,
  grey,
  lightBlue,
  orange,
  purple,
  red,
  yellow,
} from "@material-ui/core/colors";
import { changeField } from "ducks/edit/actions";
import React from "react";
import { FieldCellValue, MAX_VISIBLE_FIELD_HEIGHT, Vector2 } from "types/core";
import { EditContext } from "./Edit";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      cursor: "crosshair",
      height: "100%",
      position: "absolute",
      userSelect: "none",
      width: "100%",
      zIndex: 10,
    },

    topRow: {
      borderBottom: "solid 3px red",
      height: (props: StyleProps) => 32 * props.zoom,
      position: "absolute",
      width: "100%",
    },

    row: {
      boxSizing: "border-box",
      borderTop: "solid 1px grey",
      borderLeft: "solid 1px grey",
      height: (props: StyleProps) => 32 * props.zoom,
    },
  })
);

const cellBackground = {
  [FieldCellValue.NONE]: "transparent",
  [FieldCellValue.I]: lightBlue.A100,
  [FieldCellValue.J]: blue.A100,
  [FieldCellValue.L]: orange.A100,
  [FieldCellValue.O]: yellow.A100,
  [FieldCellValue.S]: green.A100,
  [FieldCellValue.T]: purple.A100,
  [FieldCellValue.Z]: red.A100,
  [FieldCellValue.GARBAGE]: grey.A100,
};

type FieldProps = {};
type StyleProps = {
  zoom: number;
} & FieldProps;

const Field: React.FC<FieldProps> = () => {
  const { state, dispatch } = React.useContext(EditContext);
  const [cellPutStarted, setCellPutStarted] = React.useState(false);
  const fieldRef = React.createRef<HTMLDivElement>();

  const field = state.field;
  const styleProps = { zoom: state.zoom };
  const classes = useStyles(styleProps);

  const selectedType = state.tools.selectedCellType;
  const calculatePos = (absX: number, absY: number): Vector2 => {
    if (!fieldRef.current) {
      return {
        x: -1,
        y: -1,
      };
    }
    const width = fieldRef.current.clientWidth;
    const height = fieldRef.current.clientHeight;
    const rect = fieldRef.current.getBoundingClientRect();
    const offsetX = absX - rect.left + window.pageXOffset;
    const offsetY = absY - rect.top + window.pageYOffset;
    const x = Math.trunc(offsetX / (width / 10));
    const y = Math.trunc(offsetY / (height / MAX_VISIBLE_FIELD_HEIGHT));

    return {
      x,
      y: MAX_VISIBLE_FIELD_HEIGHT - (y + 1),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setCellPutStarted(true);

    const pos = calculatePos(e.pageX, e.pageY);
    dispatch(changeField(field, selectedType, pos));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!cellPutStarted) {
      return;
    }

    const pos = calculatePos(e.pageX, e.pageY);
    dispatch(changeField(field, selectedType, pos));
  };

  const handleMouseUp = () => {
    setCellPutStarted(false);
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return (): void => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });

  React.useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return (): void => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const rows = field.slice(0, MAX_VISIBLE_FIELD_HEIGHT).map((row, rowIndex) => {
    const cols = row.map((cell, colIndex) => {
      const background = cellBackground[cell];

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
    <div ref={fieldRef} className={classes.root} onMouseDown={handleMouseDown}>
      <div className={classes.topRow} />
      <div>{rows.reverse()}</div>
    </div>
  );
};

export default Field;
