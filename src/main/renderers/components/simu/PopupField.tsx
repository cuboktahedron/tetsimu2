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
  MAX_VISIBLE_FIELD_HEIGHT,
  Vector2
} from "types/core";

type StyleProps = {
  zoom: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "white",
      cursor: "all-scroll",
      height: (props: StyleProps) => 504 * props.zoom,
      outline: "none",
      padding: 10,
      position: "absolute",
      touchAction: "none",
      userSelect: "none",
      width: (props: StyleProps) => 240 * props.zoom,
      zIndex: 1250,
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
  field: FieldState | null;
  zoom: number;
};

const PopupField = React.memo<PopupFieldProps>((props) => {
  const { field } = props;
  const rootRef = React.createRef<HTMLDivElement>();
  const fieldRef = React.createRef<HTMLDivElement>();
  const [position, setPosition] = React.useState<Vector2>({
    x: (window.innerWidth - 240 * props.zoom) / 2,
    y: (window.innerHeight - 504 * props.zoom) / 2,
  });
  const [prevDrag, setPrevDrag] = React.useState<Vector2 | null>(null);

  const classes = useStyles(props);

  const rows = React.useMemo(() => {
    if (field === null) {
      return [];
    }

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

  const closePopup = () => {
    props.onClose();
  };

  const handleCloseClick = () => {
    closePopup();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      closePopup();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (fieldRef.current === null) {
      return;
    }

    fieldRef.current.setPointerCapture(e.pointerId);
    setPrevDrag({ x: e.pageX, y: e.pageY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (fieldRef === null || prevDrag === null) {
      return;
    }

    let x = position.x - (prevDrag.x - e.pageX);
    let y = position.y - (prevDrag.y - e.pageY);
    setPosition({ x, y });
    setPrevDrag({ x: e.pageX, y: e.pageY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    fieldRef.current?.releasePointerCapture(e.pointerId);
    setPrevDrag(null);
  };

  React.useEffect(() => {
    if (props.field !== null) {
      rootRef.current?.focus();
    }
  }, [props.field]);

  if (props.field) {
    return (
      <div
        ref={rootRef}
        className={classes.root}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{ left: position.x, top: position.y }}
      >
        <div className={classes.close} onClick={handleCloseClick}>
          <CloseIcon />
        </div>
        <div
          ref={fieldRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className={classes.field}>
            <div>{rows}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div />;
  }
});

export default PopupField;
