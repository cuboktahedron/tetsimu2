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
import { buildUpField, changeField } from "ducks/edit/actions";
import React from "react";
import {
  Action,
  FieldCellValue,
  FieldState,
  MAX_FIELD_WIDTH,
  MAX_VISIBLE_FIELD_HEIGHT,
  MouseButton,
  Vector2
} from "types/core";

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
  dispatch: React.Dispatch<Action>;
  field: FieldState;
  isTouchDevice: boolean;
  selectedCellValues: FieldCellValue[];
  zoom: number;
};

const Field = React.memo<FieldProps>((props) => {
  const dispatch = props.dispatch;

  const [editPointerState, setEditPointerState] = React.useState({
    downed: false,
    isLeft: false,
  });
  const fieldRef = React.createRef<HTMLDivElement>();

  const classes = useStyles(props);

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
    const x = Math.trunc(offsetX / (width / MAX_FIELD_WIDTH));
    const y = Math.trunc(offsetY / (height / MAX_VISIBLE_FIELD_HEIGHT));

    return {
      x,
      y: MAX_VISIBLE_FIELD_HEIGHT - (y + 1),
    };
  };

  const cellValueToSet = props.selectedCellValues[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (props.isTouchDevice || editPointerState.downed) {
      return;
    }

    if (e.button !== MouseButton.Left && e.button !== MouseButton.Right) {
      return;
    }

    const isLeft = e.button === MouseButton.Left;
    setEditPointerState({
      downed: true,
      isLeft,
    });

    const pos = calculatePos(e.pageX, e.pageY);
    if (isLeft) {
      dispatch(changeField(props.field, cellValueToSet, pos));
    } else {
      dispatch(changeField(props.field, FieldCellValue.None, pos));
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!editPointerState.downed) {
      return;
    }

    const pos = calculatePos(e.pageX, e.pageY);
    if (editPointerState.isLeft) {
      dispatch(changeField(props.field, cellValueToSet, pos));
    } else {
      dispatch(changeField(props.field, FieldCellValue.None, pos));
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!editPointerState.downed) {
      return;
    }

    if (
      (editPointerState.isLeft && e.button === MouseButton.Left) ||
      (!editPointerState.isLeft && e.button === MouseButton.Right)
    ) {
      setEditPointerState({
        downed: false,
        isLeft: false,
      });
    }
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return (): void => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [props.field, editPointerState]);

  React.useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return (): void => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [props.field, editPointerState]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];

    setEditPointerState({
      downed: true,
      isLeft: true,
    });

    const pos = calculatePos(touch.pageX, touch.pageY);
    dispatch(changeField(props.field, cellValueToSet, pos));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!editPointerState.downed) {
      return;
    }

    const touch = e.touches[0];
    const pos = calculatePos(touch.pageX, touch.pageY);
    dispatch(changeField(props.field, cellValueToSet, pos));
  };

  const handleTouchEnd = () => {
    setEditPointerState({
      downed: false,
      isLeft: false,
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      dispatch(buildUpField(props.field, 1));
    } else {
      dispatch(buildUpField(props.field, -1));
    }
  };

  const rows = React.useMemo(
    () =>
      props.field
        .slice(0, MAX_VISIBLE_FIELD_HEIGHT)
        .map((row, rowIndex) => {
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
        })
        .reverse(),
    [props.field]
  );

  return (
    <div
      ref={fieldRef}
      className={classes.root}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className={classes.topRow} />
      <div>{rows}</div>
    </div>
  );
});

export default Field;
